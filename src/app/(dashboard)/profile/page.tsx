'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2 } from 'lucide-react'

interface Profile {
  full_name: string
  email: string
  current_job_title: string
  target_job_title: string
  years_of_experience: number | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    full_name: '',
    email: '',
    current_job_title: '',
    target_job_title: '',
    years_of_experience: null,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      setProfile({
        full_name: data.full_name || '',
        email: data.email || '',
        current_job_title: data.current_job_title || '',
        target_job_title: data.target_job_title || '',
        years_of_experience: data.years_of_experience || null,
      })
    }
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    setSuccess(false)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        current_job_title: profile.current_job_title,
        target_job_title: profile.target_job_title,
        years_of_experience: profile.years_of_experience,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Perfil</h1>
        <p className="text-slate-500 mt-1">Gere as tuas informações pessoais</p>
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200">
            <span className="text-white text-2xl font-bold">
              {profile.full_name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">{profile.full_name || 'Sem nome'}</h2>
            <p className="text-sm text-slate-500">{profile.email}</p>
            {profile.current_job_title && (
              <p className="text-xs text-slate-400 mt-0.5">{profile.current_job_title}</p>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-5">Informação pessoal</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Nome completo</label>
            <input
              type="text"
              value={profile.full_name}
              onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="O teu nome completo"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 mt-1">O email não pode ser alterado</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Cargo atual</label>
              <input
                type="text"
                value={profile.current_job_title}
                onChange={e => setProfile(p => ({ ...p, current_job_title: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Ex: Junior Developer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Cargo objetivo</label>
              <input
                type="text"
                value={profile.target_job_title}
                onChange={e => setProfile(p => ({ ...p, target_job_title: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Ex: Senior Developer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Anos de experiência</label>
            <input
              type="number"
              min="0"
              max="50"
              value={profile.years_of_experience || ''}
              onChange={e => setProfile(p => ({ ...p, years_of_experience: parseInt(e.target.value) || null }))}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="Ex: 2"
            />
          </div>
        </div>

        {success && (
          <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-100 mt-4">
            ✓ Perfil atualizado com sucesso!
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-violet-200"
        >
          {saving ? (
            <><Loader2 size={15} className="animate-spin" />A guardar...</>
          ) : (
            <><Save size={15} />Guardar alterações</>
          )}
        </button>
      </div>
    </div>
  )
}