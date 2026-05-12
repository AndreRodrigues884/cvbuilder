import Link from 'next/link'
import { FileText, Search, Briefcase, Compass, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'CV Builder com AI',
    description: 'Cria o teu CV do zero com ajuda de inteligência artificial. Templates profissionais e sugestões em tempo real.',
  },
  {
    icon: Search,
    title: 'AI Review',
    description: 'Importa o teu CV e recebe uma análise detalhada com score ATS, pontos fortes, fracos e sugestões de melhoria.',
  },
  {
    icon: Briefcase,
    title: 'Job Match',
    description: 'Cola a descrição de uma vaga e a AI adapta o teu CV para maximizar as hipóteses de ser selecionado.',
  },
  {
    icon: Compass,
    title: 'Career Copilot',
    description: 'Define o teu objetivo de carreira e recebe um plano de ação personalizado com skills, certificações e prazos.',
  },
  {
    icon: MessageSquare,
    title: 'Interview Prep',
    description: 'Treina para entrevistas com perguntas geradas por AI para a tua vaga específica e recebe feedback imediato.',
  },
]

const benefits = [
  'CVs otimizados para sistemas ATS',
  'Análise de keywords por vaga',
  'Plano de carreira personalizado',
  'Simulação de entrevistas com AI',
  'Adaptação do CV sem inventar informação',
  'Dashboard com tracking de candidaturas',
]

const steps = [
  { number: '01', title: 'Cria a tua conta', description: 'Regista-te gratuitamente em menos de 1 minuto.' },
  { number: '02', title: 'Importa ou cria o teu CV', description: 'Usa o nosso builder ou importa o teu CV existente.' },
  { number: '03', title: 'Deixa a AI trabalhar', description: 'Analisa, otimiza e adapta o teu CV a cada vaga.' },
  { number: '04', title: 'Candidata-te com confiança', description: 'Envia CVs otimizados e prepara-te para as entrevistas.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center">
              <FileText size={14} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">CVBuilder</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Entrar
            </Link>
            <Link
              href="/register"
              className="bg-slate-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          ✨ Powered by Inteligência Artificial
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
          O teu assistente de<br />
          <span className="text-slate-500">procura de emprego</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Cria CVs otimizados, analisa o teu match com vagas, prepara-te para entrevistas
          e planeia a tua carreira — tudo com a ajuda de inteligência artificial.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/register"
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors"
          >
            Começar gratuitamente
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/login"
            className="text-slate-600 hover:text-slate-900 px-6 py-3 rounded-xl font-medium border border-slate-200 hover:border-slate-400 transition-colors"
          >
            Já tenho conta
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Tudo o que precisas numa plataforma</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Desde a criação do CV até à preparação para entrevistas, o CVBuilder acompanha-te em todo o processo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon size={20} className="text-slate-700" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Porque é que o CVBuilder é diferente?
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Não inventamos informação nem enchemos o teu CV de palavras vazias.
                Trabalhamos com o que já tens e ajudamos-te a apresentá-lo da melhor forma possível.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8">
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">ATS Score</span>
                    <span className="text-2xl font-bold text-green-600">87/100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }} />
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-medium text-slate-500 mb-2">Keywords encontradas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'].map(k => (
                      <span key={k} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full border border-green-200">{k}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-medium text-slate-500 mb-2">Match com a vaga</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Frontend Developer @ Talkdesk</span>
                    <span className="font-bold text-slate-900">82%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Como funciona?</h2>
            <p className="text-slate-500">Em 4 passos simples começas a candidatar-te com mais confiança.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <span className="text-3xl font-bold text-slate-200">{step.number}</span>
                  <h3 className="font-semibold text-slate-900 mt-2 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight size={16} className="text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Pronto para encontrar o teu próximo emprego?
          </h2>
          <p className="text-slate-500 mb-8 text-lg">
            Junta-te a quem já está a usar o CVBuilder para se destacar no mercado de trabalho.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-slate-700 transition-colors"
          >
            Começar gratuitamente
            <ArrowRight size={18} />
          </Link>
          <p className="text-xs text-slate-400 mt-4">Sem cartão de crédito. Sem compromissos.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center">
              <FileText size={12} className="text-white" />
            </div>
            <span className="font-bold text-slate-900">CVBuilder</span>
          </div>
          <p className="text-xs text-slate-400">© 2026 CVBuilder. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}