import { groq } from '@/lib/ai/groq'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { cvText, jobTitle, jobDescription, company } = await req.json()
  if (!cvText || !jobDescription) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'És um especialista em recrutamento. Analisas CVs e descrições de vagas. Respondes SEMPRE em JSON válido. NUNCA sugeres adicionar informação falsa ao CV — apenas realças ou reorganizas o que já existe.'
      },
      {
        role: 'user',
        content: `Analisa o match entre este CV e esta vaga de emprego.

CV:
${cvText}

Vaga: ${jobTitle} ${company ? `na empresa ${company}` : ''}
Descrição da vaga:
${jobDescription}

Responde APENAS em JSON válido:
{
  "match_score": <número de 0 a 100>,
  "summary": "<resumo do match em 2-3 frases>",
  "matched_keywords": ["<keyword que está no CV e na vaga>"],
  "missing_keywords": ["<keyword importante na vaga mas ausente no CV>"],
  "strengths": ["<ponto onde o CV se alinha bem com a vaga>"],
  "gaps": ["<lacuna entre o CV e os requisitos da vaga>"],
  "suggestions": ["<sugestão concreta para adaptar o CV a esta vaga, sem inventar informação>"],
  "adapted_summary": "<versão melhorada do resumo profissional do CV adaptada a esta vaga, usando apenas informação real do CV>"
}`
      }
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  })

  const text = completion.choices[0]?.message?.content || ''
  const analysis = JSON.parse(text)

  const { data: jobMatch } = await supabase
    .from('job_matches')
    .insert({
      user_id: user.id,
      job_title: jobTitle,
      job_description: jobDescription,
      company: company || null,
      match_score: analysis.match_score,
      matched_keywords: analysis.matched_keywords,
      missing_keywords: analysis.missing_keywords,
      suggestions: analysis.suggestions,
    })
    .select()
    .single()

  return NextResponse.json({ jobMatch, analysis })
}