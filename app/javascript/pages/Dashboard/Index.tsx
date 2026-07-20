import NotificationBell from '@/components/NotificationBell'
import Sidebar from '@/components/Sidebar'
import StatCard from '@/components/StatCard'
import Toast from '@/components/Toast'
import { formatCurrency } from '@/lib/format-currency'
import { type AppointmentStatus, statusLabels, statusStyles } from '@/types/appointment'
import { type ClientSummary } from '@/types/client'
import {
  Calendar,
  DollarSign,
  UserPlus,
  XCircle,
} from 'lucide-react'

interface Appointment {
  id: number
  client_name: string
  time: string
  service_name: string
  status: AppointmentStatus
}

interface PopularService {
  id: number
  name: string
  appointment_count: number
}

interface DashboardProps {
  user_name: string
  today_date: string
  stats: {
    appointments_today: number
    revenue_month: number
    new_clients_month: number
    cancelled_this_month: number
  }
  today_appointments: Appointment[]
  recent_clients: ClientSummary[]
  popular_services: PopularService[]
}

export default function Index({
  user_name,
  today_date,
  stats,
  today_appointments,
  recent_clients,
  popular_services,
}: DashboardProps) {
  const statCards = [
    {
      label: 'Citas de hoy',
      value: stats.appointments_today.toString(),
      icon: Calendar,
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Ingresos del mes',
      value: formatCurrency(stats.revenue_month),
      icon: DollarSign,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Nuevos clientes',
      value: stats.new_clients_month.toString(),
      icon: UserPlus,
      iconBg: 'bg-violet-100 dark:bg-violet-900/40',
      iconColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      label: 'Citas canceladas',
      value: stats.cancelled_this_month.toString(),
      icon: XCircle,
      iconBg: 'bg-red-100 dark:bg-red-900/40',
      iconColor: 'text-red-600 dark:text-red-400',
    },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar active="Inicio" userName={user_name} />

      <main className="ml-64 flex-1 p-8">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Buenos días, {user_name}
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">{today_date}</p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
          </div>
        </header>

        <div className="mb-8 grid grid-cols-4 gap-6">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Citas de hoy
              </h2>
            </div>
            {today_appointments.length === 0 ? (
              <p className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                No hay citas programadas para hoy
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    <th className="px-6 py-3">Hora</th>
                    <th className="px-6 py-3">Cliente</th>
                    <th className="px-6 py-3">Servicio</th>
                    <th className="px-6 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {today_appointments.map((appointment) => (
                    <tr key={appointment.id} className="text-sm">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                        {appointment.time}
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {appointment.client_name}
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {appointment.service_name}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[appointment.status]}`}
                        >
                          {statusLabels[appointment.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Servicios populares
              </h2>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {popular_services.map((service, index) => (
                <li
                  key={service.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-100 text-xs font-bold text-pink-600 dark:bg-pink-900/40 dark:text-pink-300">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {service.name}
                    </span>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {service.appointment_count} citas
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Clientes recientes
            </h2>
          </div>
          {recent_clients.length === 0 ? (
            <p className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
              No hay clientes registrados
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Última visita</th>
                  <th className="px-6 py-3">Visitas</th>
                  <th className="px-6 py-3">Total gastado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent_clients.map((client) => (
                  <tr key={client.id} className="text-sm">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      {client.last_visit}
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      {client.visit_count}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                      {formatCurrency(client.total_spent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      <Toast />
    </div>
  )
}
