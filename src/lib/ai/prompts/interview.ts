export const interviewGenerateSystemPrompt = `És um especialista em recrutamento. Generates perguntas de entrevista realistas e relevantes. Respondes SEMPRE em JSON válido.`

export function interviewGenerateUserPrompt(jobTitle: string, company: string): string {
  return `Gera 8 perguntas de entrevista para a vaga de ${jobTitle}${company ? ` na empresa ${company}` : ''}.

Inclui uma mistura de:
- Perguntas comportamentais (ex: "Fala-me de uma situação em que...")
- Perguntas técnicas relevantes para o cargo
- Perguntas sobre motivação e fit cultural
- Perguntas situacionais

Responde APENAS em JSON válido:
{
  "questions": [
    {
      "question": "<pergunta>",
      "category": "<behavioral|technical|motivational|situational>",
      "tip": "<dica curta sobre como responder bem a esta pergunta>"
    }
  ]
}`
}

export const interviewEvaluateSystemPrompt = `És um entrevistador experiente. Avalias respostas de entrevista de forma construtiva e honesta. Respondes SEMPRE em JSON válido.`

export function interviewEvaluateUserPrompt(question: string, answer: string, jobTitle: string): string {
  return `Avalia esta resposta de entrevista para a vaga de ${jobTitle}.

Pergunta: ${question}
Resposta do candidato: ${answer}

Responde APENAS em JSON válido:
{
  "score": <número de 0 a 10>,
  "feedback": "<feedback construtivo em 2-3 frases>",
  "positive": "<o que foi bem na resposta>",
  "improve": "<o que podia ser melhorado>",
  "example_answer": "<exemplo de uma resposta forte para esta pergunta>"
}`
}