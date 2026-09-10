import { getCurrentUser } from '@/lib/firebase/get-current-user'
import { adminDb } from '@/lib/firebase/admin'
import { formatCvArrays } from '@/lib/cv/format-cv-data'
import { NextRequest, NextResponse } from 'next/server'
import type { CVData } from '@/types/cv'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const snap = await adminDb
    .collection('users').doc(user.id).collection('cvs')
    .orderBy('created_at', 'desc')
    .get()

  const cvs = snap.docs.map(doc => {
    const data = doc.data()
    return { id: doc.id, title: data.title, full_name: data.full_name, ats_score: data.ats_score ?? null, created_at: data.created_at }
  })

  return NextResponse.json({ cvs })
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cvData: CVData = await req.json()
  const now = new Date().toISOString()

  const docRef = await adminDb.collection('users').doc(user.id).collection('cvs').add({
    title: cvData.title,
    full_name: cvData.full_name,
    email: cvData.email,
    phone: cvData.phone,
    location: cvData.location,
    linkedin_url: cvData.linkedin_url,
    github_url: cvData.github_url,
    portfolio_url: cvData.portfolio_url,
    summary: cvData.summary,
    ats_score: null,
    ...formatCvArrays(cvData),
    created_at: now,
    updated_at: now,
  })

  return NextResponse.json({ cv: { id: docRef.id } })
}
