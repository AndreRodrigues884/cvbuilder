import { groq } from '@/lib/ai/groq'
import { checkRateLimit } from '@/lib/rate-limit'
import { getCurrentUser } from '@/lib/firebase/get-current-user'
import { adminDb } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { interviewGenerateSystemPrompt, interviewGenerateUserPrompt } from '@/lib/ai/prompts/interview'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { allowed } = await checkRateLimit(user.id, '/api/ai/interview/generate')
  if (!allowed) return NextResponse.json({ error: 'Limite de pedidos atingido. Tenta novamente em 1 hora.' }, { status: 429 })

  const { jobTitle, company } = await req.json()
  if (!jobTitle) return NextResponse.json({ error: 'Missing jobTitle' }, { status: 400 })

  const { choices } = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
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

  const docRef = await adminDb.collection('users').doc(user.id).collection('interviewSessions').add({
    job_title: jobTitle,
    company: company || null,
    questions: data.questions.map((q: { question: string; category: string }) => ({
      question: q.question,
      category: q.category,
    })),
    created_at: new Date().toISOString(),
  })

  return NextResponse.json({ questions: data.questions, sessionId: docRef.id })
}