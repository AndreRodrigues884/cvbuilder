import { groq } from '@/lib/ai/groq'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

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

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'És um especialista em recrutamento e otimização de CVs. Respondes SEMPRE em JSON válido, sem markdown, sem texto adicional, sem blocos de código. Apenas JSON puro.'
      },
      {
        role: 'user',
        content: `Analisa o seguinte CV e responde APENAS em JSON válido, sem markdown, sem \`\`\`json, sem texto antes ou depois.${jobContext ? ' Tem em conta a vaga a que o candidato se está a candidatar na tua análise, ajustando o score ATS, keywords e sugestões de acordo com os requisitos da vaga.' : ''}

CV:
${cleanedText}${jobContext}

Responde com este JSON exato:
{
  "ats_score": 75,
  "overall_feedback": "feedback aqui",
  "strengths": ["ponto 1", "ponto 2", "ponto 3"],
  "weaknesses": ["fraco 1", "fraco 2", "fraco 3"],
  "suggestions": ["sugestão 1", "sugestão 2", "sugestão 3", "sugestão 4"],
  "keywords_found": ["keyword 1", "keyword 2"],
  "keywords_missing": ["keyword 1", "keyword 2"]
}`
      }
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' },
  })

  const text = completion.choices[0]?.message?.content || ''

  let analysis
  try {
    analysis = JSON.parse(text)
  } catch (e) {
    console.error('JSON parse error:', text)
    return NextResponse.json({ error: 'Erro ao processar resposta da AI' }, { status: 500 })
  }

  const { data: review } = await supabase
    .from('ai_reviews')
    .insert({
      user_id: user.id,
      cv_id: cvId || null,
      ats_score: analysis.ats_score,
      overall_feedback: analysis.overall_feedback,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      suggestions: analysis.suggestions,
      keywords_found: analysis.keywords_found,
      keywords_missing: analysis.keywords_missing,
    })
    .select()
    .single()

  return NextResponse.json({ review, analysis })
}