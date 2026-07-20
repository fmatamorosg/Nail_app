import {
  type AppointmentStatus,
  statusLabels,
} from '@/types/appointment'
import { useModalAccessibility } from '@/lib/useModalAccessibility'
import { useForm } from '@inertiajs/react'
import { useEffect, useId, useRef, type FormEvent } from 'react'

interface ClientOption {
  id: number
  name: string
}

interface ServiceOption {
  id: number
  name: string
  duration_minutes: number
  price: number
}

interface AppointmentFormData {
  id: number
  client_id: number
  service_id: number
  scheduled_at: string
  status: AppointmentStatus
}

interface AppointmentFormModalProps {
  isOpen: boolean
  onClose: () => void
  clients: ClientOption[]
  services: ServiceOption[]
  appointment: AppointmentFormData | null
  initialClientId?: number
}

const statusOptions: AppointmentStatus[] = [
  'confirmed',
  'completed',
  'cancelled',
]

function errorMessage(error: string | string[] | undefined): string | null {
  if (!error) return null
  return Array.isArray(error) ? error[0] : error
}

function toDatetimeLocalValue(isoString: string): string {
  const date = new Date(isoString)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const selectClassName =
  'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100'

export default function AppointmentFormModal({
  isOpen,
  onClose,
  clients,
  services,
  appointment,
  initialClientId,
}: AppointmentFormModalProps) {
  const isEditing = appointment !== null
  const titleId = useId()
  const firstFieldRef = useRef<HTMLSelectElement>(null)

  const form = useForm({
    client_id: '',
    service_id: '',
    scheduled_at: '',
    status: 'confirmed' as AppointmentStatus,
  })

  useEffect(() => {
    if (!isOpen) return

    if (appointment) {
      form.setData({
        client_id: String(appointment.client_id),
        service_id: String(appointment.service_id),
        scheduled_at: toDatetimeLocalValue(appointment.scheduled_at),
        status: appointment.status,
      })
    } else {
      form.setData({
        client_id:
          initialClientId != null ? String(initialClientId) : '',
        service_id: '',
        scheduled_at: '',
        status: 'confirmed',
      })
    }
    form.clearErrors()
  }, [isOpen, appointment, initialClientId])

  useModalAccessibility(isOpen, onClose, firstFieldRef)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const options = {
      onSuccess: () => onClose(),
      preserveScroll: true,
    }

    form.transform((data) => ({ appointment: data }))

    if (isEditing) {
      form.patch(`/appointments/${appointment.id}`, options)
    } else {
      form.post('/appointments', options)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800"
      >
        <h2 id={titleId} className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {isEditing ? 'Editar cita' : 'Nueva cita'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="appointment-client"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Cliente
            </label>
            <select
              ref={firstFieldRef}
              id="appointment-client"
              value={form.data.client_id}
              onChange={(e) => form.setData('client_id', e.target.value)}
              required
              className={selectClassName}
            >
              <option value="">Seleccionar cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errorMessage(form.errors.client_id) && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errorMessage(form.errors.client_id)}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="appointment-service"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Servicio
            </label>
            <select
              id="appointment-service"
              value={form.data.service_id}
              onChange={(e) => form.setData('service_id', e.target.value)}
              required
              className={selectClassName}
            >
              <option value="">Seleccionar servicio</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            {errorMessage(form.errors.service_id) && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errorMessage(form.errors.service_id)}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="appointment-scheduled-at"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Fecha y hora
            </label>
            <input
              id="appointment-scheduled-at"
              type="datetime-local"
              value={form.data.scheduled_at}
              onChange={(e) => form.setData('scheduled_at', e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
            {errorMessage(form.errors.scheduled_at) && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errorMessage(form.errors.scheduled_at)}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="appointment-status"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Estado
            </label>
            <select
              id="appointment-status"
              value={form.data.status}
              onChange={(e) =>
                form.setData('status', e.target.value as AppointmentStatus)
              }
              required
              className={selectClassName}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
            {errorMessage(form.errors.status) && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errorMessage(form.errors.status)}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={form.processing}
              className="rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
            >
              {isEditing ? 'Guardar cambios' : 'Crear cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
