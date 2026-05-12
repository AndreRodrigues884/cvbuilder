
//Function to extract text from PDF file
export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Extração simples de texto do PDF
  const text = buffer.toString('utf-8')
  
  // Limpa caracteres não imprimíveis e extrai texto legível
  const cleaned = text
    .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return cleaned
}