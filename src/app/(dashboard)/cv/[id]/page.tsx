import { getCurrentUser } from '@/lib/firebase/get-current-user'
import { adminDb } from '@/lib/firebase/admin'
import { redirect } from 'next/navigation'
import EditCVClient from '@/components/cv/edit-cv-client'
import type { CVData } from '@/types/cv'

export default async function EditCVPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const doc = await adminDb.collection('users').doc(user.id).collection('cvs').doc(id).get()
  if (!doc.exists) redirect('/cv')

  const cv = doc.data()! as CVData

  return (
    <EditCVClient
      cvId={id}
      initialData={{
        cv,
        experiences: cv.experiences ?? [],
        education: cv.education ?? [],
        skills: cv.skills ?? [],
        languages: cv.languages ?? [],
        projects: cv.projects ?? [],
        certifications: cv.certifications ?? [],
      }}
    />
  )
}
