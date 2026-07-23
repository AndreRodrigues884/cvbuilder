import { groq } from '@/lib/ai/groq'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { getCachedReview } from '@/lib/ai/cache'
import { reviewSystemPrompt, reviewUserPrompt } from '@/lib/ai/prompts/review'


export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { allowed } = await checkRateLimit(user.id, '/api/ai/review')
  if (!allowed) return NextResponse.json({ error: 'Limite de pedidos atingido. Tenta novamente em 1 hora.' }, { status: 429 })

  const { cvText, cvId, jobTitle, jobDescription } = await req.json()
  if (!cvText) return NextResponse.json({ error: 'CV text is required' }, { status: 400 })

  const cleanedText = cvText
    .replace(/[^\x20-\x7E\n\r\t\u00C0-\u024F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 4000)

  const jobContext = jobTitle || jobDescription
    ? `\n\nVaga a que se candidata: ${jobTitle || ''}${jobDescription ? `\nDescrição: ${jobDescription}` : ''}`
    : ''

  // Depois de limpar o texto e antes de chamar o Groq:
  const textHash = cleanedText.substring(0, 500).split('').reduce((hash: number, char: string) => {
    return ((hash << 5) - hash) + char.charCodeAt(0) | 0
  }, 0).toString(36)

  // Verifica cache
  const cached = await getCachedReview(user.id, cleanedText)
  if (cached) {
    console.log('Cache HIT — a devolver resultado guardado')
    return NextResponse.json({
      review: cached,
      analysis: {
        ats_score: cached.ats_score,
        overall_feedback: cached.overall_feedback,
        strengths: cached.strengths,
        weaknesses: cached.weaknesses,
        suggestions: cached.suggestions,
        keywords_found: cached.keywords_found,
        keywords_missing: cached.keywords_missing,
      },
      fromCache: true
    })
  }


  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: reviewSystemPrompt
      },
      {
        role: 'user',
        content: reviewUserPrompt(cleanedText, jobContext)
      }
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' },
  })
}