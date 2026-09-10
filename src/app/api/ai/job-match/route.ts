import { groq } from '@/lib/ai/groq'
import { checkRateLimit } from '@/lib/rate-limit'
import { getCurrentUser } from '@/lib/firebase/get-current-user'
import { adminDb } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { jobMatchSystemPrompt, jobMatchUserPrompt } from '@/lib/ai/prompts/job-match'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { allowed } = await checkRateLimit(user.id, '/api/ai/job-match')
  if (!allowed) return NextResponse.json({ error: 'Limite de pedidos atingido. Tenta novamente em 1 hora.' }, { status: 429 })

  const { cvText, jobTitle, jobDescription, company } = await req.json()
  if (!cvText || !jobDescription) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const { choices } = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: jobMatchSystemPrompt },
      { role: 'user', content: jobMatchUserPrompt(cvText, jobTitle, jobDescription, company) }
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  })

  const text = choices[0]?.message?.content || ''

  let analysis
  try {
    analysis = JSON.parse(text)
  } catch {
    return NextResponse.json({ error: 'Erro ao processar resposta da AI' }, { status: 500 })
  }

  const jobMatchData = {
    job_title: jobTitle,
    job_description: jobDescription,
    company: company || null,
    match_score: analysis.match_score,
    matched_keywords: analysis.matched_keywords,
    missing_keywords: analysis.missing_keywords,
    suggestions: analysis.suggestions,
    created_at: new Date().toISOString(),
  }
  const docRef = await adminDb.collection('users').doc(user.id).collection('jobMatches').add(jobMatchData)
  const jobMatch = { id: docRef.id, ...jobMatchData }

  return NextResponse.json({ jobMatch, analysis })
}