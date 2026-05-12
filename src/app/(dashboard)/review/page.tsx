'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Lightbulb, Search } from 'lucide-react'

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
        body: JSON.stringify({ cvText }),
      })

      if (!res.ok) throw new Error('Erro na análise')
      const data = await res.json()
      setAnalysis(data.analysis)
    } catch (e) {
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

      {!analysis ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          {/* Mode selector */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('upload')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'upload' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              <Upload size={15} />
              Upload PDF
            </button>
            <button
              onClick={() => setMode('text')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'text' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              <FileText size={15} />
              Colar texto
            </button>
          </div>

          {mode === 'upload' ? (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-colors">
              <Upload size={32} className="text-slate-400 mb-3" />
              <p className="text-sm font-medium text-slate-700">
                {file ? file.name : 'Clica para fazer upload do teu CV'}
              </p>
              <p className="text-xs text-slate-400 mt-1">PDF, DOC ou DOCX</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <textarea
              value={cvText}
              onChange={e => setCvText(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
              placeholder="Cola aqui o texto do teu CV..."
            />
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mt-4">{error}</p>
          )}

          <button
            onClick={handleAnalyse}
            disabled={loading || !cvText.trim()}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                A analisar o teu CV...
              </>
            ) : (
              <>
                <Search size={16} />
                Analisar CV
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Score */}
          <div className={`rounded-2xl border p-6 ${getScoreBg(analysis.ats_score)}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">ATS Score</p>
                <p className={`text-6xl font-bold mt-1 ${getScoreColor(analysis.ats_score)}`}>
                  {analysis.ats_score}
                  <span className="text-2xl text-slate-400">/100</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 max-w-xs">{analysis.overall_feedback}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pontos fortes */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={18} className="text-green-500" />
                <h3 className="font-semibold text-slate-900">Pontos fortes</h3>
              </div>
              <ul className="space-y-2">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pontos fracos */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={18} className="text-red-500" />
                <h3 className="font-semibold text-slate-900">Pontos a melhorar</h3>
              </div>
              <ul className="space-y-2">
                {analysis.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-red-400 mt-0.5">✗</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sugestões */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={18} className="text-yellow-500" />
                <h3 className="font-semibold text-slate-900">Sugestões</h3>
              </div>
              <ul className="space-y-2">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-yellow-500 mt-0.5">→</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Keywords */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Keywords</h3>
              <div className="mb-3">
                <p className="text-xs font-medium text-green-600 mb-2">Encontradas</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.keywords_found.map((k, i) => (
                    <span key={i} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full border border-green-200">{k}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-red-600 mb-2">Em falta</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.keywords_missing.map((k, i) => (
                    <span key={i} className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full border border-red-200">{k}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setAnalysis(null); setCvText(''); setFile(null) }}
            className="w-full py-3 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Analisar outro CV
          </button>
        </div>
      )}
    </div>
  )
}