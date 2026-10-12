'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Redireciona para /dashboard se já houver uma sessão válida.
 * Usado em /login e /register: essas páginas são 100% 'use client' (sem
 * dados do servidor), e o Next 16 não corre o proxy.ts para páginas
 * totalmente estáticas — por isso o redirect "já autenticado" tem de
 * acontecer aqui, do lado do cliente, em vez de no proxy.
 */
export function useRedirectIfAuthenticated() {
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    fetch('/api/profile')
      .then(res => {
        if (!cancelled && res.ok) router.replace('/dashboard')
      })
      .catch(() => {})

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
