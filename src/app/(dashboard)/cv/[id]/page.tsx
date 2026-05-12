import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EditCVClient from '@/components/cv/edit-cv-client'

export default async function EditCVPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: cv },
    { data: experiences },
    { data: education },
    { data: skills },
    { data: languages },
    { data: projects },
    { data: certifications },
  ] = await Promise.all([
    supabase.from('cvs').select('*').eq('id', id).eq('user_id', user.id).single(),
    supabase.from('cv_experiences').select('*').eq('cv_id', id).order('order_index'),
    supabase.from('cv_education').select('*').eq('cv_id', id).order('order_index'),
    supabase.from('cv_skills').select('*').eq('cv_id', id).order('order_index'),
    supabase.from('cv_languages').select('*').eq('cv_id', id).order('order_index'),
    supabase.from('cv_projects').select('*').eq('cv_id', id).order('order_index'),
    supabase.from('cv_certifications').select('*').eq('cv_id', id).order('order_index'),
  ])

  if (!cv) redirect('/cv')

  return (
    <EditCVClient
      cvId={id}
      initialData={{ cv, experiences, education, skills, languages, projects, certifications }}
    />
  )
}