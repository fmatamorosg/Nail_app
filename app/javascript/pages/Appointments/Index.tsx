import Sidebar from '@/components/Sidebar'
import { Link, router } from '@inertiajs/react'
import {
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  Search,
} from 'lucide-react'
import type { FormEvent } from 'react'

interface Appointment {
  id: number
  client_name: string
  date: string
  time: string
  service_name: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

interface AppointmentsProps {
  appointments: Appointment[]
  stats: {
    total_week: number
    confirmed: number
    pending: number
    completed: number
  }
  filters: {
    status: string
    search: string
    from: string | null
    to: string | null
  }
  pagination: {
    page: number
    pages: number
    count: number
  }
}

const statusLabels: Record<Appointment['status'], string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

const statusStyles: Record<Appointment['status'], string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-slate-100 text-slate-600',
}

const statusPills = [
  { label: 'Todos', value: 'all' },
  { label: 'Confirmada', value: 'confirmed' },
  { label: 'Pendiente', value: 'pending' },
  { label: 'Completada', value: 'completed' },
] as const

function buildQuery(
  filters: AppointmentsProps['filters'],
  pagination: AppointmentsProps['pagination'],
  overrides: Partial<{
    status: string
    search: string
    from: string | null
    to: string | null
    page: number
  }> = {},
): string {
  const params = new URLSearchParams()

  const status = overrides.status ?? filters.status
  const search = overrides.search ?? filters.search
  const from = overrides.from !== undefined ? overrides.from : filters.from
  const to = overrides.to !== undefined ? overrides.to : filters.to
  const page = overrides.page ?? pagination.page

  if (status && status !== 'all') params.set('status', status)
  if (search) params.set('search', search)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  if (page > 1) params.set('page', String(page))

  const query = params.toString()
  return query ? `/appointments?${query}` : '/appointments'
}

export default function Index({
  appointments,
  stats,
  filters,
  pagination,
}: AppointmentsProps) {
  const statCards = [
    {
      label: 'Total esta semana',
      value: stats.total_week.toString(),
      icon: Calendar,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Confirmadas',
      value: stats.confirmed.toString(),
      icon: CheckCircle,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Pendientes',
      value: stats.pending.toString(),
      icon: Clock,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Completadas',
      value: stats.completed.toString(),
      icon: CheckCircle,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
    },
  ]

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const search = (formData.get('search') as string) ?? ''
    router.get(buildQuery(filters, pagination, { search, page: 1 }))
  }

  const isFirstPage = pagination.page <= 1
  const isLastPage = pagination.page >= pagination.pages

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar active="Citas" userName="Yeri" />

      <main className="ml-64 flex-1 p-8">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Citas</h1>
            <p className="mt-1 text-slate-500">
              Gestiona y consulta todas las citas
            </p>
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

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {statusPills.map(({ label, value }) => {
              const isActive = filters.status === value
              return (
                <Link
                  key={value}
                  href={buildQuery(filters, pagination, { status: value, page: 1 })}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-pink-500 text-white'
                      : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </div>

          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="search"
              defaultValue={filters.search}
              placeholder="Buscar por cliente o servicio..."
              className="w-72 rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </form>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          {appointments.length === 0 ? (
            <p className="px-6 py-8 text-center text-slate-500">
              No hay citas que coincidan con los filtros
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Fecha</th>
                  <th className="px-6 py-3">Hora</th>
                  <th className="px-6 py-3">Servicio</th>
                  <th className="px-6 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="text-sm">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {appointment.client_name}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {appointment.date}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {appointment.time}
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

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Mostrando {appointments.length} de {pagination.count} citas
          </p>

          <div className="flex items-center gap-2">
            {isFirstPage ? (
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-300">
                Anterior
              </span>
            ) : (
              <Link
                href={buildQuery(filters, pagination, {
                  page: pagination.page - 1,
                })}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Anterior
              </Link>
            )}

            <span className="px-2 text-sm text-slate-500">
              Página {pagination.page} de {pagination.pages}
            </span>

            {isLastPage ? (
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-300">
                Siguiente
              </span>
            ) : (
              <Link
                href={buildQuery(filters, pagination, {
                  page: pagination.page + 1,
                })}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Siguiente
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
