'use client'

import { useCVStore } from '@/store/cv-store'

export default function StepPersonal() {
  const { cvData, updateCV, setStep } = useCVStore()

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Informação pessoal</h2>
      <p className="text-sm text-slate-500 mb-6">Os teus dados de contacto e perfil</p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Título do CV</label>
            <input
              type="text"
              value={cvData.title}
              onChange={e => updateCV({ title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Ex: CV para Frontend Developer"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome completo</label>
            <input
              type="text"
              value={cvData.full_name}
              onChange={e => updateCV({ full_name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="O teu nome completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={cvData.email}
              onChange={e => updateCV({ email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="o@teu.email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
            <input
              type="tel"
              value={cvData.phone}
              onChange={e => updateCV({ phone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="+351 912 345 678"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Localização</label>
            <input
              type="text"
              value={cvData.location}
              onChange={e => updateCV({ location: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Porto, Portugal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn</label>
            <input
              type="url"
              value={cvData.linkedin_url}
              onChange={e => updateCV({ linkedin_url: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="linkedin.com/in/o-teu-perfil"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">GitHub</label>
            <input
              type="url"
              value={cvData.github_url}
              onChange={e => updateCV({ github_url: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="github.com/o-teu-perfil"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Resumo profissional
              <span className="text-slate-400 font-normal ml-1">(opcional)</span>
            </label>
            <textarea
              value={cvData.summary}
              onChange={e => updateCV({ summary: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
              placeholder="Breve descrição do teu perfil profissional..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={() => setStep(2)}
          disabled={!cvData.full_name || !cvData.email}
          className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          Próximo →
        </button>
      </div>
    </div>
  )
}