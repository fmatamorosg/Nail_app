import { useForm } from '@inertiajs/react'
import { useEffect, type FormEvent } from 'react'

interface Service {
  id: number
  name: string
  description: string | null
  price: number
  duration_minutes: number
  active: boolean
}

interface ServiceFormModalProps {
  isOpen: boolean
  onClose: () => void
  service: Service | null
}

function errorMessage(error: string | string[] | undefined): string | null {
  if (!error) return null
  return Array.isArray(error) ? error[0] : error
}

export default function ServiceFormModal({
  isOpen,
  onClose,
  service,
}: ServiceFormModalProps) {
  const isEditing = service !== null

  const form = useForm({
    name: '',
    description: '',
    price: '',
    duration_minutes: '',
    active: true,
  })

  useEffect(() => {
    if (!isOpen) return

    if (service) {
      form.setData({
        name: service.name,
        description: service.description ?? '',
        price: String(service.price),
        duration_minutes: String(service.duration_minutes),
        active: service.active,
      })
    } else {
      form.setData({
        name: '',
        description: '',
        price: '',
        duration_minutes: '',
        active: true,
      })
    }
    form.clearErrors()
  }, [isOpen, service])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const options = {
      onSuccess: () => onClose(),
      preserveScroll: true,
    }

    form.transform((data) => ({ service: data }))

    if (isEditing) {
      form.patch(`/services/${service.id}`, options)
    } else {
      form.post('/services', options)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900">
          {isEditing ? 'Editar servicio' : 'Nuevo servicio'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="service-name"
              className="block text-sm font-medium text-slate-700"
            >
              Nombre
            </label>
            <input
              id="service-name"
              type="text"
              value={form.data.name}
              onChange={(e) => form.setData('name', e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
            {errorMessage(form.errors.name) && (
              <p className="mt-1 text-sm text-red-600">
                {errorMessage(form.errors.name)}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="service-description"
              className="block text-sm font-medium text-slate-700"
            >
              Descripción
            </label>
            <textarea
              id="service-description"
              value={form.data.description}
              onChange={(e) => form.setData('description', e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
            {errorMessage(form.errors.description) && (
              <p className="mt-1 text-sm text-red-600">
                {errorMessage(form.errors.description)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="service-price"
                className="block text-sm font-medium text-slate-700"
              >
                Precio
              </label>
              <input
                id="service-price"
                type="number"
                min="0"
                step="0.01"
                value={form.data.price}
                onChange={(e) => form.setData('price', e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
              {errorMessage(form.errors.price) && (
                <p className="mt-1 text-sm text-red-600">
                  {errorMessage(form.errors.price)}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="service-duration"
                className="block text-sm font-medium text-slate-700"
              >
                Duración (min)
              </label>
              <input
                id="service-duration"
                type="number"
                min="1"
                value={form.data.duration_minutes}
                onChange={(e) =>
                  form.setData('duration_minutes', e.target.value)
                }
                required
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
              {errorMessage(form.errors.duration_minutes) && (
                <p className="mt-1 text-sm text-red-600">
                  {errorMessage(form.errors.duration_minutes)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="service-active"
              type="checkbox"
              checked={form.data.active}
              onChange={(e) => form.setData('active', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-pink-500 focus:ring-pink-500"
            />
            <label
              htmlFor="service-active"
              className="text-sm font-medium text-slate-700"
            >
              Activo
            </label>
            {errorMessage(form.errors.active) && (
              <p className="text-sm text-red-600">
                {errorMessage(form.errors.active)}
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
              {isEditing ? 'Guardar cambios' : 'Crear servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
