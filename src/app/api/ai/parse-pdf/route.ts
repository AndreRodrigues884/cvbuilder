import { NextRequest, NextResponse } from 'next/server'
import { Mistral } from '@mistralai/mistralai'
import { getCurrentUser } from '@/lib/firebase/get-current-user'
import { checkRateLimit } from '@/lib/rate-limit'
import { extractTextFromPDF } from '@/lib/pdf/extractor'

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY! })

const MIN_TEXT_LENGTH = 50
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB — um CV a sério nunca chega perto disto

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: 'Ficheiro demasiado grande (máximo 5MB)' }, { status: 413 })
  }

  // Proteção contra abuso — aplica-se a todos os pedidos, mesmo os que só
  // usam extração local (essa não gasta quota externa, mas continua a
  // consumir CPU/memória da função serverless a cada pedido).
  const { allowed: allowedLocal } = await checkRateLimit(user.id, '/api/ai/parse-pdf/local')
  if (!allowedLocal) return NextResponse.json({ error: 'Limite de pedidos atingido. Tenta novamente em 1 hora.' }, { status: 429 })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // 1. Extração local primeiro — grátis, funciona para a esmagadora maioria
  // dos CVs (qualquer PDF com camada de texto real).
  const localText = await extractTextFromPDF(buffer)
  if (localText.length >= MIN_TEXT_LENGTH) {
    return NextResponse.json({ text: localText })
  }

  // 2. Fallback: OCR da Mistral, só para PDFs sem texto extraível (ex:
  // digitalizados/fotografados). Só aqui é que vale a pena aplicar o rate
  // limit e gastar quota da Mistral.
  const { allowed } = await checkRateLimit(user.id, '/api/ai/parse-pdf')
  if (!allowed) return NextResponse.json({ error: 'Limite de pedidos atingido. Tenta novamente em 1 hora.' }, { status: 429 })

  const uploaded = await mistral.files.upload({
    file: {
      fileName: file.name,
      content: buffer,
    },
    purpose: 'ocr',
  })

  const signedUrl = await mistral.files.getSignedUrl({ fileId: uploaded.id })

  const result = await mistral.ocr.process({
    model: 'mistral-ocr-latest',
    document: {
      type: 'document_url',
      documentUrl: signedUrl.url,
    },
  })

  const text = result.pages.map((page: { markdown: string }) => page.markdown).join('\n\n')

  await mistral.files.delete({ fileId: uploaded.id })

  if (!text.trim() || text.trim().length < MIN_TEXT_LENGTH) {
    return NextResponse.json({ text: '', error: 'Não foi possível extrair texto' })
  }

  return NextResponse.json({ text })
}
