'use client'

import { useState } from 'react'
import { Loader2, Compass, ChevronDown, ChevronUp } from 'lucide-react'

interface Skill {
  skill: string
  priority: 'high' | 'medium' | 'low'
  reason: string
  resources: string[]
}

interface Certification {
  name: string
  provider: string
  priority: string
  free: boolean
}

interface Phase {
  phase: string
  duration: string
  goals: string[]
  actions: string[]
}

interface Plan {
  overview: string
  timeline_months: number
  current_level: string
  gap_analysis: string
  skills_to_learn: Skill[]
  certifications: Certification[]
  action_plan: Phase[]
  tips: string[]
}

const priorityColor = {
  high: 'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  low: 'bg-green-50 text-green-700 border-green-200',
}

const priorityLabel = {
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa',
}

export default function CareerCopilotPage() {
  const [currentPosition, setCurrentPosition] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [yearsExperience, setYearsExperience] = useState('')
  const [currentSkills, setCurrentSkills] = useState('')
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<Plan | null>(null)
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0)

  async function handleGenerate() {
    if (!targetRole.trim()) return
    setLoading(true)

    try {
      const res = await fetch('/api/ai/career-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPosition, targetRole, yearsExperience, currentSkills }),
      })
      const data = await res.json()
      setPlan(data.plan)
    } catch {
      alert('Erro ao gerar plano. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!plan) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Career Copilot</h1>
          <p className="text-slate-500 mt-1">O teu guia personalizado para evoluir na carreira</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Conta-me sobre a tua carreira</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Cargo atual <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={currentPosition}
                onChange={e => setCurrentPosition(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Ex: Junior Frontend Developer, Estudante..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cargo objetivo *</label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Ex: Senior Frontend Developer, Tech Lead..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Anos de experiência <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={yearsExperience}
                onChange={e => setYearsExperience(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Ex: 1 ano, 3 anos..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Skills atuais <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <textarea
                value={currentSkills}
                onChange={e => setCurrentSkills(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                placeholder="Ex: React, TypeScript, Node.js, PostgreSQL..."
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !targetRole.trim()}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" />A gerar plano de carreira...</>
            ) : (
              <><Compass size={16} />Gerar plano de carreira</>
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Career Copilot</h1>
          <p className="text-slate-500 mt-0.5">Plano para: <span className="font-medium text-slate-700">{targetRole}</span></p>
        </div>
        <button
          onClick={() => setPlan(null)}
          className="text-sm text-slate-500 hover:text-slate-900 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Novo plano
        </button>
      </div>

      <div className="space-y-4">
        {/* Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-900">Visão geral</h2>
            <span className="bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1 rounded-full">
              ~{plan.timeline_months} meses
            </span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed mb-4">{plan.overview}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs font-medium text-slate-500 mb-1">Nível atual</p>
              <p className="text-sm text-slate-800">{plan.current_level}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs font-medium text-slate-500 mb-1">Gap analysis</p>
              <p className="text-sm text-slate-800">{plan.gap_analysis}</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Skills a desenvolver</h2>
          <div className="space-y-3">
            {plan.skills_to_learn.map((skill, i) => (
              <div key={i} className="border border-slate-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900 text-sm">{skill.skill}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priorityColor[skill.priority]}`}>
                    {priorityLabel[skill.priority]}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{skill.reason}</p>
                {skill.resources.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {skill.resources.map((r, j) => (
                      <span key={j} className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded border border-slate-200">
                        📚 {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        {plan.certifications.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Certificações recomendadas</h2>
            <div className="space-y-2">
              {plan.certifications.map((cert, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{cert.name}</p>
                    <p className="text-xs text-slate-500">{cert.provider}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {cert.free && (
                      <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                        Gratuito
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priorityColor[cert.priority as keyof typeof priorityColor] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                      {priorityLabel[cert.priority as keyof typeof priorityLabel] || cert.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Plan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Plano de ação</h2>
          <div className="space-y-3">
            {plan.action_plan.map((phase, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedPhase(expandedPhase === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                >
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{phase.phase}</p>
                    <p className="text-xs text-slate-500">{phase.duration}</p>
                  </div>
                  {expandedPhase === i
                    ? <ChevronUp size={16} className="text-slate-400" />
                    : <ChevronDown size={16} className="text-slate-400" />
                  }
                </button>
                {expandedPhase === i && (
                  <div className="px-4 pb-4 border-t border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-2">Objetivos</p>
                        <ul className="space-y-1.5">
                          {phase.goals.map((g, j) => (
                            <li key={j} className="text-sm text-slate-700 flex gap-2">
                              <span className="text-blue-500 mt-0.5">◎</span>{g}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-2">Ações</p>
                        <ul className="space-y-1.5">
                          {phase.actions.map((a, j) => (
                            <li key={j} className="text-sm text-slate-700 flex gap-2">
                              <span className="text-green-500 mt-0.5">→</span>{a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Conselhos do Career Copilot</h2>
          <ul className="space-y-2">
            {plan.tips.map((tip, i) => (
              <li key={i} className="text-sm text-slate-700 flex gap-2">
                <span className="text-purple-500 mt-0.5">💡</span>{tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}