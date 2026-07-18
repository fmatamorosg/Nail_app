import { Link } from '@inertiajs/react'
import {
  BarChart3,
  Calendar,
  Home,
  MessageSquare,
  Scissors,
  Settings,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type NavLabel =
  | 'Inicio'
  | 'Citas'
  | 'Clientes'
  | 'Servicios'
  | 'Estadísticas'
  | 'Mensajes'
  | 'Configuración'

interface SidebarProps {
  active: NavLabel
  userName: string
}

const navItems: { label: NavLabel; icon: LucideIcon; href: string }[] = [
  { label: 'Inicio', icon: Home, href: '/' },
  { label: 'Citas', icon: Calendar, href: '/appointments' },
  { label: 'Clientes', icon: Users, href: '/clients' },
  { label: 'Servicios', icon: Scissors, href: '/services' },
  { label: 'Estadísticas', icon: BarChart3, href: '#' },
  { label: 'Mensajes', icon: MessageSquare, href: '#' },
  { label: 'Configuración', icon: Settings, href: '#' },
]

function userInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase()
}

export default function Sidebar({ active, userName }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 flex w-64 flex-col bg-slate-900 text-white">
      <div className="border-b border-slate-800 px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-lg font-bold">
            NS
          </div>
          <div>
            <p className="font-semibold">Nail Studio</p>
            <p className="text-sm text-slate-400">Panel de control</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {navItems.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active === label
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-800 px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-sm font-semibold">
            {userInitial(userName)}
          </div>
          <div>
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-slate-400">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
