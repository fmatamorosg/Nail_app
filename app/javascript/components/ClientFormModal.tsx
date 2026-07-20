import { useModalAccessibility } from '@/lib/useModalAccessibility'
import { useForm } from '@inertiajs/react'
import { useEffect, useId, useRef, type FormEvent } from 'react'

interface Client {
  id: number
  name: string
  phone: string
  vip: boolean
}

interface ClientFormModalProps {
  isOpen: boolean
  onClose: () => void
  client: Client | null
}

function errorMessage(error: string | string[] | undefined): string | null {
  if (!error) return null
  return Array.isArray(error) ? error[0] : error
}

export default function ClientFormModal({
  isOpen,
  onClose,
  client,
}: ClientFormModalProps) {
  const isEditing = client !== null
  const titleId = useId()
  const firstFieldRef = useRef<HTMLInputElement>(null)

  const form = useForm({
    name: '',
    phone: '',
    vip: false,
  })

  useEffect(() => {
    if (!isOpen) return

    if (client) {
      form.setData({
        name: client.name,
        phone: client.phone,
        vip: client.vip,
      })
    } else {
      form.setData({
        name: '',
        phone: '',
        vip: false,
      })
    }
    form.clearErrors()
  }, [isOpen, client])

  useModalAccessibility(isOpen, onClose, firstFieldRef)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const options = {
      onSuccess: () => onClose(),
      preserveScroll: true,
    }

    form.transform((data) => ({ client: data }))

    if (isEditing) {
      form.patch(`/clients/${client.id}`, options)
    } else {
      form.post('/clients', options)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 id={titleId} className="text-xl font-bold text-slate-900">
          {isEditing ? 'Editar cliente' : 'Nuevo cliente'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="client-name"
              className="block text-sm font-medium text-slate-700"
            >
              Nombre
            </label>
            <input
              ref={firstFieldRef}
              id="client-name"
              type="text"
              value={form.data.name}
              onChange={(e) => form.setData('name', e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
            {errorMessage(form.errors.name) && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errorMessage(form.errors.name)}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="client-phone"
              className="block text-sm font-medium text-slate-700"
            >
              Teléfono
            </label>
            <input
              id="client-phone"
              type="text"
              value={form.data.phone}
              onChange={(e) => form.setData('phone', e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
            {errorMessage(form.errors.phone) && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errorMessage(form.errors.phone)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="client-vip"
              type="checkbox"
              checked={form.data.vip}
              onChange={(e) => form.setData('vip', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-pink-500 focus:ring-pink-500"
            />
            <label
              htmlFor="client-vip"
              className="text-sm font-medium text-slate-700"
            >
              Cliente VIP
            </label>
            {errorMessage(form.errors.vip) && (
              <p role="alert" className="text-sm text-red-600">
                {errorMessage(form.errors.vip)}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={form.processing}
              className="rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
            >
              {isEditing ? 'Guardar cambios' : 'Crear cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
