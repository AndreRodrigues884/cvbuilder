import Link from 'next/link'
import { FileText, Search, Briefcase, Compass, MessageSquare, CheckCircle, ArrowRight, Star, ChevronDown } from 'lucide-react'

export const revalidate = 3600 // regenera a cada hora

const features = [
  { icon: FileText, title: 'CV Builder com AI', description: 'Cria o teu CV passo a passo com sugestões inteligentes. Templates profissionais otimizados para ATS.', gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', border: 'border-violet-100' },
  { icon: Search, title: 'AI Review', description: 'Score ATS instantâneo, análise de keywords, pontos fortes e fracos. Feedback detalhado em segundos.', gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', border: 'border-blue-100' },
  { icon: Briefcase, title: 'Job Match', description: 'Cola a descrição da vaga e a AI adapta o teu CV para maximizar as hipóteses — sem inventar nada.', gradient: 'from-teal-500 to-green-500', bg: 'bg-teal-50', border: 'border-teal-100' },
  { icon: Compass, title: 'Career Copilot', description: 'Plano de carreira personalizado com skills a aprender, certificações recomendadas e fases de ação.', gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', border: 'border-amber-100' },
  { icon: MessageSquare, title: 'Interview Prep', description: 'Perguntas típicas da tua vaga geradas por AI. Responde, recebe score e feedback imediato.', gradient: 'from-rose-500 to-pink-500', bg: 'bg-rose-50', border: 'border-rose-100' },
  { icon: FileText, title: 'Tracking de Candidaturas', description: 'Regista todas as tuas candidaturas, acompanha o estado e nunca percas o fio à meada.', gradient: 'from-slate-500 to-slate-700', bg: 'bg-slate-50', border: 'border-slate-100' },
]

const testimonials = [
  { name: 'Mariana Costa', role: 'UX Designer · Lisboa', text: 'Consegui o meu primeiro emprego como UX Designer em 3 semanas. O AI Review identificou exatamente o que faltava no meu CV.', stars: 5, avatar: 'MC' },
  { name: 'Tiago Ferreira', role: 'Backend Developer · Porto', text: 'O Job Match é incrível. Adaptei o meu CV a 5 vagas diferentes e a taxa de resposta foi muito maior do que antes.', stars: 5, avatar: 'TF' },
  { name: 'Ana Rodrigues', role: 'Product Manager · Remote', text: 'O Career Copilot deu-me um plano claro de como passar de developer para PM. Exatamente o que precisava.', stars: 5, avatar: 'AR' },
]

const faqs = [
  { question: 'O CVBuilder é completamente gratuito?', answer: 'Sim, todas as funcionalidades estão disponíveis gratuitamente. Não precisas de cartão de crédito para começar.' },
  { question: 'O que é um score ATS?', answer: 'ATS (Applicant Tracking System) é o software que as empresas usam para filtrar CVs automaticamente. Um score alto significa que o teu CV passa esses filtros e chega a um humano.' },
  { question: 'A AI inventa informação no meu CV?', answer: 'Nunca. A nossa AI trabalha apenas com a informação que forneces, reorganizando e destacando o que já tens da melhor forma possível.' },
  { question: 'Posso exportar o meu CV em PDF?', answer: 'Sim, podes exportar o teu CV em PDF profissional com um clique, pronto para enviar a recrutadores.' },
  { question: 'Os meus dados estão seguros?', answer: 'Sim. Usamos Supabase com Row Level Security, o que significa que apenas tu tens acesso aos teus dados.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        
        * { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Syne', sans-serif; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite 1s; }
        .animate-fade-up { animation: fade-up 0.6s ease-out forwards; }
        .animate-fade-up-1 { animation: fade-up 0.6s ease-out 0.1s forwards; opacity: 0; }
        .animate-fade-up-2 { animation: fade-up 0.6s ease-out 0.2s forwards; opacity: 0; }
        .animate-fade-up-3 { animation: fade-up 0.6s ease-out 0.3s forwards; opacity: 0; }
        .gradient-text {
          background: linear-gradient(135deg, #7c3aed, #6366f1, #0ea5e9);
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-bg {
          background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.15) 0%, transparent 60%),
                      radial-gradient(ellipse 60% 40% at 80% 50%, rgba(99,102,241,0.08) 0%, transparent 50%),
                      white;
        }
        .card-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -12px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Navbar */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200">
              <FileText size={15} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-slate-900">CVBuilder</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Funcionalidades</a>
            <a href="#how" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Como funciona</a>
            <a href="#pricing" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Preços</a>
            <a href="#faq" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">
              Entrar
            </Link>
            <Link href="/register" className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm px-4 py-2 rounded-xl hover:opacity-90 transition-opacity font-medium shadow-lg shadow-violet-200">
              Começar grátis
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-bg pt-20 pb-24 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-medium px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
            Powered by Inteligência Artificial
          </div>

          <h1 className="animate-fade-up-1 font-display text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-6">
            O teu assistente<br />
            <span className="gradient-text">de procura de emprego</span>
          </h1>

          <p className="animate-fade-up-2 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            CVs otimizados para ATS, job matching inteligente, simulação de entrevistas e plano de carreira personalizado — tudo numa plataforma gratuita.
          </p>

          <div className="animate-fade-up-3 flex items-center justify-center gap-4 flex-wrap">
            <Link href="/register" className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-7 py-3.5 rounded-2xl font-semibold text-base hover:opacity-90 transition-opacity shadow-xl shadow-violet-200">
              Começar gratuitamente
              <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-7 py-3.5 rounded-2xl font-semibold text-base border border-slate-200 hover:border-slate-300 transition-colors">
              Já tenho conta
            </Link>
          </div>

          <p className="animate-fade-up-3 text-xs text-slate-400 mt-4">Sem cartão de crédito · Sem compromissos · 100% gratuito</p>
        </div>

        {/* Floating cards */}
        <div className="max-w-4xl mx-auto mt-16 relative">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 animate-float">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-slate-500 font-medium">ATS Score</p>
                <p className="text-4xl font-display font-extrabold text-slate-900 mt-0.5">87<span className="text-xl text-slate-400">/100</span></p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-200">
                <CheckCircle size={24} className="text-white" />
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2.5 rounded-full" style={{ width: '87%' }} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Keywords', value: '12/15', color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Formato', value: 'Ótimo', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Impacto', value: 'Alto', color: 'text-violet-600', bg: 'bg-violet-50' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                  <p className={`font-semibold text-sm ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -top-4 -right-4 md:right-8 bg-white rounded-2xl border border-slate-200 shadow-lg p-4 animate-float-delayed hidden md:block">
            <p className="text-xs font-medium text-slate-700 mb-2">Job Match</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-green-500 flex items-center justify-center">
                <Briefcase size={14} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Frontend Dev @ Talkdesk</p>
                <p className="text-xs text-green-600 font-medium">82% match ✓</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-600 font-semibold text-sm mb-3 tracking-wide uppercase">Funcionalidades</p>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Tudo o que precisas,<br />numa só plataforma</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">Desde a criação do CV até à preparação para entrevistas, o CVBuilder acompanha-te em todo o processo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className={`bg-white rounded-2xl border ${f.border} p-6 card-hover`}>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <f.icon size={20} className="text-white" />
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-2 text-lg">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-600 font-semibold text-sm mb-3 tracking-wide uppercase">Como funciona</p>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Em 4 passos simples</h2>
            <p className="text-slate-500 text-lg">Começas a candidatar-te com mais confiança em menos de 10 minutos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: '01', title: 'Cria a tua conta', desc: 'Regista-te gratuitamente em menos de 1 minuto. Sem cartão de crédito.', gradient: 'from-violet-500 to-purple-600' },
              { n: '02', title: 'Cria o teu CV', desc: 'Usa o nosso builder passo a passo ou importa o teu CV existente.', gradient: 'from-blue-500 to-cyan-500' },
              { n: '03', title: 'Deixa a AI trabalhar', desc: 'Analisa, otimiza e adapta o teu CV a cada vaga automaticamente.', gradient: 'from-teal-500 to-green-500' },
              { n: '04', title: 'Candidata-te', desc: 'Envia CVs otimizados e prepara-te para entrevistas com confiança.', gradient: 'from-amber-500 to-orange-500' },
            ].map((step, i) => (
              <div key={step.n} className="relative">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 card-hover h-full">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <span className="text-white font-display font-extrabold text-sm">{step.n}</span>
                  </div>
                  <h3 className="font-display font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:flex absolute top-8 -right-3 z-10 items-center justify-center">
                    <ArrowRight size={16} className="text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-600 font-semibold text-sm mb-3 tracking-wide uppercase">Testemunhos</p>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">O que dizem os utilizadores</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-slate-200 p-6 card-hover">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-600 font-semibold text-sm mb-3 tracking-wide uppercase">Preços</p>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Simples e transparente</h2>
            <p className="text-slate-500 text-lg">Começa gratuitamente. Sempre.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <p className="font-display font-bold text-slate-900 text-lg mb-1">Gratuito</p>
              <p className="text-4xl font-display font-extrabold text-slate-900 mb-1">0€</p>
              <p className="text-sm text-slate-500 mb-6">Para sempre</p>
              <ul className="space-y-3 mb-8">
                {['CV Builder completo', 'AI Review ilimitado', 'Job Match', 'Interview Prep', 'Career Copilot', 'Tracking de candidaturas', 'Exportar para PDF'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center bg-slate-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-slate-700 transition-colors">
                Começar grátis
              </Link>
            </div>

            {/* Pro - coming soon */}
            <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur">
                Em breve
              </div>
              <p className="font-display font-bold text-white text-lg mb-1">Pro</p>
              <p className="text-4xl font-display font-extrabold text-white mb-1">9€</p>
              <p className="text-sm text-white/60 mb-6">por mês</p>
              <ul className="space-y-3 mb-8">
                {['Tudo do plano Gratuito', 'Templates premium', 'CV em múltiplos idiomas', 'Análise de LinkedIn', 'Suporte prioritário', 'Histórico ilimitado'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/90">
                    <CheckCircle size={16} className="text-white/70 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button disabled className="block w-full text-center bg-white/20 text-white py-3 rounded-xl font-semibold text-sm cursor-not-allowed backdrop-blur">
                Em breve
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-600 font-semibold text-sm mb-3 tracking-wide uppercase">FAQ</p>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Perguntas frequentes</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-white rounded-2xl border border-slate-200 group">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="font-semibold text-slate-900 text-sm">{faq.question}</span>
                  <ChevronDown size={16} className="text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-sm text-slate-500 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-white blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                Pronto para encontrar<br />o teu próximo emprego?
              </h2>
              <p className="text-white/70 text-lg mb-8">
                Junta-te a quem já está a usar o CVBuilder para se destacar no mercado de trabalho.
              </p>
              <Link href="/register" className="inline-flex items-center gap-2 bg-white text-violet-700 px-8 py-4 rounded-2xl font-bold text-base hover:bg-violet-50 transition-colors shadow-xl">
                Começar gratuitamente
                <ArrowRight size={18} />
              </Link>
              <p className="text-white/40 text-xs mt-4">Sem cartão de crédito · Sempre gratuito</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <FileText size={13} className="text-white" />
            </div>
            <span className="font-display font-bold text-slate-900">CVBuilder</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Funcionalidades</a>
            <a href="#pricing" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Preços</a>
            <a href="#faq" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">FAQ</a>
          </div>
          <p className="text-xs text-slate-400">© 2026 CVBuilder · Desenvolvido por André Rodrigues</p>
        </div>
      </footer>
    </div>
  )
}