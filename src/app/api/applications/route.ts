import { getCurrentUser } from '@/lib/firebase/get-current-user'
import { adminDb } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const snap = await adminDb
    .collection('users').doc(user.id).collection('jobApplications')
    .orderBy('created_at', 'desc')
    .get()

  const applications = snap.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      company: data.company,
      job_title: data.job_title,
      status: data.status,
      applied_at: data.applied_at,
      notes: data.notes,
      job_url: data.job_url,
    }
  })

  return NextResponse.json({ applications })
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const now = new Date().toISOString()
  const data = {
    company: body.company,
    job_title: body.job_title,
    status: body.status,
    applied_at: body.applied_at,
    notes: body.notes,
    job_url: body.job_url,
    created_at: now,
    updated_at: now,
  }

  const docRef = await adminDb.collection('users').doc(user.id).collection('jobApplications').add(data)

  return NextResponse.json({ application: { id: docRef.id, ...data } })
}
