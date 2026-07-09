import Sidebar from '@/components/Sidebar'
import { formatCurrency } from '@/lib/format-currency'
import { type AppointmentStatus, statusLabels, statusStyles } from '@/types/appointment'
import {
  Bell,
  Calendar,
  Clock,
  DollarSign,
  Plus,
  UserPlus,
} from 'lucide-react'

interface Appointment {
  id: number
  client_name: string
  time: string
  service_name: string
  status: AppointmentStatus
}

interface Client {
  id: number
  name: string
  last_visit: string
  total_spent: number
  visit_count: number
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
    pending_confirmations: number
  }
  today_appointments: Appointment[]
  recent_clients: Client[]
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
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Ingresos del mes',
      value: formatCurrency(stats.revenue_month),
      icon: DollarSign,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Nuevos clientes',
      value: stats.new_clients_month.toString(),
      icon: UserPlus,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
    },
    {
      label: 'Confirmaciones pendientes',
      value: stats.pending_confirmations.toString(),
      icon: Clock,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar active="Inicio" userName={user_name} />

      <main className="ml-64 flex-1 p-8">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Buenos días, {user_name}
            </h1>
            <p className="mt-1 text-slate-500">{today_date}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-600"
            >
              <Plus className="h-4 w-4" />
              Nueva cita
            </button>
            <button
              type="button"
              className="relative rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 transition-colors hover:bg-slate-50"
            >
              <Bell className="h-5 w-5" />
              {stats.pending_confirmations > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white">
                  {stats.pending_confirmations}
                </span>
              )}
            </button>
          </div>
        </header>

        <div className="mb-8 grid grid-cols-4 gap-6">
          {statCards.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
                </div>
                <div className={`rounded-lg p-3 ${iconBg}`}>
                  <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Citas de hoy
              </h2>
            </div>
            {today_appointments.length === 0 ? (
              <p className="px-6 py-8 text-center text-slate-500">
                No hay citas programadas para hoy
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-3">Hora</th>
                    <th className="px-6 py-3">Cliente</th>
                    <th className="px-6 py-3">Servicio</th>
                    <th className="px-6 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {today_appointments.map((appointment) => (
                    <tr key={appointment.id} className="text-sm">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {appointment.time}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {appointment.client_name}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
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

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Servicios populares
              </h2>
            </div>
            <ul className="divide-y divide-slate-100">
              {popular_services.map((service, index) => (
                <li
                  key={service.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-100 text-xs font-bold text-pink-600">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-900">
                      {service.name}
                    </span>
                  </div>
                  <span className="text-sm text-slate-500">
                    {service.appointment_count} citas
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Clientes recientes
            </h2>
          </div>
          {recent_clients.length === 0 ? (
            <p className="px-6 py-8 text-center text-slate-500">
              No hay clientes registrados
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Última visita</th>
                  <th className="px-6 py-3">Visitas</th>
                  <th className="px-6 py-3">Total gastado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent_clients.map((client) => (
                  <tr key={client.id} className="text-sm">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {client.last_visit}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {client.visit_count}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {formatCurrency(client.total_spent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
