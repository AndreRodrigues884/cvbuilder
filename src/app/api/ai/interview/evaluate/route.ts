import { groq } from '@/lib/ai/groq'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { question, answer, jobTitle, questionId } = await req.json()
  if (!question || !answer) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'És um entrevistador experiente. Avalias respostas de entrevista de forma construtiva e honesta. Respondes SEMPRE em JSON válido.'
      },
      {
        role: 'user',
        content: `Avalia esta resposta de entrevista para a vaga de ${jobTitle}.

Pergunta: ${question}
Resposta do candidato: ${answer}

Responde APENAS em JSON válido:
{
  "score": <número de 0 a 10>,
  "feedback": "<feedback construtivo em 2-3 frases>",
  "positive": "<o que foi bem na resposta>",
  "improve": "<o que podia ser melhorado>",
  "example_answer": "<exemplo de uma resposta forte para esta pergunta>"
}`
      }
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  })

  const text = completion.choices[0]?.message?.content || ''
  const evaluation = JSON.parse(text)

  // Guardar avaliação
  if (questionId) {
    await supabase
      .from('interview_questions')
      .update({
        user_answer: answer,
        ai_feedback: evaluation.feedback,
        score: evaluation.score,
      })
      .eq('id', questionId)
  }

  return NextResponse.json({ evaluation })
}