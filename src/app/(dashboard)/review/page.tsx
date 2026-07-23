'use client'

import { useState } from 'react'
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Lightbulb, Search, Briefcase  } from 'lucide-react'

interface Analysis {
  ats_score: number
  overall_feedback: string
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  keywords_found: string[]
  keywords_missing: string[]
}

// Página de review do CV
export default function ReviewPage() {
  const [mode, setMode] = useState<'upload' | 'text'>('upload')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [cvText, setCvText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState('')

  // Função para lidar com upload de arquivo
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)

    if (f.type === 'application/pdf') {
      const formData = new FormData()
      formData.append('file', f)

      const res = await fetch('/api/ai/parse-pdf', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.text) {
        setCvText(data.text)
      } else {
        setError('Não foi possível extrair texto do PDF.')
      }
    } else {
      const text = await f.text()
      setCvText(text)
    }
  }

  // Função para enviar o texto do CV para análise
  async function handleAnalyse() {
    if (!cvText.trim()) { setError('Adiciona o conteúdo do CV'); return }
    setLoading(true)
    setError('')
    setAnalysis(null)

    try {
      const res = await fetch('/api/ai/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText, jobTitle, jobDescription }),
      })

      if (!res.ok) throw new Error('Erro na análise')
      const data = await res.json()
      setAnalysis(data.analysis)
    } catch {
      setError('Ocorreu um erro na análise. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Funções para determinar cores com base no score
  function getScoreColor(score: number) {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Função para determinar background com base no score
  function getScoreBg(score: number) {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">AI Review</h1>
        <p className="text-slate-500 mt-1">Analisa o teu CV com inteligência artificial e recebe feedback detalhado</p>
      </div>

      {/* Vaga (opcional) */}
      <div className="mt-6 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-md shadow-cyan-200">
            <Briefcase size={13} className="text-white" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">Vaga a concorrer</h3>
          <span className="text-xs text-slate-400 font-normal">(opcional)</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Título da vaga</label>
            <input
              type="text"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Ex: Frontend Developer"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Descrição da vaga</label>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
              placeholder="Cola aqui os requisitos da vaga..."
            />
          </div>
        </div>
      </div>

      {!analysis ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          {/* Mode selector */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('upload')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${mode === 'upload'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              <Upload size={15} />
              Upload PDF
            </button>
            <button
              onClick={() => setMode('text')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${mode === 'text'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              <FileText size={15} />
              Colar texto
            </button>
          </div>

          {mode === 'upload' ? (
            <label className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center mb-4 shadow-lg shadow-cyan-200 group-hover:scale-105 transition-transform">
                <Upload size={24} className="text-white" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {file ? file.name : 'Clica para fazer upload do teu CV'}
              </p>
              <p className="text-xs text-slate-400 mt-1.5">PDF, DOC ou DOCX</p>
              <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} className="hidden" />
            </label>
          ) : (
            <textarea
              value={cvText}
              onChange={e => setCvText(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none leading-relaxed"
              placeholder="Cola aqui o texto do teu CV..."
            />
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2.5 rounded-xl mt-4 border border-red-100">{error}</p>
          )}



          <button
            onClick={handleAnalyse}
            disabled={loading || !cvText.trim()}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-cyan-200"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" />A analisar o teu CV...</>
            ) : (
              <><Search size={16} />Analisar CV</>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Score */}
          <div className="rounded-2xl overflow-hidden border border-slate-200">
            <div className={`p-6 ${getScoreBg(analysis.ats_score)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">ATS Score</p>
                  <p className={`text-7xl font-bold ${getScoreColor(analysis.ats_score)}`}>
                    {analysis.ats_score}
                    <span className="text-3xl text-slate-300">/100</span>
                  </p>
                </div>
                <div className="text-right max-w-xs">
                  <div className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur flex items-center justify-center mb-3 ml-auto shadow-sm">
                    <span className="text-2xl">
                      {analysis.ats_score >= 80 ? '🎉' : analysis.ats_score >= 60 ? '👍' : '💪'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{analysis.overall_feedback}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pontos fortes */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-200">
                  <CheckCircle size={15} className="text-white" />
                </div>
                <h3 className="font-semibold text-slate-900">Pontos fortes</h3>
              </div>
              <ul className="space-y-2.5">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2.5 bg-green-50 rounded-lg p-2.5">
                    <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>{s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pontos fracos */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-200">
                  <AlertCircle size={15} className="text-white" />
                </div>
                <h3 className="font-semibold text-slate-900">Pontos a melhorar</h3>
              </div>
              <ul className="space-y-2.5">
                {analysis.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2.5 bg-red-50 rounded-lg p-2.5">
                    <span className="text-red-400 flex-shrink-0 mt-0.5">✗</span>{w}
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
                <h3 className="font-semibold text-slate-900">Sugestões</h3>
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
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-200">
                  <Search size={15} className="text-white" />
                </div>
                <h3 className="font-semibold text-slate-900">Keywords</h3>
              </div>
              <div className="mb-4">
                <p className="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">Encontradas</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.keywords_found.map((k, i) => (
                    <span key={i} className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full border border-green-200 font-medium">{k}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-red-600 mb-2 uppercase tracking-wide">Em falta</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.keywords_missing.map((k, i) => (
                    <span key={i} className="bg-red-50 text-red-700 text-xs px-2.5 py-1 rounded-full border border-red-200 font-medium">{k}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setAnalysis(null); setCvText(''); setFile(null) }}
            className="w-full py-3 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors font-medium"
          >
            Analisar outro CV
          </button>
        </div>
      )}
    </div>
  )
}