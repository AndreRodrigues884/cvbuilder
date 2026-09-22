export const reviewSystemPrompt = `És um especialista em recrutamento e otimização de CVs. Respondes SEMPRE em JSON válido, sem markdown, sem texto adicional, sem blocos de código. Apenas JSON puro.`

export function reviewUserPrompt(cleanedText: string, jobContext: string): string {
  return `Analisa o seguinte CV e responde APENAS em JSON válido, sem markdown, sem \`\`\`json, sem texto antes ou depois.${jobContext ? ' Tem em conta a vaga a que o candidato se está a candidatar na tua análise, ajustando o score ATS, keywords e sugestões de acordo com os requisitos da vaga.' : ''}

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