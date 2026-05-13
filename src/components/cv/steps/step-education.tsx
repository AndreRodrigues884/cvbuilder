'use client'

import { useState } from 'react'
import { useCVStore } from '@/store/cv-store'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Education } from '@/types/cv'

const emptyEdu = (): Education => ({
  id: crypto.randomUUID(),
  institution: '',
  degree: '',
  field_of_study: '',
  start_date: '',
  end_date: '',
  is_current: false,
  grade: '',
})

export default function StepEducation() {
  const { cvData, addEducation, updateEducation, removeEducation, setStep } = useCVStore()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [newEdu, setNewEdu] = useState<Education | null>(null)

  function handleAdd() {
    const edu = emptyEdu()
    setNewEdu(edu)
    setExpanded(edu.id)
  }

  function handleSave() {
    if (!newEdu) return
    addEducation(newEdu)
    setNewEdu(null)
    setExpanded(null)
  }

  function updateNew(data: Partial<Education>) {
    setNewEdu(prev => prev ? { ...prev, ...data } : prev)
  }

  const allEdus = [...cvData.education, ...(newEdu ? [newEdu] : [])]

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Educação</h2>
      <p className="text-sm text-slate-500 mb-6">As tuas habilitações académicas</p>

      <div className="space-y-3 mb-4">
        {allEdus.map((edu) => {
          const isNew = newEdu?.id === edu.id
          const isExpanded = expanded === edu.id
          const data = isNew ? newEdu! : edu

          return (
            <div key={edu.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50"
                onClick={() => setExpanded(isExpanded ? null : edu.id)}
              >
                <div>
                  <p className="font-medium text-slate-900 text-sm">
                    {data.degree || 'Nova formação'}
                  </p>
                  <p className="text-xs text-slate-500">{data.institution}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!isNew && (
                    <button
                      onClick={e => { e.stopPropagation(); removeEducation(edu.id) }}
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
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Instituição</label>
                      <input
                        type="text"
                        value={data.institution}
                        onChange={e => isNew ? updateNew({ institution: e.target.value }) : updateEducation(edu.id, { institution: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        placeholder="Universidade do Porto"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Grau</label>
                      <input
                        type="text"
                        value={data.degree}
                        onChange={e => isNew ? updateNew({ degree: e.target.value }) : updateEducation(edu.id, { degree: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        placeholder="Licenciatura"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Área</label>
                      <input
                        type="text"
                        value={data.field_of_study}
                        onChange={e => isNew ? updateNew({ field_of_study: e.target.value }) : updateEducation(edu.id, { field_of_study: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        placeholder="Engenharia Informática"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Data início</label>
                      <input
                        type="month"
                        value={data.start_date}
                        onChange={e => isNew ? updateNew({ start_date: e.target.value }) : updateEducation(edu.id, { start_date: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Data fim</label>
                      <input
                        type="month"
                        value={data.end_date}
                        disabled={data.is_current}
                        onChange={e => isNew ? updateNew({ end_date: e.target.value }) : updateEducation(edu.id, { end_date: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50"
                      />
                      <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.is_current}
                          onChange={e => isNew ? updateNew({ is_current: e.target.checked }) : updateEducation(edu.id, { is_current: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-xs text-slate-500">A frequentar</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Nota final</label>
                      <input
                        type="text"
                        value={data.grade}
                        onChange={e => isNew ? updateNew({ grade: e.target.value }) : updateEducation(edu.id, { grade: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        placeholder="17 valores"
                      />
                    </div>
                  </div>

                  {isNew && (
                    <div className="flex justify-end gap-2 pt-2">
                      <button onClick={() => setNewEdu(null)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={!data.institution || !data.degree}
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
        disabled={!!newEdu}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 border border-dashed border-slate-300 rounded-xl px-4 py-3 w-full justify-center hover:border-slate-400 transition-colors disabled:opacity-50"
      >
        <Plus size={16} />
        Adicionar formação
      </button>

      <div className="flex justify-between mt-8">
        <button onClick={() => setStep(2)} className="px-6 py-2 text-sm text-slate-600 hover:text-slate-900">
          ← Anterior
        </button>
        <button
          onClick={() => setStep(4)}
          className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          Próximo →
        </button>
      </div>
    </div>
  )
}