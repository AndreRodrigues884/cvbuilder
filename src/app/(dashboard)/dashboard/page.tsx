import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [
    { data: profile },
    { count: cvsCount },
    { data: reviews },
    { count: applicationsCount },
    { count: interviewsCount },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('cvs').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
    supabase.from('ai_reviews').select('ats_score').eq('user_id', user!.id),
    supabase.from('job_applications').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
    supabase.from('interview_sessions').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
  ])

  const averageAts = reviews && reviews.length > 0
    ? Math.round(reviews.reduce((acc, r) => acc + (r.ats_score || 0), 0) / reviews.length)
    : null

  const firstName = profile?.full_name?.split(' ')[0] || 'utilizador'

  const stats = [
    { label: 'CVs criados', value: cvsCount ?? 0, icon: '📄' },
    { label: 'Score ATS médio', value: averageAts ? `${averageAts}` : '-', icon: '🎯' },
    { label: 'Candidaturas', value: applicationsCount ?? 0, icon: '📨' },
    { label: 'Entrevistas', value: interviewsCount ?? 0, icon: '🎤' },
  ]

  const quickActions = [
    { title: 'Criar novo CV', description: 'Cria um CV do zero com ajuda de AI', href: '/cv/new', emoji: '📄' },
    { title: 'AI Review', description: 'Importa o teu CV e recebe feedback detalhado', href: '/review', emoji: '🔍' },
    { title: 'Job Match', description: 'Adapta o teu CV a uma vaga específica', href: '/job-match', emoji: '💼' },
    { title: 'Career Copilot', description: 'Descobre o teu caminho para o próximo nível', href: '/career-copilot', emoji: '🧭' },
    { title: 'Interview Prep', description: 'Treina para a tua próxima entrevista', href: '/interview-prep', emoji: '🎯' },
  ]

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Olá, {firstName} 👋</h1>
        <p className="text-slate-500 mt-1">Pronto para dar o próximo passo na tua carreira?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-2xl mb-2">{stat.icon}</p>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">O que queres fazer hoje?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-400 hover:shadow-sm transition-all"
            >
              <span className="text-3xl mb-3 block">{action.emoji}</span>
              <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
              <p className="text-sm text-slate-500">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}