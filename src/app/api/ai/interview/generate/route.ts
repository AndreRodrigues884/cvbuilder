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

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: interviewGenerateSystemPrompt
      },
      {
        role: 'user',
        content: interviewGenerateUserPrompt(jobTitle, company)
      }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  })
}