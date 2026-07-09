export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled"

export const statusLabels: Record<AppointmentStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  completed: "Completada",
  cancelled: "Cancelada",
}

export const statusStyles: Record<AppointmentStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-slate-100 text-slate-600",
}
