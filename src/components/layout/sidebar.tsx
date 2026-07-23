'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, FileText, Search,
  Briefcase, Compass, MessageSquare,
  ClipboardList, LogOut, Sparkles, UserCircle, Menu, X
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/hooks/use-profile'
import { useProfileStore } from '@/store/profile-store'

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
  const [mobileOpen, setMobileOpen] = useState(false)
  const { clearProfile } = useProfileStore()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    clearProfile()
    window.location.href = '/login'
  }

  const SidebarContent = () => {
    const profile = useProfile()

    return (
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-none">CVBuilder</h1>
              <p className="text-xs text-slate-400 mt-0.5">Assistente de carreira</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
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
        <div className="p-3 border-t border-slate-100 space-y-0.5">
          {/* Profile preview */}
          {profile && (
            <div className="px-3 py-2.5 mb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">
                    {profile.full_name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">{profile.full_name}</p>
                  <p className="text-xs text-slate-400 truncate">{profile.email}</p>
                </div>
              </div>
            </div>
          )}

          <Link
            href="/profile"
            onClick={() => setMobileOpen(false)}
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

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-64 flex-col h-screen bg-white border-r border-slate-100 flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-100 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-bold text-slate-900">CVBuilder</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-72 z-50 bg-white border-r border-slate-100 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <SidebarContent />
      </div>
    </>
  )
}