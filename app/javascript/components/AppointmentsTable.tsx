import {
  type Appointment,
  statusLabels,
  statusStyles,
} from '@/types/appointment'
import { Pencil, Trash2 } from 'lucide-react'

interface AppointmentsTableProps {
  appointments: Appointment[]
  canEdit?: boolean
  onEdit?: (appointment: Appointment) => void
  onDelete?: (appointment: Appointment) => void
}

export default function AppointmentsTable({
  appointments,
  canEdit = true,
  onEdit,
  onDelete,
}: AppointmentsTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {appointments.length === 0 ? (
        <p className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
          No hay citas que coincidan con los filtros
        </p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
              <th scope="col" className="px-6 py-3">
                Cliente
              </th>
              <th scope="col" className="px-6 py-3">
                Fecha
              </th>
              <th scope="col" className="px-6 py-3">
                Hora
              </th>
              <th scope="col" className="px-6 py-3">
                Servicio
              </th>
              <th scope="col" className="px-6 py-3">
                Estado
              </th>
              {canEdit && (
                <th scope="col" className="px-6 py-3">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="text-sm">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                  {appointment.client_name}
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {appointment.date}
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {appointment.time}
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
                {canEdit && (
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Editar cita de ${appointment.client_name}`}
                        onClick={() => onEdit?.(appointment)}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Eliminar cita de ${appointment.client_name}`}
                        onClick={() => onDelete?.(appointment)}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
