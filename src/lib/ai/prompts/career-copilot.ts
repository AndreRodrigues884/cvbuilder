export const careerCopilotSystemPrompt = `És um career coach experiente. Dás conselhos práticos, realistas e acionáveis sobre desenvolvimento de carreira. Respondes SEMPRE em JSON válido.`

export function careerCopilotUserPrompt(currentPosition: string, targetRole: string, yearsExperience: string, currentSkills: string): string {
  return `Cria um plano de carreira detalhado para esta pessoa:

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