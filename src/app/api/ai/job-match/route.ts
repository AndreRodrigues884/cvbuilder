import { groq } from '@/lib/ai/groq'
import { checkRateLimit } from '@/lib/rate-limit'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { jobMatchSystemPrompt, jobMatchUserPrompt } from '@/lib/ai/prompts/job-match'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { allowed } = await checkRateLimit(user.id, '/api/ai/job-match')
  if (!allowed) return NextResponse.json({ error: 'Limite de pedidos atingido. Tenta novamente em 1 hora.' }, { status: 429 })

  const { cvText, jobTitle, jobDescription, company } = await req.json()
  if (!cvText || !jobDescription) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: jobMatchSystemPrompt
      },
      {
        role: 'user',
        content: jobMatchUserPrompt(cvText, jobTitle, jobDescription, company)
      }
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  })

}