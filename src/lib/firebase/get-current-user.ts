import { cache } from 'react'
import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase/admin'

export interface CurrentUser {
  id: string
  email: string | null
}

/**
 * Lê o cookie de sessão e verifica-o com o Admin SDK.
 * Substitui `supabase.auth.getUser()` — devolve `.id` (não `.uid`) de propósito
 * para que os call sites existentes só precisem de trocar o import.
 *
 * Envolvido em `cache()` do React: várias chamadas dentro do mesmo pedido
 * (ex: layout.tsx + page.tsx no mesmo carregamento) reutilizam o mesmo
 * resultado em vez de verificarem o cookie várias vezes — menos chamadas de
 * rede à Firebase, e elimina o risco de uma falhar transitoriamente enquanto
 * outra no mesmo pedido passa (foi isto que causava logouts inconsistentes).
 *
 * checkRevoked fica desligado (default) — essa opção faz uma chamada de rede
 * extra à Firebase para verificar revogação, que não usamos para nada (sem
 * funcionalidade de "forçar logout" nesta app) e só acrescentava mais um
 * ponto de falha transitória por verificação.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')?.value
  if (!sessionCookie) return null

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie)
    return { id: decoded.uid, email: decoded.email ?? null }
  } catch {
    return null
  }
})
