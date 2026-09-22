export const jobMatchSystemPrompt = `És um especialista em recrutamento. Analisas CVs e descrições de vagas. Respondes SEMPRE em JSON válido. NUNCA sugeres adicionar informação falsa ao CV — apenas realças ou reorganizas o que já existe.`

export function jobMatchUserPrompt(cvText: string, jobTitle: string, company: string, jobDescription: string): string {
    return `Analisa o match entre este CV e esta vaga de emprego.

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