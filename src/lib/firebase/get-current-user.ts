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
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')?.value
  if (!sessionCookie) return null

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
    return { id: decoded.uid, email: decoded.email ?? null }
  } catch {
    return null
  }
}
