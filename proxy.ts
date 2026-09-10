import { NextResponse, type NextRequest } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'

/// Proxy (substitui o antigo middleware.ts, deprecado no Next 16) para proteger
/// rotas e verificar a sessão Firebase. Corre em runtime nodejs, por isso pode
/// usar o firebase-admin diretamente (o edge runtime do middleware.ts não podia).
export async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value

  let isAuthenticated = false
  if (sessionCookie) {
    try {
      await adminAuth.verifySessionCookie(sessionCookie, true)
      isAuthenticated = true
    } catch {
      isAuthenticated = false
    }
  }

  const protectedRoutes = ['/dashboard', '/cv', '/review', '/job-match', '/career-copilot', '/interview-prep']
  const isProtected = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Redireciona utilizadores não autenticados que tentem aceder a rotas protegidas para o login
  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redireciona utilizadores autenticados que tentem aceder a login/registo para o dashboard
  if (isAuthenticated && ['/login', '/register'].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/webhooks).*)'],
}
