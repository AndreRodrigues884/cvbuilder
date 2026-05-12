import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Olá, {profile?.full_name || 'utilizador'} 👋
        </h1>
        <p className="text-slate-500 mt-1">Bem-vindo ao teu painel de controlo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'CVs criados', value: '0' },
          { label: 'Score ATS médio', value: '-' },
          { label: 'Candidaturas', value: '0' },
          { label: 'Entrevistas', value: '0' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Começar por aqui</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Criar novo CV', description: 'Cria um CV do zero com ajuda de AI', href: '/cv/new', emoji: '📄' },
            { title: 'Analisar CV', description: 'Importa o teu CV e recebe feedback', href: '/review', emoji: '🔍' },
            { title: 'Preparar entrevista', description: 'Treina para a tua próxima entrevista', href: '/interview-prep', emoji: '🎯' },
          ].map((action) => (
            <a
              key={action.title}
              href={action.href}
              className="flex flex-col gap-2 p-4 rounded-lg border border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-colors"
            >
              <span className="text-2xl">{action.emoji}</span>
              <span className="font-medium text-slate-900">{action.title}</span>
              <span className="text-sm text-slate-500">{action.description}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}