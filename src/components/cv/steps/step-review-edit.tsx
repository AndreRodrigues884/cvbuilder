'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCVStore } from '@/store/cv-store'
import { createClient } from '@/lib/supabase/client'

export default function StepReviewEdit({ cvId }: { cvId: string }) {
  const { cvData, setStep, reset } = useCVStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  function formatDate(date: string | null | undefined): string | null {
    if (!date) return null
    if (date.length === 7) return `${date}-01`
    return date
  }

  async function handleSave() {
    setLoading(true)
    setError('')
    const supabase = createClient()

    const { error: cvError } = await supabase
      .from('cvs')
      .update({
        title: cvData.title,
        full_name: cvData.full_name,
        email: cvData.email,
        phone: cvData.phone,
        location: cvData.location,
        linkedin_url: cvData.linkedin_url,
        github_url: cvData.github_url,
        portfolio_url: cvData.portfolio_url,
        summary: cvData.summary,
        updated_at: new Date().toISOString(),
      })
      .eq('id', cvId)

    if (cvError) { setError('Erro ao guardar CV'); setLoading(false); return }

    // Apaga secções antigas
    await Promise.all([
      supabase.from('cv_experiences').delete().eq('cv_id', cvId),
      supabase.from('cv_education').delete().eq('cv_id', cvId),
      supabase.from('cv_skills').delete().eq('cv_id', cvId),
      supabase.from('cv_languages').delete().eq('cv_id', cvId),
      supabase.from('cv_projects').delete().eq('cv_id', cvId),
      supabase.from('cv_certifications').delete().eq('cv_id', cvId),
    ])

    // Reinsere sem IDs
    await Promise.all([
      cvData.experiences.length > 0 && supabase.from('cv_experiences').insert(
        cvData.experiences.map((e, i) => ({
          cv_id: cvId,
          company: e.company,
          job_title: e.job_title,
          location: e.location,
          start_date: formatDate(e.start_date),
          end_date: formatDate(e.end_date),
          is_current: e.is_current,
          description: e.description,
          achievements: e.achievements,
          order_index: i,
        }))
      ),
      cvData.education.length > 0 && supabase.from('cv_education').insert(
        cvData.education.map((e, i) => ({
          cv_id: cvId,
          institution: e.institution,
          degree: e.degree,
          field_of_study: e.field_of_study,
          start_date: formatDate(e.start_date),
          end_date: formatDate(e.end_date),
          is_current: e.is_current,
          grade: e.grade,
          order_index: i,
        }))
      ),
      cvData.skills.length > 0 && supabase.from('cv_skills').insert(
        cvData.skills.map((s, i) => ({
          cv_id: cvId,
          name: s.name,
          level: s.level,
          category: s.category,
          order_index: i,
        }))
      ),
      cvData.languages.length > 0 && supabase.from('cv_languages').insert(
        cvData.languages.map((l, i) => ({
          cv_id: cvId,
          language: l.language,
          level: l.level,
          order_index: i,
        }))
      ),
      cvData.projects.length > 0 && supabase.from('cv_projects').insert(
        cvData.projects.map((p, i) => ({
          cv_id: cvId,
          name: p.name,
          description: p.description,
          technologies: p.technologies,
          url: p.url,
          github_url: p.github_url,
          start_date: formatDate(p.start_date),
          end_date: formatDate(p.end_date),
          order_index: i,
        }))
      ),
      cvData.certifications.length > 0 && supabase.from('cv_certifications').insert(
        cvData.certifications.map((c, i) => ({
          cv_id: cvId,
          name: c.name,
          issuer: c.issuer,
          issue_date: formatDate(c.issue_date),
          expiry_date: formatDate(c.expiry_date),
          credential_url: c.credential_url,
          order_index: i,
        }))
      ),
    ])

    reset()
    router.push('/cv')
    router.refresh()
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Revisão</h2>
      <p className="text-sm text-slate-500 mb-6">Confirma os dados antes de guardar as alterações</p>

      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Informação pessoal</h3>
          <div className="grid grid-cols-2 gap-1 text-sm">
            <span className="text-slate-500">Nome</span><span className="text-slate-900">{cvData.full_name || '-'}</span>
            <span className="text-slate-500">Email</span><span className="text-slate-900">{cvData.email || '-'}</span>
            <span className="text-slate-500">Telefone</span><span className="text-slate-900">{cvData.phone || '-'}</span>
            <span className="text-slate-500">Localização</span><span className="text-slate-900">{cvData.location || '-'}</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Experiência ({cvData.experiences.length})</h3>
          {cvData.experiences.length === 0
            ? <p className="text-sm text-slate-400">Nenhuma experiência</p>
            : cvData.experiences.map(e => <p key={e.id} className="text-sm text-slate-700">{e.job_title} @ {e.company}</p>)
          }
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Educação ({cvData.education.length})</h3>
          {cvData.education.length === 0
            ? <p className="text-sm text-slate-400">Nenhuma formação</p>
            : cvData.education.map(e => <p key={e.id} className="text-sm text-slate-700">{e.degree} em {e.institution}</p>)
          }
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Projetos ({cvData.projects.length})</h3>
          {cvData.projects.length === 0
            ? <p className="text-sm text-slate-400">Nenhum projeto</p>
            : cvData.projects.map(p => <p key={p.id} className="text-sm text-slate-700">{p.name}</p>)
          }
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Skills ({cvData.skills.length})</h3>
          <div className="flex flex-wrap gap-1.5">
            {cvData.skills.length === 0
              ? <p className="text-sm text-slate-400">Nenhuma skill</p>
              : cvData.skills.map(s => <span key={s.id} className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">{s.name}</span>)
            }
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mt-4">{error}</p>}

      <div className="flex justify-between mt-8">
        <button onClick={() => setStep(5)} className="px-6 py-2 text-sm text-slate-600 hover:text-slate-900">
          ← Anterior
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'A guardar...' : '✓ Guardar alterações'}
        </button>
      </div>
    </div>
  )
}