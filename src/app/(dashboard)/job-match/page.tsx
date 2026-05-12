'use client'

import { useState } from 'react'
import { Loader2, Briefcase, Target, TrendingUp, AlertCircle, Lightbulb, CheckCircle } from 'lucide-react'

interface Analysis {
  match_score: number
  summary: string
  matched_keywords: string[]
  missing_keywords: string[]
  strengths: string[]
  gaps: string[]
  suggestions: string[]
  adapted_summary: string
}

export default function JobMatchPage() {
  const [cvText, setCvText] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState('')

  // Handle analyze button click
  async function handleAnalyse() {
    if (!cvText.trim() || !jobDescription.trim()) {
      setError('Preenche o CV e a descrição da vaga')
      return
    }
    setLoading(true)
    setError('')
    setAnalysis(null)

    try {
      const res = await fetch('/api/ai/job-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText, jobTitle, jobDescription, company }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setAnalysis(data.analysis)
    } catch {
      setError('Ocorreu um erro na análise. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Text color based on score
  function getScoreColor(score: number) {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Background color based on score
  function getScoreBg(score: number) {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Job Match</h1>
        <p className="text-slate-500 mt-1">Analisa o match entre o teu CV e uma vaga, e adapta-o sem inventar informação</p>
      </div>

      {!analysis ? (
        <div className="space-y-4">
          {/* CV */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center shadow-md shadow-teal-200">
                <Target size={13} className="text-white" />
              </div>
              O teu CV
            </h2>
            <textarea
              value={cvText}
              onChange={e => setCvText(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none leading-relaxed"
              placeholder="Cola aqui o texto do teu CV..."
            />
          </div>

          {/* Vaga */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center shadow-md shadow-teal-200">
                <Briefcase size={13} className="text-white" />
              </div>
              Vaga de emprego
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Título da vaga</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Ex: Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Empresa (opcional)</label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Ex: Google"
                />
              </div>
            </div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Descrição da vaga</label>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none leading-relaxed"
              placeholder="Cola aqui a descrição completa da vaga..."
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2.5 rounded-xl border border-red-100">{error}</p>
          )}

          <button
            onClick={handleAnalyse}
            disabled={loading || !cvText.trim() || !jobDescription.trim()}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-green-500 text-white py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-teal-200"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" />A analisar match...</>
            ) : (
              <><TrendingUp size={16} />Analisar Job Match</>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Score */}
          <div className="rounded-2xl overflow-hidden border border-slate-200">
            <div className={`p-6 ${getScoreBg(analysis.match_score)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Match Score</p>
                  <p className={`text-7xl font-bold ${getScoreColor(analysis.match_score)}`}>
                    {analysis.match_score}
                    <span className="text-3xl text-slate-300">/100</span>
                  </p>
                </div>
                <div className="text-right max-w-xs">
                  <div className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur flex items-center justify-center mb-3 ml-auto shadow-sm">
                    <span className="text-2xl">
                      {analysis.match_score >= 80 ? '🎯' : analysis.match_score >= 60 ? '👍' : '💪'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{analysis.summary}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Alinhamento */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-200">
                  <CheckCircle size={15} className="text-white" />
                </div>
                <h3 className="font-semibold text-slate-900">Alinhamento com a vaga</h3>
              </div>
              <ul className="space-y-2.5">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2.5 bg-green-50 rounded-lg p-2.5">
                    <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>{s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Lacunas */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-200">
                  <AlertCircle size={15} className="text-white" />
                </div>
                <h3 className="font-semibold text-slate-900">Lacunas identificadas</h3>
              </div>
              <ul className="space-y-2.5">
                {analysis.gaps.map((g, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2.5 bg-red-50 rounded-lg p-2.5">
                    <span className="text-red-400 flex-shrink-0 mt-0.5">✗</span>{g}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sugestões */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-200">
                  <Lightbulb size={15} className="text-white" />
                </div>
                <h3 className="font-semibold text-slate-900">Sugestões de adaptação</h3>
              </div>
              <ul className="space-y-2.5">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2.5 bg-yellow-50 rounded-lg p-2.5">
                    <span className="text-yellow-500 flex-shrink-0 mt-0.5">→</span>{s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Keywords */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center shadow-lg shadow-teal-200">
                  <TrendingUp size={15} className="text-white" />
                </div>
                <h3 className="font-semibold text-slate-900">Keywords</h3>
              </div>
              <div className="mb-4">
                <p className="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">Match</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.matched_keywords.map((k, i) => (
                    <span key={i} className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full border border-green-200 font-medium">{k}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-red-600 mb-2 uppercase tracking-wide">Em falta</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missing_keywords.map((k, i) => (
                    <span key={i} className="bg-red-50 text-red-700 text-xs px-2.5 py-1 rounded-full border border-red-200 font-medium">{k}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Resumo adaptado */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center shadow-lg shadow-teal-200">
                <span className="text-white text-sm">✨</span>
              </div>
              <h3 className="font-semibold text-slate-900">Resumo profissional adaptado</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 ml-10">Versão do teu resumo otimizada para esta vaga, usando apenas informação real do teu CV</p>
            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed border border-slate-100">
              {analysis.adapted_summary}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(analysis.adapted_summary)}
              className="mt-3 text-xs text-teal-600 hover:text-teal-800 transition-colors font-medium flex items-center gap-1"
            >
              📋 Copiar resumo
            </button>
          </div>

          <button
            onClick={() => { setAnalysis(null); setCvText(''); setJobDescription(''); setJobTitle(''); setCompany('') }}
            className="w-full py-3 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors font-medium"
          >
            Nova análise
          </button>
        </div>
      )}
    </div>
  )
}