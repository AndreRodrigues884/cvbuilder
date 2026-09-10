import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'

const SESSION_EXPIRES_IN_MS = 14 * 24 * 60 * 60 * 1000 // 14 dias (máximo permitido pelo Firebase)

export async function POST(req: NextRequest) {
  const { idToken, fullName } = await req.json()
  if (!idToken) return NextResponse.json({ error: 'Missing idToken' }, { status: 400 })

  let decoded
  try {
    decoded = await adminAuth.verifyIdToken(idToken)
  } catch {
    return NextResponse.json({ error: 'Invalid idToken' }, { status: 401 })
  }

  // Bootstrap idempotente do perfil (substitui o trigger que o Postgres tinha
  // no antigo `profiles`). Corre aqui, no servidor, para nunca ficar um Auth
  // user órfão sem doc Firestore caso a rede caia logo a seguir ao signUp.
  const userRef = adminDb.collection('users').doc(decoded.uid)
  const userDoc = await userRef.get()
  if (!userDoc.exists) {
    const now = new Date().toISOString()
    await userRef.set({
      email: decoded.email ?? '',
      full_name: fullName ?? decoded.name ?? '',
      current_job_title: '',
      target_job_title: '',
      years_of_experience: null,
      created_at: now,
      updated_at: now,
    })
  }

  let sessionCookie
  try {
    sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_EXPIRES_IN_MS })
  } catch {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set('session', sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_EXPIRES_IN_MS / 1000,
    path: '/',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete('session')
  return res
}
