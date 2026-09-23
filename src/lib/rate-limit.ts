import { adminDb } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'

const LIMITS: Record<string, { requests: number; windowMinutes: number }> = {
  '/api/ai/review': { requests: 10, windowMinutes: 60 },
  '/api/ai/job-match': { requests: 10, windowMinutes: 60 },
  '/api/ai/interview/generate': { requests: 10, windowMinutes: 60 },
  '/api/ai/interview/evaluate': { requests: 30, windowMinutes: 60 },
  '/api/ai/career-copilot': { requests: 5, windowMinutes: 60 },
  '/api/ai/parse-pdf': { requests: 20, windowMinutes: 60 },
  // Proteção contra abuso, aplicada a todos os pedidos de parse-pdf (mesmo
  // extração local, que não tem custo de API mas continua a gastar CPU/
  // memória da função serverless). Mais generoso que o limite específico da
  // Mistral acima, que só se aplica ao fallback de OCR.
  '/api/ai/parse-pdf/local': { requests: 30, windowMinutes: 60 },
}

function endpointSlug(endpoint: string): string {
  return endpoint.replace(/[^a-zA-Z0-9]/g, '_')
}

export async function checkRateLimit(userId: string, endpoint: string): Promise<{ allowed: boolean; remaining: number }> {
  const limit = LIMITS[endpoint]
  if (!limit) return { allowed: true, remaining: 999 }

  const windowStart = Date.now() - limit.windowMinutes * 60 * 1000
  const docRef = adminDb.collection('users').doc(userId).collection('rateLimits').doc(endpointSlug(endpoint))

  // Transação: lê e escreve o contador atomicamente, evitando a race condition
  // que o read-then-write direto do Supabase tinha.
  return adminDb.runTransaction(async (tx) => {
    const doc = await tx.get(docRef)
    const data = doc.data() as { requests: number; window_start: number } | undefined

    if (!data || data.window_start < windowStart) {
      // Primeiro pedido na janela (ou janela anterior expirou)
      tx.set(docRef, { requests: 1, window_start: Date.now(), updated_at: FieldValue.serverTimestamp() })
      return { allowed: true, remaining: limit.requests - 1 }
    }

    if (data.requests >= limit.requests) {
      return { allowed: false, remaining: 0 }
    }

    tx.update(docRef, { requests: data.requests + 1, updated_at: FieldValue.serverTimestamp() })
    return { allowed: true, remaining: limit.requests - data.requests - 1 }
  })
}
