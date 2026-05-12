'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, FileText, Search,
  Briefcase, Compass, MessageSquare,
  ClipboardList, LogOut, Sparkles, UserCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, gradient: 'from-violet-500 to-purple-600' },
  { name: 'Os meus CVs', href: '/cv', icon: FileText, gradient: 'from-blue-500 to-cyan-500' },
  { name: 'AI Review', href: '/review', icon: Search, gradient: 'from-cyan-500 to-teal-500' },
  { name: 'Job Match', href: '/job-match', icon: Briefcase, gradient: 'from-teal-500 to-green-500' },
  { name: 'Career Copilot', href: '/career-copilot', icon: Compass, gradient: 'from-amber-500 to-orange-500' },
  { name: 'Interview Prep', href: '/interview-prep', icon: MessageSquare, gradient: 'from-orange-500 to-rose-500' },
  { name: 'Candidaturas', href: '/applications', icon: ClipboardList, gradient: 'from-rose-500 to-pink-500' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="w-64 flex flex-col h-screen bg-white border-r border-slate-100">
      {/* Logo */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-none">CVBuilder</h1>
            <p className="text-xs text-slate-400 mt-0.5">Assistente de carreira</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150 ${isActive
                  ? `bg-gradient-to-br ${item.gradient} shadow-sm`
                  : 'bg-slate-100 group-hover:bg-slate-200'
                }`}>
                <item.icon size={14} className={isActive ? 'text-white' : 'text-slate-500'} />
              </div>
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      {/* Bottom */}
      <div className="p-3 border-t border-slate-100 space-y-0.5">
        <Link
          href="/profile"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${pathname === '/profile'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
        >
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150 ${pathname === '/profile'
              ? 'bg-gradient-to-br from-slate-500 to-slate-700'
              : 'bg-slate-100 group-hover:bg-slate-200'
            }`}>
            <UserCircle size={14} className={pathname === '/profile' ? 'text-white' : 'text-slate-500'} />
          </div>
          Perfil
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all w-full group"
        >
          <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center flex-shrink-0 transition-all">
            <LogOut size={14} className="text-slate-500" />
          </div>
          Sair
        </button>
      </div>
    </div>
  )
}