import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, FileText, Download, Pencil } from 'lucide-react'

export default async function CVListPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: cvs } = await supabase
    .from('cvs')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Os meus CVs</h1>
          <p className="text-slate-500 mt-1">{cvs?.length || 0} CV{cvs?.length !== 1 ? 's' : ''} criado{cvs?.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/cv/new"
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          <Plus size={16} />
          Novo CV
        </Link>
      </div>

      {cvs?.length === 0 ? (
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
          {cvs?.map(cv => (
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
                <a
                  href={`/api/cv/${cv.id}/export`}
                  target="_blank"
                  className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate.900 border border-slate-200 rounded-lg px-3 py-2 hover:border-slate-400 transition-colors"
                >
                  <Download size={13} />
                  Exportar PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}