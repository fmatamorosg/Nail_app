export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled"

export const statusLabels: Record<AppointmentStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  completed: "Completada",
  cancelled: "Cancelada",
}

export const statusStyles: Record<AppointmentStatus, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
  cancelled: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
}
