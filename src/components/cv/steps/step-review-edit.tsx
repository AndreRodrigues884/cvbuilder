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

  async function handleSave() {
    setLoading(true)
    setError('')
    const supabase = createClient()

    // Atualiza CV principal
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

    // Apaga secções antigas e reinsere
    await Promise.all([
      supabase.from('cv_experiences').delete().eq('cv_id', cvId),
      supabase.from('cv_education').delete().eq('cv_id', cvId),
      supabase.from('cv_skills').delete().eq('cv_id', cvId),
      supabase.from('cv_languages').delete().eq('cv_id', cvId),
      supabase.from('cv_projects').delete().eq('cv_id', cvId),
      supabase.from('cv_certifications').delete().eq('cv_id', cvId),
    ])

    // Reinsere tudo
    await Promise.all([
      cvData.experiences.length > 0 && supabase.from('cv_experiences').insert(
        cvData.experiences.map((e, i) => ({ ...e, cv_id: cvId, order_index: i, id: undefined }))
      ),
      cvData.education.length > 0 && supabase.from('cv_education').insert(
        cvData.education.map((e, i) => ({ ...e, cv_id: cvId, order_index: i, id: undefined }))
      ),
      cvData.skills.length > 0 && supabase.from('cv_skills').insert(
        cvData.skills.map((s, i) => ({ ...s, cv_id: cvId, order_index: i, id: undefined }))
      ),
      cvData.languages.length > 0 && supabase.from('cv_languages').insert(
        cvData.languages.map((l, i) => ({ ...l, cv_id: cvId, order_index: i, id: undefined }))
      ),
      cvData.projects.length > 0 && supabase.from('cv_projects').insert(
        cvData.projects.map((p, i) => ({ ...p, cv_id: cvId, order_index: i, id: undefined }))
      ),
      cvData.certifications.length > 0 && supabase.from('cv_certifications').insert(
        cvData.certifications.map((c, i) => ({ ...c, cv_id: cvId, order_index: i, id: undefined }))
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