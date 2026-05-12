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
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Target size={16} />
              O teu CV
            </h2>
            <textarea
              value={cvText}
              onChange={e => setCvText(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
              placeholder="Cola aqui o texto do teu CV..."
            />
          </div>

          {/* Vaga */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Briefcase size={16} />
              Vaga de emprego
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Título da vaga</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Ex: Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Empresa (opcional)</label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Ex: Google"
                />
              </div>
            </div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Descrição da vaga</label>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
              placeholder="Cola aqui a descrição completa da vaga..."
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            onClick={handleAnalyse}
            disabled={loading || !cvText.trim() || !jobDescription.trim()}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
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
          <div className={`rounded-2xl border p-6 ${getScoreBg(analysis.match_score)}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Match Score</p>
                <p className={`text-6xl font-bold mt-1 ${getScoreColor(analysis.match_score)}`}>
                  {analysis.match_score}
                  <span className="text-2xl text-slate-400">/100</span>
                </p>
              </div>
              <div className="text-right max-w-xs">
                <p className="text-sm text-slate-600">{analysis.summary}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pontos fortes */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={18} className="text-green-500" />
                <h3 className="font-semibold text-slate-900">Alinhamento com a vaga</h3>
              </div>
              <ul className="space-y-2">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>{s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Lacunas */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={18} className="text-red-500" />
                <h3 className="font-semibold text-slate-900">Lacunas identificadas</h3>
              </div>
              <ul className="space-y-2">
                {analysis.gaps.map((g, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-red-400 mt-0.5">✗</span>{g}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sugestões */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={18} className="text-yellow-500" />
                <h3 className="font-semibold text-slate-900">Sugestões de adaptação</h3>
              </div>
              <ul className="space-y-2">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-yellow-500 mt-0.5">→</span>{s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Keywords */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Keywords</h3>
              <div className="mb-3">
                <p className="text-xs font-medium text-green-600 mb-2">Match</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.matched_keywords.map((k, i) => (
                    <span key={i} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full border border-green-200">{k}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-red-600 mb-2">Em falta</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missing_keywords.map((k, i) => (
                    <span key={i} className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full border border-red-200">{k}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Resumo adaptado */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-2">Resumo profissional adaptado</h3>
            <p className="text-xs text-slate-500 mb-3">Versão do teu resumo otimizada para esta vaga, usando apenas informação real do teu CV</p>
            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 leading-relaxed">
              {analysis.adapted_summary}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(analysis.adapted_summary)}
              className="mt-3 text-xs text-slate-500 hover:text-slate-900 transition-colors"
            >
              Copiar resumo
            </button>
          </div>

          <button
            onClick={() => { setAnalysis(null); setCvText(''); setJobDescription(''); setJobTitle(''); setCompany('') }}
            className="w-full py-3 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Nova análise
          </button>
        </div>
      )}
    </div>
  )
}