import { groq } from '@/lib/ai/groq'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { currentPosition, targetRole, yearsExperience, currentSkills } = await req.json()
  if (!targetRole) return NextResponse.json({ error: 'Missing targetRole' }, { status: 400 })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'És um career coach experiente. Dás conselhos práticos, realistas e acionáveis sobre desenvolvimento de carreira. Respondes SEMPRE em JSON válido.'
      },
      {
        role: 'user',
        content: `Cria um plano de carreira detalhado para esta pessoa:

Cargo atual: ${currentPosition || 'Não especificado'}
Cargo objetivo: ${targetRole}
Anos de experiência: ${yearsExperience || 'Não especificado'}
Skills atuais: ${currentSkills || 'Não especificado'}

Responde APENAS em JSON válido:
{
  "overview": "<resumo do plano em 2-3 frases>",
  "timeline_months": <número estimado de meses para atingir o objetivo>,
  "current_level": "<avaliação honesta do nível atual>",
  "gap_analysis": "<análise das lacunas entre o nível atual e o objetivo>",
  "skills_to_learn": [
    {
      "skill": "<nome da skill>",
      "priority": "<high|medium|low>",
      "reason": "<porque é importante>",
      "resources": ["<recurso gratuito para aprender>"]
    }
  ],
  "certifications": [
    {
      "name": "<nome da certificação>",
      "provider": "<entidade>",
      "priority": "<high|medium|low>",
      "free": <true|false>
    }
  ],
  "action_plan": [
    {
      "phase": "<nome da fase ex: Fase 1 - Fundamentos>",
      "duration": "<ex: Meses 1-3>",
      "goals": ["<objetivo concreto>"],
      "actions": ["<ação específica>"]
    }
  ],
  "tips": ["<conselho prático e específico>"]
}`
      }
    ],
    temperature: 0.4,
    response_format: { type: 'json_object' },
  })

  const text = completion.choices[0]?.message?.content || ''
  const plan = JSON.parse(text)

  await supabase.from('career_plans').insert({
    user_id: user.id,
    current_position: currentPosition || null,
    target_role: targetRole,
    timeline_months: plan.timeline_months,
    skills_to_learn: plan.skills_to_learn.map((s: any) => s.skill),
    certifications_recommended: plan.certifications.map((c: any) => c.name),
    action_plan: plan.action_plan,
  })

  return NextResponse.json({ plan })
}