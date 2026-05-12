'use client'

import { useState } from 'react'
import { Loader2, MessageSquare, ChevronRight, ChevronLeft, Star } from 'lucide-react'

interface Question {
  question: string
  category: string
  tip: string
}

interface Evaluation {
  score: number
  feedback: string
  positive: string
  improve: string
  example_answer: string
}

const categoryLabel: Record<string, string> = {
  behavioral: 'Comportamental',
  technical: 'Técnica',
  motivational: 'Motivação',
  situational: 'Situacional',
}

const categoryColor: Record<string, string> = {
  behavioral: 'bg-blue-50 text-blue-700 border-blue-200',
  technical: 'bg-purple-50 text-purple-700 border-purple-200',
  motivational: 'bg-green-50 text-green-700 border-green-200',
  situational: 'bg-yellow-50 text-yellow-700 border-yellow-200',
}

export default function InterviewPrepPage() {
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [evaluations, setEvaluations] = useState<Record<number, Evaluation>>({})
  const [loading, setLoading] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [started, setStarted] = useState(false)

  async function handleStart() {
    if (!jobTitle.trim()) return
    setLoading(true)

    try {
      const res = await fetch('/api/ai/interview/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, company }),
      })
      const data = await res.json()
      setQuestions(data.questions)
      setStarted(true)
      setCurrentIndex(0)
    } catch {
      alert('Erro ao gerar perguntas. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handleEvaluate() {
    if (!answer.trim()) return
    setEvaluating(true)

    try {
      const res = await fetch('/api/ai/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questions[currentIndex].question,
          answer,
          jobTitle,
        }),
      })
      const data = await res.json()
      setEvaluation(data.evaluation)
      setEvaluations(prev => ({ ...prev, [currentIndex]: data.evaluation }))
    } catch {
      alert('Erro ao avaliar resposta.')
    } finally {
      setEvaluating(false)
    }
  }

  function handleNext() {
    setCurrentIndex(prev => prev + 1)
    setAnswer('')
    setEvaluation(null)
  }

  function handlePrev() {
    setCurrentIndex(prev => prev - 1)
    setAnswer(evaluations[currentIndex - 1] ? '' : '')
    setEvaluation(evaluations[currentIndex - 1] || null)
  }

  const averageScore = Object.values(evaluations).length > 0
    ? Math.round(Object.values(evaluations).reduce((a, b) => a + b.score, 0) / Object.values(evaluations).length * 10)
    : 0

  const isFinished = currentIndex >= questions.length && questions.length > 0

  if (!started) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Interview Prep</h1>
          <p className="text-slate-500 mt-1">Treina para a tua próxima entrevista com perguntas geradas por AI</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-6">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
              <MessageSquare size={24} className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-white mb-1">Para que vaga te estás a preparar?</h2>
            <p className="text-white/70 text-sm">Vou gerar 8 perguntas típicas para a tua vaga</p>
          </div>

          <div className="p-8 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Título da vaga <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: Frontend Developer, Product Manager..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Empresa
                <span className="text-slate-400 font-normal ml-1">(opcional)</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: Google, Startup XYZ..."
              />
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { value: '8', label: 'Perguntas', icon: '❓' },
                { value: 'AI', label: 'Feedback', icon: '🤖' },
                { value: '10', label: 'Score máx.', icon: '⭐' },
              ].map(s => (
                <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                  <p className="text-lg mb-1">{s.icon}</p>
                  <p className="font-bold text-slate-900 text-sm">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleStart}
              disabled={loading || !jobTitle.trim()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-orange-200"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" />A gerar perguntas...</>
              ) : (
                <><MessageSquare size={16} />Começar simulação</>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isFinished) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Simulação concluída!</h2>
          <p className="text-slate-500 mb-6">Respondeste a {Object.keys(evaluations).length} de {questions.length} perguntas</p>

          <div className="bg-slate-50 rounded-xl p-6 mb-6">
            <p className="text-sm text-slate-500 mb-1">Score médio</p>
            <p className="text-5xl font-bold text-slate-900">{averageScore}<span className="text-2xl text-slate-400">/100</span></p>
          </div>

          <div className="space-y-3 text-left mb-6">
            {questions.map((q, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-700 flex-1 mr-4 truncate">{q.question}</p>
                {evaluations[i] ? (
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{evaluations[i].score}/10</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">Sem resposta</span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => { setStarted(false); setQuestions([]); setEvaluations({}); setJobTitle(''); setCompany('') }}
            className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            Nova simulação
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Interview Prep</h1>
          <p className="text-slate-500 mt-0.5">{jobTitle} {company && <span className="text-orange-500 font-medium">· {company}</span>}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 mb-0.5">Pergunta</p>
          <p className="text-2xl font-bold text-slate-900">{currentIndex + 1}<span className="text-slate-300 text-lg">/{questions.length}</span></p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 mb-8">
        <div
          className="bg-gradient-to-r from-orange-500 to-rose-500 h-2 rounded-full transition-all duration-500 shadow-sm"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4 shadow-sm">
        {/* Category */}
        <span className={`inline-block text-xs font-medium px-3 py-1.5 rounded-full border mb-4 ${categoryColor[currentQuestion.category] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
          {categoryLabel[currentQuestion.category] || currentQuestion.category}
        </span>

        {/* Question */}
        <h2 className="text-lg font-semibold text-slate-900 mb-3 leading-snug">{currentQuestion.question}</h2>

        {/* Tip */}
        <div className="flex gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-6">
          <span className="text-amber-500 flex-shrink-0">💡</span>
          <p className="text-xs text-amber-700 leading-relaxed">{currentQuestion.tip}</p>
        </div>

        {/* Answer */}
        {!evaluation ? (
          <>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none mb-4 leading-relaxed"
              placeholder="Escreve a tua resposta aqui..."
            />
            <button
              onClick={handleEvaluate}
              disabled={evaluating || !answer.trim()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-orange-200"
            >
              {evaluating ? (
                <><Loader2 size={15} className="animate-spin" />A avaliar...</>
              ) : (
                'Submeter resposta'
              )}
            </button>
          </>
        ) : (
          <div className="space-y-3">
            {/* Score */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
              <span className="text-sm font-semibold text-slate-700">Score desta resposta</span>
              <div className="flex items-center gap-1.5">
                <Star size={18} className="text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-slate-900 text-lg">{evaluation.score}</span>
                <span className="text-slate-400 text-sm">/10</span>
              </div>
            </div>

            {/* Feedback */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">Feedback</p>
              <p className="text-sm text-slate-700 leading-relaxed">{evaluation.feedback}</p>
            </div>

            {/* Positive */}
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <p className="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">✓ O que correu bem</p>
              <p className="text-sm text-slate-700 leading-relaxed">{evaluation.positive}</p>
            </div>

            {/* Improve */}
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
              <p className="text-xs font-semibold text-yellow-600 mb-2 uppercase tracking-wide">→ O que melhorar</p>
              <p className="text-sm text-slate-700 leading-relaxed">{evaluation.improve}</p>
            </div>

            {/* Example */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">💡 Exemplo de resposta forte</p>
              <p className="text-sm text-slate-700 leading-relaxed">{evaluation.example_answer}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-30 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft size={16} />
          Anterior
        </button>

        {evaluation && (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-orange-200"
          >
            {currentIndex === questions.length - 1 ? 'Ver resultados' : 'Próxima pergunta'}
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}