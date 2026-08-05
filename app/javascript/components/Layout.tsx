import Sidebar from '@/components/Sidebar'
import PendingCheckModal from '@/components/PendingCheckModal'
import { usePage } from '@inertiajs/react'
import type { ReactNode } from 'react'

interface LayoutProps {
  active: string
  title: string
  subtitle: string
  headerActions?: ReactNode
  children: ReactNode
}

export default function Layout({
  active,
  title,
  subtitle,
  headerActions,
  children,
}: LayoutProps) {
  const { props } = usePage<{ user_name?: string | null }>()
  const userName = props.user_name ?? ''

  return (
    <>
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

      <PendingCheckModal />
    </>
  )
}
