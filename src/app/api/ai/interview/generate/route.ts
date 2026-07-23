import { groq } from '@/lib/ai/groq'
import { checkRateLimit } from '@/lib/rate-limit'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { interviewGenerateSystemPrompt, interviewGenerateUserPrompt } from '@/lib/ai/prompts/interview'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { allowed } = await checkRateLimit(user.id, '/api/ai/interview/generate')
  if (!allowed) return NextResponse.json({ error: 'Limite de pedidos atingido. Tenta novamente em 1 hora.' }, { status: 429 })

  const { jobTitle, company } = await req.json()
  if (!jobTitle) return NextResponse.json({ error: 'Missing jobTitle' }, { status: 400 })

  const { choices } = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: interviewGenerateSystemPrompt },
      { role: 'user', content: interviewGenerateUserPrompt(jobTitle, company) }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  })

  const text = choices[0]?.message?.content || ''

  let data
  try {
    data = JSON.parse(text)
  } catch {
    return NextResponse.json({ error: 'Erro ao processar resposta da AI' }, { status: 500 })
  }

  const { data: session } = await supabase
    .from('interview_sessions')
    .insert({ user_id: user.id, job_title: jobTitle, company: company || null })
    .select()
    .single()

  if (session) {
    await supabase.from('interview_questions').insert(
      data.questions.map((q: { question: string; category: string }, i: number) => ({
        session_id: session.id,
        question: q.question,
        category: q.category,
        order_index: i,
      }))
    )
  }

  return NextResponse.json({ questions: data.questions, sessionId: session?.id })
}