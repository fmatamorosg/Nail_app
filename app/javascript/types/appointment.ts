export type AppointmentStatus = "confirmed" | "completed" | "cancelled"

export interface Appointment {
  id: number
  client_id: number
  service_id: number
  scheduled_at: string
  client_name: string
  date: string
  time: string
  service_name: string
  status: AppointmentStatus
}

export interface PendingCheck {
  id: number
  client_name: string
  service_name: string
  scheduled_at: string
}

export const statusLabels: Record<AppointmentStatus, string> = {
  confirmed: "Confirmada",
  completed: "Completada",
  cancelled: "Cancelada",
}

export const statusStyles: Record<AppointmentStatus, string> = {
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
  cancelled: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
}
