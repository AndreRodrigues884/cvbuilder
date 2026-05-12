'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, ExternalLink, ClipboardList } from 'lucide-react'

interface Application {
  id: string
  company: string
  job_title: string
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn'
  applied_at: string
  notes: string
  job_url: string
}

const statusConfig = {
  applied: { label: 'Candidatado', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  interview: { label: 'Entrevista', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  offer: { label: 'Oferta', color: 'bg-green-50 text-green-700 border-green-200' },
  rejected: { label: 'Rejeitado', color: 'bg-red-50 text-red-700 border-red-200' },
  withdrawn: { label: 'Desistido', color: 'bg-slate-50 text-slate-600 border-slate-200' },
}

const emptyForm = {
  company: '',
  job_title: '',
  status: 'applied' as const,
  applied_at: new Date().toISOString().split('T')[0],
  notes: '',
  job_url: '',
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchApplications()
  }, [])

  async function fetchApplications() {
    const res = await fetch('/api/applications')
    const data = await res.json()
    setApplications(data.applications || [])
    setLoading(false)
  }

  async function handleAdd() {
    if (!form.company || !form.job_title) return
    setSaving(true)

    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setApplications(prev => [data.application, ...prev])
    setForm(emptyForm)
    setShowForm(false)
    setSaving(false)
  }

  async function handleStatusChange(id: string, status: string) {
    await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: status as Application['status'] } : a))
  }

  async function handleDelete(id: string) {
    await fetch(`/api/applications/${id}`, { method: 'DELETE' })
    setApplications(prev => prev.filter(a => a.id !== id))
  }

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter)

  const stats = {
    total: applications.length,
    interview: applications.filter(a => a.status === 'interview').length,
    offer: applications.filter(a => a.status === 'offer').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Candidaturas</h1>
          <p className="text-slate-500 mt-1">Acompanha o estado das tuas candidaturas</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-rose-200"
        >
          <Plus size={16} />
          Nova candidatura
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, gradient: 'from-slate-500 to-slate-700', shadow: 'shadow-slate-200' },
          { label: 'Entrevistas', value: stats.interview, gradient: 'from-yellow-500 to-amber-500', shadow: 'shadow-yellow-200' },
          { label: 'Ofertas', value: stats.offer, gradient: 'from-green-500 to-emerald-500', shadow: 'shadow-green-200' },
          { label: 'Rejeitadas', value: stats.rejected, gradient: 'from-red-500 to-rose-500', shadow: 'shadow-red-200' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-lg ${stat.shadow}`}>
              <span className="text-white text-xs font-bold">{stat.value}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: 'all', label: 'Todas' },
          ...Object.entries(statusConfig).map(([key, val]) => ({ key, label: val.label }))
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${filter === f.key
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-5">Nova candidatura</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Empresa *</label>
              <input
                type="text"
                value={form.company}
                onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Ex: Google"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Cargo *</label>
              <input
                type="text"
                value={form.job_title}
                onChange={e => setForm(p => ({ ...p, job_title: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Ex: Frontend Developer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Estado</label>
              <select
                value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value as any }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                {Object.entries(statusConfig).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Data de candidatura</label>
              <input
                type="date"
                value={form.applied_at}
                onChange={e => setForm(p => ({ ...p, applied_at: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Link da vaga</label>
              <input
                type="url"
                value={form.job_url}
                onChange={e => setForm(p => ({ ...p, job_url: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Notas</label>
              <input
                type="text"
                value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Notas adicionais..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <button
              onClick={() => { setShowForm(false); setForm(emptyForm) }}
              className="px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAdd}
              disabled={saving || !form.company || !form.job_title}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity shadow-lg shadow-rose-200"
            >
              {saving ? 'A guardar...' : 'Guardar'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="text-slate-400 text-sm">A carregar...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl bg-white">
          <ClipboardList size={40} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-600 font-medium mb-1">Sem candidaturas</h3>
          <p className="text-slate-400 text-sm">Adiciona a tua primeira candidatura</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(app => (
            <div key={app.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 hover:shadow-sm transition-all hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-200">
                <span className="text-white text-xs font-bold">{app.company.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-slate-900 text-sm">{app.job_title}</p>
                  <span className="text-slate-300">·</span>
                  <p className="text-sm text-slate-500">{app.company}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-slate-400">
                    {new Date(app.applied_at).toLocaleDateString('pt-PT')}
                  </p>
                  {app.notes && <p className="text-xs text-slate-400 truncate max-w-xs">{app.notes}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {app.job_url && (
                  <a href={app.job_url} target="_blank" className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                    <ExternalLink size={14} className="text-slate-500" />
                  </a>
                )}
                <select
                  value={app.status}
                  onChange={e => handleStatusChange(app.id, e.target.value)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none ${statusConfig[app.status].color}`}
                >
                  {Object.entries(statusConfig).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-50 flex items-center justify-center transition-colors group"
                >
                  <Trash2 size={14} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}