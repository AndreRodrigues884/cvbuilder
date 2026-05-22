import { groq } from '@/lib/ai/groq'
import { checkRateLimit } from '@/lib/rate-limit'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { allowed } = await checkRateLimit(user.id, '/api/ai/interview/generate')
  if (!allowed) return NextResponse.json({ error: 'Limite de pedidos atingido. Tenta novamente em 1 hora.' }, { status: 429 })

  const { jobTitle, company } = await req.json()
  if (!jobTitle) return NextResponse.json({ error: 'Missing jobTitle' }, { status: 400 })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'És um especialista em recrutamento. Generates perguntas de entrevista realistas e relevantes. Respondes SEMPRE em JSON válido.'
      },
      {
        role: 'user',
        content: `Gera 8 perguntas de entrevista para a vaga de ${jobTitle}${company ? ` na empresa ${company}` : ''}.

Inclui uma mistura de:
- Perguntas comportamentais (ex: "Fala-me de uma situação em que...")
- Perguntas técnicas relevantes para o cargo
- Perguntas sobre motivação e fit cultural
- Perguntas situacionais

Responde APENAS em JSON válido:
{
  "questions": [
    {
      "question": "<pergunta>",
      "category": "<behavioral|technical|motivational|situational>",
      "tip": "<dica curta sobre como responder bem a esta pergunta>"
    }
  ]
}`
      }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  })

  const text = completion.choices[0]?.message?.content || ''
  const data = JSON.parse(text)

  // Guardar sessão no Supabase
  const { data: session } = await supabase
    .from('interview_sessions')
    .insert({ user_id: user.id, job_title: jobTitle, company: company || null })
    .select()
    .single()

  // Guardar perguntas
  if (session) {
    await supabase.from('interview_questions').insert(
      data.questions.map((q: any, i: number) => ({
        session_id: session.id,
        question: q.question,
        category: q.category,
        order_index: i,
      }))
    )
  }

  return NextResponse.json({ questions: data.questions, sessionId: session?.id })
}