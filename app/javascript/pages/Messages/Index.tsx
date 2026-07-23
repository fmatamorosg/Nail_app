import Layout from '@/components/Layout'
import NotificationBell from '@/components/NotificationBell'
import {
  Calendar,
  Camera,
  MessageCircle,
  MessageSquare,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const plannedIntegrations: {
  name: string
  icon: LucideIcon
}[] = [
  { name: 'WhatsApp', icon: MessageSquare },
  { name: 'Instagram', icon: Camera },
  { name: 'Google Calendar', icon: Calendar },
]

export default function Index() {
  return (
    <Layout
      active="Mensajes"
      title="Mensajes"
      subtitle="Canales de comunicación con tus clientas"
      headerActions={<NotificationBell />}
    >
      <div className="mx-auto mt-12 max-w-2xl rounded-2xl bg-white p-10 text-center shadow-lg dark:bg-slate-800">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
            <MessageCircle className="h-16 w-16 text-pink-500" />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Próximamente
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Estamos trabajando en integrar WhatsApp e Instagram para que tus
            clientas puedan agendar citas automáticamente desde ahí.
          </p>

          <div className="mt-8 divide-y divide-slate-200 text-left dark:divide-slate-700">
            {plannedIntegrations.map(({ name, icon: Icon }) => (
              <div
                key={name}
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {name}
                  </span>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  Próximamente
                </span>
              </div>
            ))}
          </div>
        </div>
    </Layout>
  )
}
