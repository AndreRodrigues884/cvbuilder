import { createClient } from '@/lib/supabase/server'

export default async function DashboardStats({ userId }: { userId: string }) {
  const supabase = await createClient()

  const [
    { count: cvsCount },
    { data: reviews },
    { count: applicationsCount },
    { count: interviewsCount },
  ] = await Promise.all([
    supabase.from('cvs').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('ai_reviews').select('ats_score').eq('user_id', userId).limit(100),
    supabase.from('job_applications').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('interview_sessions').select('*', { count: 'exact', head: true }).eq('user_id', userId),
  ])

  const averageAts = reviews && reviews.length > 0
    ? Math.round(reviews.reduce((acc, r) => acc + (r.ats_score || 0), 0) / reviews.length)
    : null

  const stats = [
    { label: 'CVs criados', value: cvsCount ?? 0, icon: '📄', gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-200', href: '/cv' },
    { label: 'Score ATS médio', value: averageAts ?? '-', icon: '🎯', gradient: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-200', href: '/review' },
    { label: 'Candidaturas', value: applicationsCount ?? 0, icon: '📨', gradient: 'from-teal-500 to-green-500', shadow: 'shadow-teal-200', href: '/applications' },
    { label: 'Entrevistas', value: interviewsCount ?? 0, icon: '🎤', gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-200', href: '/interview-prep' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <a key={stat.label} href={stat.href} className="group">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-lg ${stat.shadow}`}>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </div>
        </a>
      ))}
    </div>
  )
}