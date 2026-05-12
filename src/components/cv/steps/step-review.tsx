'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCVStore } from '@/store/cv-store'
import { createClient } from '@/lib/supabase/client'

export default function StepReview() {
  const { cvData, setStep, reset } = useCVStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSave() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Guardar CV
    const { data: cv, error: cvError } = await supabase
      .from('cvs')
      .insert({
        user_id: user.id,
        title: cvData.title,
        full_name: cvData.full_name,
        email: cvData.email,
        phone: cvData.phone,
        location: cvData.location,
        linkedin_url: cvData.linkedin_url,
        github_url: cvData.github_url,
        portfolio_url: cvData.portfolio_url,
        summary: cvData.summary,
      })
      .select()
      .single()

    if (cvError || !cv) { setError('Erro ao guardar CV'); setLoading(false); return }

    // Guardar experiências
    if (cvData.experiences.length > 0) {
      await supabase.from('cv_experiences').insert(
        cvData.experiences.map((e, i) => ({ ...e, cv_id: cv.id, order_index: i, id: undefined }))
      )
    }

    // Guardar educação
    if (cvData.education.length > 0) {
      await supabase.from('cv_education').insert(
        cvData.education.map((e, i) => ({ ...e, cv_id: cv.id, order_index: i, id: undefined }))
      )
    }

    // Guardar skills
    if (cvData.skills.length > 0) {
      await supabase.from('cv_skills').insert(
        cvData.skills.map((s, i) => ({ ...s, cv_id: cv.id, order_index: i, id: undefined }))
      )
    }

    // Guardar línguas
    if (cvData.languages.length > 0) {
      await supabase.from('cv_languages').insert(
        cvData.languages.map((l, i) => ({ ...l, cv_id: cv.id, order_index: i, id: undefined }))
      )
    }

    reset()
    router.push('/cv')
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Revisão</h2>
      <p className="text-sm text-slate-500 mb-6">Confirma os dados antes de guardar</p>

      <div className="space-y-4">
        {/* Pessoal */}
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Informação pessoal</h3>
          <div className="grid grid-cols-2 gap-1 text-sm">
            <span className="text-slate-500">Nome</span><span className="text-slate-900">{cvData.full_name || '-'}</span>
            <span className="text-slate-500">Email</span><span className="text-slate-900">{cvData.email || '-'}</span>
            <span className="text-slate-500">Telefone</span><span className="text-slate-900">{cvData.phone || '-'}</span>
            <span className="text-slate-500">Localização</span><span className="text-slate-900">{cvData.location || '-'}</span>
          </div>
        </div>

        {/* Experiência */}
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Experiência ({cvData.experiences.length})</h3>
          {cvData.experiences.length === 0
            ? <p className="text-sm text-slate-400">Nenhuma experiência adicionada</p>
            : cvData.experiences.map(e => (
              <p key={e.id} className="text-sm text-slate-700">{e.job_title} @ {e.company}</p>
            ))
          }
        </div>

        {/* Educação */}
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Educação ({cvData.education.length})</h3>
          {cvData.education.length === 0
            ? <p className="text-sm text-slate-400">Nenhuma formação adicionada</p>
            : cvData.education.map(e => (
              <p key={e.id} className="text-sm text-slate-700">{e.degree} em {e.institution}</p>
            ))
          }
        </div>

        {/* Skills */}
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Skills ({cvData.skills.length})</h3>
          <div className="flex flex-wrap gap-1.5">
            {cvData.skills.length === 0
              ? <p className="text-sm text-slate-400">Nenhuma skill adicionada</p>
              : cvData.skills.map(s => (
                <span key={s.id} className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">{s.name}</span>
              ))
            }
          </div>
        </div>

        {/* Línguas */}
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Línguas ({cvData.languages.length})</h3>
          <div className="flex flex-wrap gap-1.5">
            {cvData.languages.length === 0
              ? <p className="text-sm text-slate-400">Nenhuma língua adicionada</p>
              : cvData.languages.map(l => (
                <span key={l.id} className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">{l.language}</span>
              ))
            }
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mt-4">{error}</p>}

      <div className="flex justify-between mt-8">
        <button onClick={() => setStep(4)} className="px-6 py-2 text-sm text-slate-600 hover:text-slate-900">
          ← Anterior
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'A guardar...' : '✓ Guardar CV'}
        </button>
      </div>
    </div>
  )
}