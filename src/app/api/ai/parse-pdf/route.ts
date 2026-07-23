import { NextRequest, NextResponse } from 'next/server'
import { Mistral } from '@mistralai/mistralai'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY! })

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { allowed } = await checkRateLimit(user.id, '/api/ai/parse-pdf')
  if (!allowed) return NextResponse.json({ error: 'Limite de pedidos atingido. Tenta novamente em 1 hora.' }, { status: 429 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

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

  if (!text.trim() || text.trim().length < 50) {
    return NextResponse.json({ text: '', error: 'Não foi possível extrair texto' })
  }

  return NextResponse.json({ text })
}