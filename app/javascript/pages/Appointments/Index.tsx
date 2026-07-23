import AppointmentFormModal from '@/components/AppointmentFormModal'
import AppointmentsTable from '@/components/AppointmentsTable'
import ConfirmDialog from '@/components/ConfirmDialog'
import Layout from '@/components/Layout'
import NotificationBell from '@/components/NotificationBell'
import StatCard from '@/components/StatCard'
import Toast from '@/components/Toast'
import { type Appointment } from '@/types/appointment'
import { type ClientOption } from '@/types/client'
import { type ServiceOption } from '@/types/service'
import { Link, router } from '@inertiajs/react'
import {
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  Search,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'

interface AppointmentsProps {
  appointments: Appointment[]
  stats: {
    total_week: number
    confirmed: number
    cancelled: number
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
  clients: ClientOption[]
  services: ServiceOption[]
}

const statusPills = [
  { label: 'Todos', value: 'all' },
  { label: 'Confirmada', value: 'confirmed' },
  { label: 'Cancelada', value: 'cancelled' },
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
  clients,
  services,
}: AppointmentsProps) {
  const [modalOpen, setModalOpen] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return Boolean(params.get('edit'))
  })
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [appointmentToDelete, setAppointmentToDelete] =
    useState<Appointment | null>(null)
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(() => {
      const params = new URLSearchParams(window.location.search)
      const editId = params.get('edit')
      if (!editId) return null
      return appointments.find((a) => a.id === Number(editId)) ?? null
    })

  const statCards = [
    {
      label: 'Total esta semana',
      value: stats.total_week.toString(),
      icon: Calendar,
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Confirmadas',
      value: stats.confirmed.toString(),
      icon: CheckCircle,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Canceladas',
      value: stats.cancelled.toString(),
      icon: Clock,
      iconBg: 'bg-slate-100 dark:bg-slate-700/40',
      iconColor: 'text-slate-600 dark:text-slate-400',
    },
    {
      label: 'Completadas',
      value: stats.completed.toString(),
      icon: CheckCircle,
      iconBg: 'bg-violet-100 dark:bg-violet-900/40',
      iconColor: 'text-violet-600 dark:text-violet-400',
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
    <>
      <Layout
        active="Citas"
        title="Citas"
        subtitle="Gestiona y consulta todas las citas"
        headerActions={
          <>
            <button
              type="button"
              onClick={() => {
                setEditingAppointment(null)
                setModalOpen(true)
              }}
              className="flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-600"
            >
              <Plus className="h-4 w-4" />
              Nueva cita
            </button>
            <NotificationBell />
          </>
        }
      >
        <div className="mb-8 grid grid-cols-4 gap-6">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
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
                      : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-600 dark:hover:bg-slate-700'
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
              className="w-72 rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </form>
        </div>

        <AppointmentsTable
          appointments={appointments}
          onEdit={(appointment) => {
            setEditingAppointment(appointment)
            setModalOpen(true)
          }}
          onDelete={(appointment) => {
            setAppointmentToDelete(appointment)
            setDeleteConfirmOpen(true)
          }}
        />

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Mostrando {appointments.length} de {pagination.count} citas
          </p>

          <div className="flex items-center gap-2">
            {isFirstPage ? (
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-600">
                Anterior
              </span>
            ) : (
              <Link
                href={buildQuery(filters, pagination, {
                  page: pagination.page - 1,
                })}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Anterior
              </Link>
            )}

            <span className="px-2 text-sm text-slate-500 dark:text-slate-400">
              Página {pagination.page} de {pagination.pages}
            </span>

            {isLastPage ? (
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-600">
                Siguiente
              </span>
            ) : (
              <Link
                href={buildQuery(filters, pagination, {
                  page: pagination.page + 1,
                })}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Siguiente
              </Link>
            )}
          </div>
        </div>
      </Layout>

      <AppointmentFormModal
        key={editingAppointment?.id ?? 'new'}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        clients={clients}
        services={services}
        appointment={editingAppointment}
      />
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={() => {
          if (appointmentToDelete) {
            router.delete(`/appointments/${appointmentToDelete.id}`)
          }
        }}
        title="Eliminar cita"
        message={`¿Eliminar la cita de ${appointmentToDelete?.client_name}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
      />
      <Toast />
    </>
  )
}
