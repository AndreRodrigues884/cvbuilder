import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { FileText, Search, Briefcase, Compass, MessageSquare, ClipboardList, ArrowRight, TrendingUp } from 'lucide-react'

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
    { label: 'CVs criados', value: cvsCount ?? 0, icon: '📄', gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-200', href: '/cv' },
    { label: 'Score ATS médio', value: averageAts ?? '-', icon: '🎯', gradient: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-200', href: '/review' },
    { label: 'Candidaturas', value: applicationsCount ?? 0, icon: '📨', gradient: 'from-teal-500 to-green-500', shadow: 'shadow-teal-200', href: '/applications' },
    { label: 'Entrevistas', value: interviewsCount ?? 0, icon: '🎤', gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-200', href: '/interview-prep' },
  ]

  const quickActions = [
    { title: 'Criar novo CV', description: 'Cria um CV profissional passo a passo', href: '/cv/new', icon: FileText, gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-200' },
    { title: 'AI Review', description: 'Analisa o teu CV e recebe feedback', href: '/review', icon: Search, gradient: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-200' },
    { title: 'Job Match', description: 'Adapta o teu CV a uma vaga', href: '/job-match', icon: Briefcase, gradient: 'from-teal-500 to-green-500', shadow: 'shadow-teal-200' },
    { title: 'Career Copilot', description: 'Planeia o teu percurso de carreira', href: '/career-copilot', icon: Compass, gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-200' },
    { title: 'Interview Prep', description: 'Treina para a tua próxima entrevista', href: '/interview-prep', icon: MessageSquare, gradient: 'from-rose-500 to-pink-500', shadow: 'shadow-rose-200' },
    { title: 'Candidaturas', description: 'Acompanha as tuas candidaturas', href: '/applications', icon: ClipboardList, gradient: 'from-slate-500 to-slate-700', shadow: 'shadow-slate-200' },
  ]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="p-8 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{greeting} 👋</p>
          <h1 className="text-3xl font-bold text-slate-900">{firstName}</h1>
          {profile?.target_job_title && (
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp size={14} className="text-violet-500" />
              <p className="text-sm text-slate-500">
                A caminho de: <span className="text-violet-600 font-medium">{profile.target_job_title}</span>
              </p>
            </div>
          )}
        </div>
        <Link
          href="/cv/new"
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-violet-200"
        >
          <FileText size={15} />
          Novo CV
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-lg ${stat.shadow}`}>
                <span className="text-lg">{stat.icon}</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">O que queres fazer hoje?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 shadow-lg ${action.shadow}`}>
                <action.icon size={18} className="text-white" />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                  <p className="text-sm text-slate-500">{action.description}</p>
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all mt-0.5 flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}