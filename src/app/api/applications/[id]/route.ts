import { getCurrentUser } from '@/lib/firebase/get-current-user'
import { adminDb } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'

const EDITABLE_FIELDS = ['company', 'job_title', 'status', 'applied_at', 'notes', 'job_url'] as const

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
  for (const field of EDITABLE_FIELDS) {
    if (field in body) update[field] = body[field]
  }

  const docRef = adminDb.collection('users').doc(user.id).collection('jobApplications').doc(id)
  await docRef.update(update)
  const doc = await docRef.get()

  return NextResponse.json({ application: { id: doc.id, ...doc.data() } })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await adminDb.collection('users').doc(user.id).collection('jobApplications').doc(id).delete()

  return NextResponse.json({ success: true })
}
