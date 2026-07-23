'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, FileText, Download, Pencil, Trash2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { CV } from '@/types/cv'

const ConfirmModal = dynamic(() => import('@/components/ui/confirm-modal'), {
  ssr: false,
})

export default function CVListPage() {
  const [cvs, setCvs] = useState<CV[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<number>(0)

  const fetchCVs = useCallback(async (force = false) => {
    const now = Date.now()
    if (!force && lastFetch && now - lastFetch < 2 * 60 * 1000) return

    const res = await fetch('/api/cv')
    const data = await res.json()
    setCvs(data.cvs || [])
    setLastFetch(now)
    setLoading(false)
  }, [lastFetch])

  useEffect(() => {
    fetchCVs()
  }, [fetchCVs])

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    await fetch(`/api/cv/${deleteId}`, { method: 'DELETE' })
    setCvs(prev => prev.filter(cv => cv.id !== deleteId))
    setDeleting(false)
    setDeleteId(null)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Os meus CVs</h1>
          <p className="text-slate-500 mt-1">{cvs.length} CV{cvs.length !== 1 ? 's' : ''} criado{cvs.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/cv/new"
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          <Plus size={16} />
          Novo CV
        </Link>
      </div>

      {loading ? (
        <p className="text-slate-400 text-sm">A carregar...</p>
      ) : cvs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl">
          <FileText size={40} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-600 font-medium mb-1">Ainda não tens CVs</h3>
          <p className="text-slate-400 text-sm mb-6">Cria o teu primeiro CV com ajuda de AI</p>
          <Link
            href="/cv/new"
            className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            Criar CV
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cvs.map(cv => (
            <div key={cv.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{cv.title}</h3>
                  <p className="text-sm text-slate-500">{cv.full_name}</p>
                </div>
                <div className="bg-slate-100 rounded-full px-2.5 py-1 text-xs font-medium text-slate-600">
                  ATS: {cv.ats_score || '-'}
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Criado em {new Date(cv.created_at).toLocaleDateString('pt-PT')}
              </p>
              <div className="flex items-center gap-2">
                <Link
                  href={`/cv/${cv.id}`}
                  className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-2 hover:border-slate-400 transition-colors"
                >
                  <Pencil size={13} />
                  Editar
                </Link>

                <a href={`/api/cv/${cv.id}/export`}
                  target="_blank"
                  className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-2 hover:border-slate-400 transition-colors"
                >
                  <Download size={13} />
                  Exportar PDF
                </a>
                <button
                  onClick={() => setDeleteId(cv.id)}
                  className="flex items-center gap-2 text-xs font-medium text-red-500 hover:text-red-700 border border-red-100 hover:border-red-300 rounded-lg px-3 py-2 transition-colors ml-auto"
                >
                  <Trash2 size={13} />
                  Apagar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Apagar CV"
        description="Tens a certeza que queres apagar este CV? Esta ação não pode ser desfeita."
        confirmLabel="Apagar CV"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}