'use client'

import { useState } from 'react'
import { useCVStore } from '@/store/cv-store'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Experience } from '@/types/cv'

const emptyExp = (): Experience => ({
  id: crypto.randomUUID(),
  company: '',
  job_title: '',
  location: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
  achievements: [''],
})

export default function StepExperience() {
  const { cvData, addExperience, updateExperience, removeExperience, setStep } = useCVStore()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [newExp, setNewExp] = useState<Experience | null>(null)

  function handleAdd() {
    const exp = emptyExp()
    setNewExp(exp)
    setExpanded(exp.id)
  }

  function handleSave() {
    if (!newExp) return
    addExperience(newExp)
    setNewExp(null)
    setExpanded(null)
  }

  function updateNew(data: Partial<Experience>) {
    setNewExp(prev => prev ? { ...prev, ...data } : prev)
  }

  const allExps = [...cvData.experiences, ...(newExp ? [newExp] : [])]

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Experiência profissional</h2>
      <p className="text-sm text-slate-500 mb-6">Adiciona as tuas experiências mais relevantes</p>

      <div className="space-y-3 mb-4">
        {allExps.map((exp) => {
          const isNew = newExp?.id === exp.id
          const isExpanded = expanded === exp.id
          const data = isNew ? newExp! : exp

          return (
            <div key={exp.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50"
                onClick={() => setExpanded(isExpanded ? null : exp.id)}
              >
                <div>
                  <p className="font-medium text-slate-900 text-sm">
                    {data.job_title || 'Nova experiência'}
                  </p>
                  <p className="text-xs text-slate-500">{data.company}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!isNew && (
                    <button
                      onClick={e => { e.stopPropagation(); removeExperience(exp.id) }}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                  {isExpanded ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 border-t border-slate-100 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Cargo</label>
                      <input
                        type="text"
                        value={data.job_title}
                        onChange={e => isNew ? updateNew({ job_title: e.target.value }) : updateExperience(exp.id, { job_title: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        placeholder="Frontend Developer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Empresa</label>
                      <input
                        type="text"
                        value={data.company}
                        onChange={e => isNew ? updateNew({ company: e.target.value }) : updateExperience(exp.id, { company: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        placeholder="Nome da empresa"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Data início</label>
                      <input
                        type="month"
                        value={data.start_date}
                        onChange={e => isNew ? updateNew({ start_date: e.target.value }) : updateExperience(exp.id, { start_date: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Data fim</label>
                      <input
                        type="month"
                        value={data.end_date}
                        disabled={data.is_current}
                        onChange={e => isNew ? updateNew({ end_date: e.target.value }) : updateExperience(exp.id, { end_date: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50"
                      />
                      <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.is_current}
                          onChange={e => isNew ? updateNew({ is_current: e.target.checked }) : updateExperience(exp.id, { is_current: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-xs text-slate-500">Emprego atual</span>
                      </label>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Descrição</label>
                      <textarea
                        value={data.description}
                        onChange={e => isNew ? updateNew({ description: e.target.value }) : updateExperience(exp.id, { description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                        placeholder="Descreve as tuas responsabilidades..."
                      />
                    </div>
                  </div>

                  {isNew && (
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setNewExp(null)}
                        className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={!data.job_title || !data.company}
                        className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                      >
                        Guardar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button
        onClick={handleAdd}
        disabled={!!newExp}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 border border-dashed border-slate-300 rounded-xl px-4 py-3 w-full justify-center hover:border-slate-400 transition-colors disabled:opacity-50"
      >
        <Plus size={16} />
        Adicionar experiência
      </button>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setStep(1)}
          className="px-6 py-2 text-sm text-slate-600 hover:text-slate-900"
        >
          ← Anterior
        </button>
        <button
          onClick={() => setStep(3)}
          className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          Próximo →
        </button>
      </div>
    </div>
  )
}