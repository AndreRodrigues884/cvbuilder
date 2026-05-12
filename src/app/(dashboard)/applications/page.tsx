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
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          <Plus size={16} />
          Nova candidatura
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'text-slate-900' },
          { label: 'Entrevistas', value: stats.interview, color: 'text-yellow-600' },
          { label: 'Ofertas', value: stats.offer, color: 'text-green-600' },
          { label: 'Rejeitadas', value: stats.rejected, color: 'text-red-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
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
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f.key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-4">Nova candidatura</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Empresa *</label>
              <input
                type="text"
                value={form.company}
                onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Ex: Google"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Cargo *</label>
              <input
                type="text"
                value={form.job_title}
                onChange={e => setForm(p => ({ ...p, job_title: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Ex: Frontend Developer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Estado</label>
              <select
                value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {Object.entries(statusConfig).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Data de candidatura</label>
              <input
                type="date"
                value={form.applied_at}
                onChange={e => setForm(p => ({ ...p, applied_at: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Link da vaga</label>
              <input
                type="url"
                value={form.job_url}
                onChange={e => setForm(p => ({ ...p, job_url: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Notas</label>
              <input
                type="text"
                value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Notas adicionais..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => { setShowForm(false); setForm(emptyForm) }}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
            >
              Cancelar
            </button>
            <button
              onClick={handleAdd}
              disabled={saving || !form.company || !form.job_title}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
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
        <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl">
          <ClipboardList size={40} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-600 font-medium mb-1">Sem candidaturas</h3>
          <p className="text-slate-400 text-sm">Adiciona a tua primeira candidatura</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(app => (
            <div key={app.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-slate-900 text-sm">{app.job_title}</p>
                  <span className="text-slate-400">·</span>
                  <p className="text-sm text-slate-600">{app.company}</p>
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
                  <a href={app.job_url} target="_blank" className="text-slate-400 hover:text-slate-700 transition-colors">
                    <ExternalLink size={15} />
                  </a>
                )}
                <select
                  value={app.status}
                  onChange={e => handleStatusChange(app.id, e.target.value)}
                  className={`text-xs font-medium px-2.5 py-1.5 rounded-full border cursor-pointer focus:outline-none ${statusConfig[app.status].color}`}
                >
                  {Object.entries(statusConfig).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}