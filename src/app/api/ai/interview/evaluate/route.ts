import { groq } from '@/lib/ai/groq'
import { checkRateLimit } from '@/lib/rate-limit'
import { getCurrentUser } from '@/lib/firebase/get-current-user'
import { NextRequest, NextResponse } from 'next/server'
import { interviewEvaluateSystemPrompt, interviewEvaluateUserPrompt } from '@/lib/ai/prompts/interview'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { allowed } = await checkRateLimit(user.id, '/api/ai/interview/evaluate')
  if (!allowed) return NextResponse.json({ error: 'Limite de pedidos atingido. Tenta novamente em 1 hora.' }, { status: 429 })

  const { question, answer, jobTitle } = await req.json()
  if (!question || !answer) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const { choices } = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: interviewEvaluateSystemPrompt },
      { role: 'user', content: interviewEvaluateUserPrompt(question, answer, jobTitle) }
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  })

  const text = choices[0]?.message?.content || ''

  let evaluation
  try {
    evaluation = JSON.parse(text)
  } catch {
    return NextResponse.json({ error: 'Erro ao processar resposta da AI' }, { status: 500 })
  }

  return NextResponse.json({ evaluation })
}