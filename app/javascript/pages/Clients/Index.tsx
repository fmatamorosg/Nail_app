import AppointmentFormModal from '@/components/AppointmentFormModal'
import ClientFormModal from '@/components/ClientFormModal'
import ConfirmDialog from '@/components/ConfirmDialog'
import NotificationBell from '@/components/NotificationBell'
import Sidebar from '@/components/Sidebar'
import Toast from '@/components/Toast'
import { formatCurrency } from '@/lib/format-currency'
import { formatPhone } from '@/lib/format-phone'
import { type AppointmentStatus, statusLabels, statusStyles } from '@/types/appointment'
import { type ClientSummary } from '@/types/client'
import { useModalAccessibility } from '@/lib/useModalAccessibility'
import { router } from '@inertiajs/react'
import { AlertTriangle, Phone, Plus, Search } from 'lucide-react'
import { useId, useRef, useState, type FormEvent } from 'react'

interface AppointmentHistoryItem {
  id: number
  service_name: string
  date: string
  status: AppointmentStatus
}

interface Client extends ClientSummary {
  phone: string
  vip: boolean
  favorite_service: string | null
  appointment_history: AppointmentHistoryItem[]
}

interface ServiceOption {
  id: number
  name: string
  duration_minutes: number
  price: number
}

interface ClientsProps {
  clients: Client[]
  stats: {
    total: number
    vip_count: number
  }
  filters: {
    search: string
  }
  services: ServiceOption[]
}

function userInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase()
}

function formatInstagramDisplay(handle: string | null | undefined): string | null {
  if (!handle?.trim()) return null
  const trimmed = handle.trim()
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`
}

export default function Index({ clients, stats, filters, services }: ClientsProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false)
  const [cannotDeleteModalOpen, setCannotDeleteModalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [selectedClientId, setSelectedClientId] = useState<number | null>(
    () => clients[0]?.id ?? null,
  )

  const selectedClient =
    clients.find((client) => client.id === selectedClientId) ?? clients[0] ?? null

  const cannotDeleteTitleId = useId()
  const cannotDeleteCloseRef = useRef<HTMLButtonElement>(null)
  useModalAccessibility(
    cannotDeleteModalOpen,
    () => setCannotDeleteModalOpen(false),
    cannotDeleteCloseRef,
  )

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const search = (formData.get('search') as string) ?? ''
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    const query = params.toString()
    router.get(query ? `/clients?${query}` : '/clients')
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar active="Clientes" userName="Yeri" />

      <main className="ml-64 flex-1 p-8">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Clientes</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Directorio y historial de clientes
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setEditingClient(null)
                setModalOpen(true)
              }}
              className="flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-600"
            >
              <Plus className="h-4 w-4" />
              Nuevo cliente
            </button>
            <NotificationBell />
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="search"
                defaultValue={filters.search}
                placeholder="Buscar por nombre o teléfono..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </form>

            <div className="mb-4 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <span>
                Total: <strong className="text-slate-900 dark:text-slate-100">{stats.total}</strong>{' '}
                clientes
              </span>
              <span>
                VIP: <strong className="text-slate-900 dark:text-slate-100">{stats.vip_count}</strong>
              </span>
            </div>

            {clients.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <p className="text-slate-500 dark:text-slate-400">No hay clientes registrados</p>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                  {clients.map((client) => {
                    const isSelected = selectedClient?.id === client.id
                    const instagramLabel = formatInstagramDisplay(client.instagram_handle)

                    return (
                      <li key={client.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedClientId(client.id)}
                          className={`flex w-full items-center gap-4 px-6 py-4 text-left transition-colors ${
                            isSelected
                              ? 'bg-violet-50 dark:bg-violet-900/30'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                          }`}
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-500 text-sm font-semibold text-white">
                            {userInitial(client.name)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                {client.name}
                              </span>
                              {instagramLabel && (
                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                  {instagramLabel}
                                </span>
                              )}
                              {client.vip && (
                                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-200">
                                  Miembro VIP
                                </span>
                              )}
                            </div>
                            <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                              <Phone className="h-3.5 w-3.5" />
                              {formatPhone(client.phone)}
                            </div>
                          </div>

                          <div className="shrink-0 text-right text-sm">
                            <p className="text-slate-500 dark:text-slate-400">Última visita</p>
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              {client.last_visit}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400">
                              {client.visit_count} visitas
                            </p>
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>

          {selectedClient && (
            <div className="col-span-1">
              <div className="sticky top-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="mb-6 flex flex-col items-center text-center">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-pink-500 text-xl font-semibold text-white">
                    {userInitial(selectedClient.name)}
                  </div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {selectedClient.name}
                    </h2>
                    {selectedClient.vip && (
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-200">
                        Miembro VIP
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <Phone className="h-3.5 w-3.5" />
                    {formatPhone(selectedClient.phone)}
                  </div>
                  {formatInstagramDisplay(selectedClient.instagram_handle) && (
                    <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                      {formatInstagramDisplay(selectedClient.instagram_handle)}
                    </p>
                  )}
                </div>

                <div className="mb-6 grid grid-cols-3 gap-3 border-y border-slate-100 py-4 dark:border-slate-700">
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {selectedClient.visit_count}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Visitas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(selectedClient.total_spent)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
                  </div>
                  <div className="text-center">
                    <p
                      className="truncate text-lg font-bold text-slate-900 dark:text-slate-100"
                      title={selectedClient.favorite_service ?? undefined}
                    >
                      {selectedClient.favorite_service ?? '—'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Favorito</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Historial de citas
                    </h3>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      {selectedClient.appointment_history.length}
                    </span>
                  </div>

                  {selectedClient.appointment_history.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">Sin citas registradas</p>
                  ) : (
                    <ul className="space-y-3">
                      {selectedClient.appointment_history.map((appointment) => (
                        <li
                          key={appointment.id}
                          className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-700/50"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                              {appointment.service_name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {appointment.date}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[appointment.status]}`}
                          >
                            {statusLabels[appointment.status]}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {selectedClient.favorite_service && (
                  <div className="mb-6 rounded-lg bg-violet-50 px-4 py-3 dark:bg-violet-900/30">
                    <p className="text-xs font-medium text-violet-600 dark:text-violet-300">
                      Servicio favorito
                    </p>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {selectedClient.favorite_service}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setAppointmentModalOpen(true)}
                    className="w-full rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-600"
                  >
                    Agendar nueva cita
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingClient(selectedClient)
                      setModalOpen(true)
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Editar perfil
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedClient.appointment_history.length > 0) {
                      setCannotDeleteModalOpen(true)
                      return
                    }
                    setDeleteConfirmOpen(true)
                  }}
                  className="mt-2 w-full rounded-lg bg-transparent px-4 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  Eliminar cliente
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <ClientFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        client={editingClient}
      />
      {selectedClient && (
        <AppointmentFormModal
          isOpen={appointmentModalOpen}
          onClose={() => setAppointmentModalOpen(false)}
          clients={clients}
          services={services}
          appointment={null}
          initialClientId={selectedClient.id}
        />
      )}
      {cannotDeleteModalOpen && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={cannotDeleteTitleId}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
                <AlertTriangle
                  className="h-6 w-6 text-amber-600 dark:text-amber-400"
                  aria-hidden="true"
                />
              </div>
              <h2
                id={cannotDeleteTitleId}
                className="text-xl font-bold text-slate-900 dark:text-slate-100"
              >
                No se puede eliminar este cliente
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                {selectedClient.name} tiene citas registradas. Elimina o
                reasigna sus citas primero para poder eliminar su perfil.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                ref={cannotDeleteCloseRef}
                type="button"
                onClick={() => setCannotDeleteModalOpen(false)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setCannotDeleteModalOpen(false)
                  router.visit(
                    `/appointments?search=${encodeURIComponent(selectedClient.name)}`,
                  )
                }}
                className="rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-600"
              >
                Ver citas de este cliente
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={() => {
          if (selectedClient) {
            router.delete(`/clients/${selectedClient.id}`)
          }
        }}
        title="Eliminar cliente"
        message={`¿Eliminar a ${selectedClient?.name}? Esta acción no se puede deshacer y se perderá su historial.`}
        confirmLabel="Eliminar"
      />
      <Toast />
    </div>
  )
}
