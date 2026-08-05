import ConfirmDialog from '@/components/ConfirmDialog'
import Layout from '@/components/Layout'
import NotificationBell from '@/components/NotificationBell'
import Toast from '@/components/Toast'
import { useModalAccessibility } from '@/lib/useModalAccessibility'
import { roleLabels, type TeamRole } from '@/types/user'
import { router, useForm } from '@inertiajs/react'
import { AlertTriangle, Plus, UserCog } from 'lucide-react'
import { useId, useRef, useState, type FormEvent } from 'react'

interface TeamMember {
  id: number
  name: string
  email: string
  role: TeamRole
}

interface TeamProps {
  members: TeamMember[]
  current_user_id: number
}

const inputClassName =
  'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100'

function roleBadgeClass(role: TeamRole): string {
  const base = 'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium'
  switch (role) {
    case 'owner':
      return `${base} bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200`
    case 'admin':
      return `${base} bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200`
    case 'employee':
      return `${base} bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300`
  }
}

function errorMessage(error: string | string[] | undefined): string | null {
  if (!error) return null
  return Array.isArray(error) ? error[0] : error
}

interface RoleChangeDialogProps {
  isOpen: boolean
  member: TeamMember | null
  selectedRole: 'employee' | 'admin'
  currentPassword: string
  canAssignAdmin: boolean
  onClose: () => void
  onRoleChange: (role: 'employee' | 'admin') => void
  onPasswordChange: (password: string) => void
  onConfirm: () => void
}

function RoleChangeDialog({
  isOpen,
  member,
  selectedRole,
  currentPassword,
  canAssignAdmin,
  onClose,
  onRoleChange,
  onPasswordChange,
  onConfirm,
}: RoleChangeDialogProps) {
  const titleId = useId()
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const requiresPassword = selectedRole === 'admin'

  useModalAccessibility(isOpen, onClose, cancelButtonRef)

  if (!isOpen || !member) return null

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onConfirm()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
            <AlertTriangle
              className="h-6 w-6 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
          </div>
          <h2 id={titleId} className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Cambiar rol
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Actualizá el rol de {member.name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="role-change-select"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Nuevo rol
            </label>
            <select
              id="role-change-select"
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value as 'employee' | 'admin')}
              className={inputClassName}
            >
              <option value="employee">Empleada</option>
              {canAssignAdmin && <option value="admin">Administrador</option>}
            </select>
          </div>

          {requiresPassword && (
            <div>
              <label
                htmlFor="role-change-password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Tu contraseña actual
              </label>
              <input
                id="role-change-password"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => onPasswordChange(e.target.value)}
                required
                className={inputClassName}
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Se requiere para asignar el rol de administrador
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              ref={cancelButtonRef}
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-600"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Index({ members, current_user_id }: TeamProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null)
  const [roleChangeTarget, setRoleChangeTarget] = useState<TeamMember | null>(null)
  const [selectedRole, setSelectedRole] = useState<'employee' | 'admin'>('employee')
  const [roleChangePassword, setRoleChangePassword] = useState('')

  const currentUser = members.find((member) => member.id === current_user_id)
  const isOwner = currentUser?.role === 'owner'

  const addForm = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'employee' as 'employee' | 'admin',
    current_password: '',
  })

  function handleAddSubmit(event: FormEvent) {
    event.preventDefault()

    const payload: {
      user: {
        name: string
        email: string
        password: string
        password_confirmation: string
        role: string
      }
      current_password?: string
    } = {
      user: {
        name: addForm.data.name,
        email: addForm.data.email,
        password: addForm.data.password,
        password_confirmation: addForm.data.password_confirmation,
        role: addForm.data.role,
      },
    }

    if (addForm.data.role === 'admin') {
      payload.current_password = addForm.data.current_password
    }

    router.post('/team', payload, {
      preserveScroll: true,
      onSuccess: () => {
        addForm.reset()
        setShowAddForm(false)
      },
    })
  }

  function openRoleChangeDialog(member: TeamMember) {
    setRoleChangeTarget(member)
    // Si quien abre el diálogo no es owner, nunca puede ofrecer "admin"
    // como default, porque esa opción ni siquiera se muestra en el select.
    setSelectedRole(member.role === 'admin' || !isOwner ? 'employee' : 'admin')
    setRoleChangePassword('')
  }

  function closeRoleChangeDialog() {
    setRoleChangeTarget(null)
    setRoleChangePassword('')
  }

  function confirmRoleChange() {
    if (!roleChangeTarget) return

    const payload: {
      user: { role: string }
      current_password?: string
    } = {
      user: { role: selectedRole },
    }

    if (selectedRole === 'admin') {
      payload.current_password = roleChangePassword
    }

    router.patch(`/team/${roleChangeTarget.id}`, payload, {
      preserveScroll: true,
      onSuccess: closeRoleChangeDialog,
    })
  }

  function confirmDelete() {
    if (!deleteTarget) return

    router.delete(`/team/${deleteTarget.id}`, {
      preserveScroll: true,
      onSuccess: () => setDeleteTarget(null),
    })
  }

  return (
    <>
      <Layout
        active="Equipo"
        title="Equipo"
        subtitle="Gestioná quién tiene acceso al salón"
        headerActions={
          <>
            <button
              type="button"
              onClick={() => setShowAddForm((open) => !open)}
              className="flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-600"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Agregar persona
            </button>
            <NotificationBell />
          </>
        }
      >
        {showAddForm && (
          <section className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Nueva persona
            </h2>

            <form onSubmit={handleAddSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="team-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Nombre
                  </label>
                  <input
                    id="team-name"
                    type="text"
                    value={addForm.data.name}
                    onChange={(e) => addForm.setData('name', e.target.value)}
                    required
                    className={inputClassName}
                  />
                  {errorMessage(addForm.errors.name) && (
                    <p role="alert" className="mt-1 text-sm text-red-600">
                      {errorMessage(addForm.errors.name)}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="team-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email
                  </label>
                  <input
                    id="team-email"
                    type="email"
                    autoComplete="off"
                    value={addForm.data.email}
                    onChange={(e) => addForm.setData('email', e.target.value)}
                    required
                    className={inputClassName}
                  />
                  {errorMessage(addForm.errors.email) && (
                    <p role="alert" className="mt-1 text-sm text-red-600">
                      {errorMessage(addForm.errors.email)}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="team-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Contraseña
                  </label>
                  <input
                    id="team-password"
                    type="password"
                    autoComplete="new-password"
                    value={addForm.data.password}
                    onChange={(e) => addForm.setData('password', e.target.value)}
                    required
                    className={inputClassName}
                  />
                  {errorMessage(addForm.errors.password) && (
                    <p role="alert" className="mt-1 text-sm text-red-600">
                      {errorMessage(addForm.errors.password)}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="team-password-confirmation"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Confirmar contraseña
                  </label>
                  <input
                    id="team-password-confirmation"
                    type="password"
                    autoComplete="new-password"
                    value={addForm.data.password_confirmation}
                    onChange={(e) => addForm.setData('password_confirmation', e.target.value)}
                    required
                    className={inputClassName}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="team-role" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Rol
                  </label>
                  <select
                    id="team-role"
                    value={addForm.data.role}
                    onChange={(e) =>
                      addForm.setData('role', e.target.value as 'employee' | 'admin')
                    }
                    className={inputClassName}
                  >
                    <option value="employee">Empleada</option>
                    {isOwner && <option value="admin">Administrador</option>}
                  </select>
                </div>

                {addForm.data.role === 'admin' && isOwner && (
                  <div>
                    <label
                      htmlFor="team-current-password"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Tu contraseña actual
                    </label>
                    <input
                      id="team-current-password"
                      type="password"
                      autoComplete="current-password"
                      value={addForm.data.current_password}
                      onChange={(e) => addForm.setData('current_password', e.target.value)}
                      required
                      className={inputClassName}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    addForm.reset()
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={addForm.processing}
                  className="rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
                >
                  Agregar
                </button>
              </div>
            </form>
          </section>
        )}

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {members.length === 0 ? (
            <p className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
              No hay miembros en el equipo
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <th scope="col" className="px-6 py-3">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Rol
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {members.map((member) => {
                  const isOwnerRow = member.role === 'owner'

                  return (
                    <tr key={member.id} className="text-sm">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                        {member.name}
                        {member.id === current_user_id && (
                          <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">
                            (vos)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {member.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className={roleBadgeClass(member.role)}>
                          {roleLabels[member.role]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isOwnerRow ? (
                          <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openRoleChangeDialog(member)}
                              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                              <UserCog className="h-3.5 w-3.5" aria-hidden="true" />
                              Cambiar rol
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(member)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-slate-600 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950/30"
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </Layout>

      <RoleChangeDialog
        isOpen={roleChangeTarget !== null}
        member={roleChangeTarget}
        selectedRole={selectedRole}
        currentPassword={roleChangePassword}
        canAssignAdmin={isOwner}
        onClose={closeRoleChangeDialog}
        onRoleChange={setSelectedRole}
        onPasswordChange={setRoleChangePassword}
        onConfirm={confirmRoleChange}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Eliminar del equipo"
        message={
          deleteTarget
            ? `¿Eliminar a ${deleteTarget.name} del equipo? Perderá acceso al salón.`
            : ''
        }
        confirmLabel="Eliminar"
      />

      <Toast />
    </>
  )
}