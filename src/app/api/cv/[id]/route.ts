import { getCurrentUser } from '@/lib/firebase/get-current-user'
import { adminDb } from '@/lib/firebase/admin'
import { formatCvArrays } from '@/lib/cv/format-cv-data'
import { NextRequest, NextResponse } from 'next/server'
import type { CVData } from '@/types/cv'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const doc = await adminDb.collection('users').doc(user.id).collection('cvs').doc(id).get()
  if (!doc.exists) return NextResponse.json({ error: 'CV not found' }, { status: 404 })

  return NextResponse.json({ cv: { id: doc.id, ...doc.data() } })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cvData: CVData = await req.json()

  await adminDb.collection('users').doc(user.id).collection('cvs').doc(id).update({
    title: cvData.title,
    full_name: cvData.full_name,
    email: cvData.email,
    phone: cvData.phone,
    location: cvData.location,
    linkedin_url: cvData.linkedin_url,
    github_url: cvData.github_url,
    portfolio_url: cvData.portfolio_url,
    summary: cvData.summary,
    ...formatCvArrays(cvData),
    updated_at: new Date().toISOString(),
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await adminDb.collection('users').doc(user.id).collection('cvs').doc(id).delete()

  return NextResponse.json({ success: true })
}
