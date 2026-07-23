import Sidebar from '@/components/Sidebar'
import type { ReactNode } from 'react'

interface LayoutProps {
  active: string
  title: string
  subtitle: string
  userName?: string
  headerActions?: ReactNode
  children: ReactNode
}

export default function Layout({
  active,
  title,
  subtitle,
  userName = 'Yeri',
  headerActions,
  children,
}: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar active={active} userName={userName} />

      <main className="ml-64 flex-1 p-8">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
          {headerActions && (
            <div className="flex items-center gap-3">{headerActions}</div>
          )}
        </header>

        {children}
      </main>
    </div>
  )
}
