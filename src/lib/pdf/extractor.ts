import PDFParser from 'pdf2json'

/**
 * Extrai o texto de um PDF localmente (sem custo, sem rate limit externo).
 * Funciona para PDFs com camada de texto real (a esmagadora maioria dos CVs,
 * exportados de Word/Google Docs/Canva/LaTeX/etc). Devolve string vazia em
 * caso de erro ou PDF sem texto extraível (ex: digitalizado como imagem) —
 * nesses casos o chamador deve recorrer ao OCR da Mistral como fallback.
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve) => {
    const pdfParser = new PDFParser()

    pdfParser.on('pdfParser_dataError', () => resolve(''))
    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      const raw = pdfData.Pages
        .map((page) =>
          page.Texts
            .map((t) => t.R.map((r) => decodeText(r.T)).join(''))
            .join(' ')
        )
        .join('\n')

      const cleaned = raw
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim()

      resolve(cleaned)
    })

    try {
      pdfParser.parseBuffer(buffer)
    } catch {
      resolve('')
    }
  })
}

function decodeText(text: string): string {
  try {
    return decodeURIComponent(text)
  } catch {
    return text
  }
}
