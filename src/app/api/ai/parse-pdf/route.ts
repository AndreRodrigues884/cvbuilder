import { NextRequest, NextResponse } from 'next/server'
import { Mistral } from '@mistralai/mistralai'

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY! })

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Upload do ficheiro para o Mistral
  const uploaded = await mistral.files.upload({
    file: {
      fileName: file.name,
      content: buffer,
    },
    purpose: 'ocr' as any,
  })

  // Obter URL assinado
  const signedUrl = await mistral.files.getSignedUrl({ fileId: uploaded.id })

  // Processar OCR
  const result = await mistral.ocr.process({
    model: 'mistral-ocr-latest',
    document: {
      type: 'document_url',
      documentUrl: signedUrl.url,
    },
  })

  // Extrair texto de todas as páginas
  const text = result.pages.map((page: any) => page.markdown).join('\n\n')

  // Apagar ficheiro após uso
  await mistral.files.delete({ fileId: uploaded.id })

  console.log('Texto extraído (primeiros 300 chars):', text.substring(0, 300))

  if (!text.trim() || text.trim().length < 50) {
    return NextResponse.json({ text: '', error: 'Não foi possível extrair texto' })
  }

  return NextResponse.json({ text })
}