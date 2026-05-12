import { NextRequest, NextResponse } from 'next/server'
import PDFParser from 'pdf2json'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())

  const text = await new Promise<string>((resolve, reject) => {
    const pdfParser = new (PDFParser as any)(null, 1)

    pdfParser.on('pdfParser_dataReady', () => {
      const text = pdfParser.getRawTextContent()
      resolve(text)
    })

    pdfParser.on('pdfParser_dataError', (err: any) => {
      reject(err)
    })

    pdfParser.parseBuffer(buffer)
  })

  console.log('Texto extraído:', text.substring(0, 300))

  if (!text.trim() || text.trim().length < 50) {
    return NextResponse.json({ text: '', error: 'Não foi possível extrair texto' })
  }

  return NextResponse.json({ text })
}