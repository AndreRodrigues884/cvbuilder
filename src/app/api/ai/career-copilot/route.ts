import { groq } from '@/lib/ai/groq'
import { checkRateLimit } from '@/lib/rate-limit'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { careerCopilotSystemPrompt, careerCopilotUserPrompt } from '@/lib/ai/prompts/career-copilot'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { allowed } = await checkRateLimit(user.id, '/api/ai/career-copilot')
  if (!allowed) return NextResponse.json({ error: 'Limite de pedidos atingido. Tenta novamente em 1 hora.' }, { status: 429 })

  const { currentPosition, targetRole, yearsExperience, currentSkills } = await req.json()
  if (!targetRole) return NextResponse.json({ error: 'Missing targetRole' }, { status: 400 })

  const { choices } = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: careerCopilotSystemPrompt },
      { role: 'user', content: careerCopilotUserPrompt(currentPosition, targetRole, yearsExperience, currentSkills) }
    ],
    temperature: 0.4,
    response_format: { type: 'json_object' },
  })

  const text = choices[0]?.message?.content || ''

  let plan
  try {
    plan = JSON.parse(text)
  } catch {
    return NextResponse.json({ error: 'Erro ao processar resposta da AI' }, { status: 500 })
  }

  await supabase.from('career_plans').insert({
    user_id: user.id,
    current_position: currentPosition || null,
    target_role: targetRole,
    timeline_months: plan.timeline_months,
    skills_to_learn: plan.skills_to_learn.map((s: { skill: string }) => s.skill),
    certifications_recommended: plan.certifications.map((c: { name: string }) => c.name),
    action_plan: plan.action_plan,
  })

  return NextResponse.json({ plan })
}