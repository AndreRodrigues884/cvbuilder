import { createClient } from '@/lib/supabase/server'

const LIMITS: Record<string, { requests: number; windowMinutes: number }> = {
  '/api/ai/review': { requests: 10, windowMinutes: 60 },
  '/api/ai/job-match': { requests: 10, windowMinutes: 60 },
  '/api/ai/interview/generate': { requests: 10, windowMinutes: 60 },
  '/api/ai/interview/evaluate': { requests: 30, windowMinutes: 60 },
  '/api/ai/career-copilot': { requests: 5, windowMinutes: 60 },
  '/api/ai/parse-pdf': { requests: 20, windowMinutes: 60 },
}

export async function checkRateLimit(userId: string, endpoint: string): Promise<{ allowed: boolean; remaining: number }> {
  const limit = LIMITS[endpoint]
  if (!limit) return { allowed: true, remaining: 999 }

  const supabase = await createClient()
  const windowStart = new Date(Date.now() - limit.windowMinutes * 60 * 1000).toISOString()

  // Busca pedidos na janela atual
  const { data } = await supabase
    .from('rate_limits')
    .select('id, requests, window_start')
    .eq('user_id', userId)
    .eq('endpoint', endpoint)
    .gte('window_start', windowStart)
    .order('window_start', { ascending: false })
    .limit(1)
    .single()

  if (!data) {
    // Primeiro pedido na janela
    await supabase.from('rate_limits').insert({
      user_id: userId,
      endpoint,
      requests: 1,
      window_start: new Date().toISOString(),
    })
    return { allowed: true, remaining: limit.requests - 1 }
  }

  if (data.requests >= limit.requests) {
    return { allowed: false, remaining: 0 }
  }

  // Incrementa o contador
  await supabase
    .from('rate_limits')
    .update({ requests: data.requests + 1 })
    .eq('id', data.id)

  return { allowed: true, remaining: limit.requests - data.requests - 1 }
}