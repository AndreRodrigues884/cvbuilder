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

        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Para que vaga te estás a preparar?</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Título da vaga *</label>
              <input
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Ex: Frontend Developer, Product Manager..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Empresa (opcional)</label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Ex: Google, Startup XYZ..."
              />
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={loading || !jobTitle.trim()}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" />A gerar perguntas...</>
            ) : (
              <><MessageSquare size={16} />Começar simulação</>
            )}
          </button>
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
          <p className="text-slate-500 mt-0.5">{jobTitle} {company && `· ${company}`}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Pergunta</p>
          <p className="text-2xl font-bold text-slate-900">{currentIndex + 1}<span className="text-slate-400 text-lg">/{questions.length}</span></p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-6">
        <div
          className="bg-slate-900 h-1.5 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
        {/* Category */}
        <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border mb-4 ${categoryColor[currentQuestion.category] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
          {categoryLabel[currentQuestion.category] || currentQuestion.category}
        </span>

        {/* Question */}
        <h2 className="text-lg font-semibold text-slate-900 mb-2">{currentQuestion.question}</h2>

        {/* Tip */}
        <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 mb-5">
          💡 {currentQuestion.tip}
        </p>

        {/* Answer */}
        {!evaluation ? (
          <>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none mb-4"
              placeholder="Escreve a tua resposta aqui..."
            />
            <button
              onClick={handleEvaluate}
              disabled={evaluating || !answer.trim()}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
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
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Score</span>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-slate-900">{evaluation.score}/10</span>
              </div>
            </div>

            {/* Feedback */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-medium text-blue-700 mb-1">Feedback</p>
              <p className="text-sm text-slate-700">{evaluation.feedback}</p>
            </div>

            {/* Positive */}
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <p className="text-xs font-medium text-green-700 mb-1">✓ O que correu bem</p>
              <p className="text-sm text-slate-700">{evaluation.positive}</p>
            </div>

            {/* Improve */}
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <p className="text-xs font-medium text-yellow-700 mb-1">→ O que melhorar</p>
              <p className="text-sm text-slate-700">{evaluation.improve}</p>
            </div>

            {/* Example */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs font-medium text-slate-600 mb-1">💡 Exemplo de resposta forte</p>
              <p className="text-sm text-slate-700">{evaluation.example_answer}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-30"
        >
          <ChevronLeft size={16} />
          Anterior
        </button>

        {evaluation && (
          <button
            onClick={handleNext}
            className="flex items-center gap-1 bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            {currentIndex === questions.length - 1 ? 'Ver resultados' : 'Próxima pergunta'}
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}