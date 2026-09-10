import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/firebase/get-current-user'
import { adminDb } from '@/lib/firebase/admin'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const doc = await adminDb.collection('users').doc(user.id).get()
  if (!doc.exists) return NextResponse.json({ profile: null })

  return NextResponse.json({ profile: { id: doc.id, ...doc.data() } })
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const update = {
    full_name: body.full_name,
    current_job_title: body.current_job_title,
    target_job_title: body.target_job_title,
    years_of_experience: body.years_of_experience,
    updated_at: new Date().toISOString(),
  }

  await adminDb.collection('users').doc(user.id).set(update, { merge: true })

  return NextResponse.json({ success: true })
}
