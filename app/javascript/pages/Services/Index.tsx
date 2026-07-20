import ConfirmDialog from '@/components/ConfirmDialog'
import ServiceFormModal from '@/components/ServiceFormModal'
import Sidebar from '@/components/Sidebar'
import StatCard from '@/components/StatCard'
import { formatCurrency } from '@/lib/format-currency'
import { router } from '@inertiajs/react'
import {
  Bell,
  CheckCircle,
  Clock,
  DollarSign,
  Pencil,
  Plus,
  Scissors,
  Star,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'

interface Service {
  id: number
  name: string
  description: string | null
  price: number
  duration_minutes: number
  active: boolean
  appointment_count: number
}

interface ServicesProps {
  services: Service[]
  stats: {
    total: number
    most_popular: string | null
    average_price: number
    active_count: number
  }
}

export default function Index({ services, stats }: ServicesProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const statCards = [
    {
      label: 'Total de servicios',
      value: stats.total.toString(),
      icon: Scissors,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Más popular',
      value: stats.most_popular ?? '—',
      icon: Star,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
    },
    {
      label: 'Precio promedio',
      value: formatCurrency(stats.average_price),
      icon: DollarSign,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Servicios activos',
      value: stats.active_count.toString(),
      icon: CheckCircle,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar active="Servicios" userName="Yeri" />

      <main className="ml-64 flex-1 p-8">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Servicios</h1>
            <p className="mt-1 text-slate-500">
              Catálogo de servicios del salón
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setEditingService(null)
                setModalOpen(true)
              }}
              className="flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-600"
            >
              <Plus className="h-4 w-4" />
              Nuevo servicio
            </button>
            <button
              type="button"
              aria-label="Notificaciones"
              className="relative rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 transition-colors hover:bg-slate-50"
            >
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="mb-8 grid grid-cols-4 gap-6">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {services.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-slate-500">No hay servicios registrados</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="absolute right-4 top-4 flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Editar ${service.name}`}
                    onClick={() => {
                      setEditingService(service)
                      setModalOpen(true)
                    }}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Eliminar ${service.name}`}
                    onClick={() => {
                      setServiceToDelete(service)
                      setDeleteConfirmOpen(true)
                    }}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <h2 className="pr-16 text-lg font-bold text-slate-900">
                  {service.name}
                </h2>

                <p className="mt-2 text-xl font-semibold text-pink-600">
                  {formatCurrency(service.price)}
                </p>

                <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                  <Clock className="h-4 w-4" />
                  {service.duration_minutes} min
                </div>

                {service.description && (
                  <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                    {service.description}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      service.active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {service.active ? 'Activo' : 'Inactivo'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {service.appointment_count} citas registradas
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ServiceFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        service={editingService}
      />
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={() => {
          if (serviceToDelete) {
            router.delete(`/services/${serviceToDelete.id}`)
          }
        }}
        title="Eliminar servicio"
        message={`¿Eliminar el servicio "${serviceToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
      />
    </div>
  )
}
