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

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header do form */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
              <Compass size={24} className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-white mb-1">Conta-me sobre a tua carreira</h2>
            <p className="text-white/70 text-sm">Vou criar um plano personalizado só para ti</p>
          </div>

          <div className="p-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Cargo atual
                  <span className="text-slate-400 font-normal ml-1">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={currentPosition}
                  onChange={e => setCurrentPosition(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ex: Junior Developer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Cargo objetivo <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ex: Senior Developer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Anos de experiência
                <span className="text-slate-400 font-normal ml-1">(opcional)</span>
              </label>
              <input
                type="text"
                value={yearsExperience}
                onChange={e => setYearsExperience(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Ex: 1 ano, 3 anos..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Skills atuais
                <span className="text-slate-400 font-normal ml-1">(opcional)</span>
              </label>
              <textarea
                value={currentSkills}
                onChange={e => setCurrentSkills(e.target.value)}
                rows={3}
                className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none leading-relaxed"
                placeholder="Ex: React, TypeScript, Node.js, PostgreSQL..."
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !targetRole.trim()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-amber-200"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" />A gerar plano de carreira...</>
              ) : (
                <><Compass size={16} />Gerar plano de carreira</>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Career Copilot</h1>
          <p className="text-slate-500 mt-0.5">Plano para: <span className="font-medium text-violet-600">{targetRole}</span></p>
        </div>
        <button
          onClick={() => setPlan(null)}
          className="text-sm text-slate-500 hover:text-slate-900 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Novo plano
        </button>
      </div>

      <div className="space-y-4">
        {/* Overview */}
        <div className="rounded-2xl overflow-hidden border border-violet-100">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-white text-lg">Visão geral</h2>
              <span className="bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full backdrop-blur">
                ~{plan.timeline_months} meses
              </span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">{plan.overview}</p>
          </div>
          <div className="bg-white grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Nível atual</p>
              <p className="text-sm text-slate-700 leading-relaxed">{plan.current_level}</p>
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Gap analysis</p>
              <p className="text-sm text-slate-700 leading-relaxed">{plan.gap_analysis}</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white text-sm">⚡</span>
            </div>
            <h2 className="font-semibold text-slate-900">Skills a desenvolver</h2>
          </div>
          <div className="space-y-3">
            {plan.skills_to_learn.map((skill, i) => (
              <div key={i} className="border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-900 text-sm">{skill.skill}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${priorityColor[skill.priority]}`}>
                    {priorityLabel[skill.priority]}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">{skill.reason}</p>
                {skill.resources.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {skill.resources.map((r, j) => (
                      <span key={j} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100 font-medium">
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
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200">
                <span className="text-white text-sm">🏆</span>
              </div>
              <h2 className="font-semibold text-slate-900">Certificações recomendadas</h2>
            </div>
            <div className="space-y-2">
              {plan.certifications.map((cert, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{cert.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{cert.provider}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {cert.free && (
                      <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-medium">
                        Gratuito
                      </span>
                    )}
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${priorityColor[cert.priority as keyof typeof priorityColor] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
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
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center shadow-lg shadow-teal-200">
              <span className="text-white text-sm">🗺️</span>
            </div>
            <h2 className="font-semibold text-slate-900">Plano de ação</h2>
          </div>
          <div className="space-y-3">
            {plan.action_plan.map((phase, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedPhase(expandedPhase === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{i + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{phase.phase}</p>
                      <p className="text-xs text-slate-500">{phase.duration}</p>
                    </div>
                  </div>
                  {expandedPhase === i
                    ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" />
                    : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
                  }
                </button>
                {expandedPhase === i && (
                  <div className="px-4 pb-4 border-t border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-blue-600 mb-3 uppercase tracking-wide">Objetivos</p>
                        <ul className="space-y-2">
                          {phase.goals.map((g, j) => (
                            <li key={j} className="text-sm text-slate-700 flex gap-2">
                              <span className="text-blue-500 mt-0.5 flex-shrink-0">◎</span>{g}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-green-600 mb-3 uppercase tracking-wide">Ações</p>
                        <ul className="space-y-2">
                          {phase.actions.map((a, j) => (
                            <li key={j} className="text-sm text-slate-700 flex gap-2">
                              <span className="text-green-500 mt-0.5 flex-shrink-0">→</span>{a}
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
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-200">
              <span className="text-white text-sm">💡</span>
            </div>
            <h2 className="font-semibold text-slate-900">Conselhos do Career Copilot</h2>
          </div>
          <ul className="space-y-3">
            {plan.tips.map((tip, i) => (
              <li key={i} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-purple-500 flex-shrink-0 mt-0.5">💡</span>
                <p className="text-sm text-slate-700 leading-relaxed">{tip}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}