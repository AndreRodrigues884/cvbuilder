'use client'

import { useState } from 'react'
import { useCVStore, Skill, Language } from '@/store/cv-store'
import { Plus, X } from 'lucide-react'

export default function StepSkills() {
  const { cvData, addSkill, removeSkill, addLanguage, removeLanguage, setStep } = useCVStore()
  const [skillName, setSkillName] = useState('')
  const [skillLevel, setSkillLevel] = useState<Skill['level']>('intermediate')
  const [skillCategory, setSkillCategory] = useState('')
  const [langName, setLangName] = useState('')
  const [langLevel, setLangLevel] = useState<Language['level']>('intermediate')

  function handleAddSkill() {
    if (!skillName.trim()) return
    addSkill({ id: crypto.randomUUID(), name: skillName.trim(), level: skillLevel, category: skillCategory })
    setSkillName('')
  }

  function handleAddLanguage() {
    if (!langName.trim()) return
    addLanguage({ id: crypto.randomUUID(), language: langName.trim(), level: langLevel })
    setLangName('')
  }

  const levelLabel = {
    beginner: 'Iniciante',
    intermediate: 'Intermédio',
    advanced: 'Avançado',
    expert: 'Especialista',
    basic: 'Básico',
    native: 'Nativo',
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Skills & Línguas</h2>
      <p className="text-sm text-slate-500 mb-6">As tuas competências técnicas e linguísticas</p>

      {/* Skills */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Skills</h3>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={skillName}
            onChange={e => setSkillName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="Ex: React, TypeScript, Node.js"
          />
          <select
            value={skillLevel}
            onChange={e => setSkillLevel(e.target.value as Skill['level'])}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="beginner">Iniciante</option>
            <option value="intermediate">Intermédio</option>
            <option value="advanced">Avançado</option>
            <option value="expert">Especialista</option>
          </select>
          <button
            onClick={handleAddSkill}
            className="bg-slate-900 text-white px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {cvData.skills.map(skill => (
            <div key={skill.id} className="flex items-center gap-1.5 bg-slate-100 rounded-full px-3 py-1.5">
              <span className="text-sm text-slate-800">{skill.name}</span>
              <span className="text-xs text-slate-500">· {levelLabel[skill.level]}</span>
              <button onClick={() => removeSkill(skill.id)} className="text-slate-400 hover:text-red-500 ml-1">
                <X size={13} />
              </button>
            </div>
          ))}
          {cvData.skills.length === 0 && (
            <p className="text-sm text-slate-400">Ainda não adicionaste skills</p>
          )}
        </div>
      </div>

      {/* Languages */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Línguas</h3>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={langName}
            onChange={e => setLangName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddLanguage()}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="Ex: Português, Inglês"
          />
          <select
            value={langLevel}
            onChange={e => setLangLevel(e.target.value as Language['level'])}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="basic">Básico</option>
            <option value="intermediate">Intermédio</option>
            <option value="advanced">Avançado</option>
            <option value="native">Nativo</option>
          </select>
          <button
            onClick={handleAddLanguage}
            className="bg-slate-900 text-white px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {cvData.languages.map(lang => (
            <div key={lang.id} className="flex items-center gap-1.5 bg-slate-100 rounded-full px-3 py-1.5">
              <span className="text-sm text-slate-800">{lang.language}</span>
              <span className="text-xs text-slate-500">· {levelLabel[lang.level]}</span>
              <button onClick={() => removeLanguage(lang.id)} className="text-slate-400 hover:text-red-500 ml-1">
                <X size={13} />
              </button>
            </div>
          ))}
          {cvData.languages.length === 0 && (
            <p className="text-sm text-slate-400">Ainda não adicionaste línguas</p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={() => setStep(3)} className="px-6 py-2 text-sm text-slate-600 hover:text-slate-900">
          ← Anterior
        </button>
        <button
          onClick={() => setStep(5)}
          className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          Próximo →
        </button>
      </div>
    </div>
  )
}