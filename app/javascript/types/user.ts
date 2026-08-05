export type TeamRole = 'employee' | 'admin' | 'owner'

export type NavLabel =
  | 'Inicio'
  | 'Citas'
  | 'Clientes'
  | 'Servicios'
  | 'Estadísticas'
  | 'Mensajes'
  | 'Equipo'
  | 'Configuración'

export const roleLabels: Record<TeamRole, string> = {
  employee: 'Empleada',
  admin: 'Administrador',
  owner: 'Dueña',
}

const employeeNavLabels: NavLabel[] = ['Citas', 'Estadísticas', 'Configuración']

export function isManager(role: TeamRole | null | undefined): boolean {
  return role === 'owner' || role === 'admin'
}

export function canEditAppointments(role: TeamRole | null | undefined): boolean {
  return isManager(role)
}

export function canEditSalonData(role: TeamRole | null | undefined): boolean {
  return role === 'owner'
}

export function canSeeNavItem(label: NavLabel, role: TeamRole | null | undefined): boolean {
  if (!role) return false

  if (role === 'employee') {
    return employeeNavLabels.includes(label)
  }

  if (label === 'Equipo') {
    return isManager(role)
  }

  return true
}

export function sidebarRoleLabel(role: TeamRole | null | undefined): string | null {
  if (role === 'owner') return roleLabels.owner
  if (role === 'admin') return roleLabels.admin
  return null
}
