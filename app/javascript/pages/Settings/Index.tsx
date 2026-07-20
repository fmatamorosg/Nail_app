import NotificationBell from '@/components/NotificationBell'
import Sidebar from '@/components/Sidebar'
import Toast from '@/components/Toast'
import { useForm } from '@inertiajs/react'
import { type FormEvent } from 'react'

interface SettingsProps {
  business: {
    name: string | null
    phone: string | null
    address: string | null
  }
  user_email: string
}

const inputClassName =
  'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100'

function errorMessage(error: string | string[] | undefined): string | null {
  if (!error) return null
  return Array.isArray(error) ? error[0] : error
}

export default function Index({ business, user_email }: SettingsProps) {
  const businessForm = useForm({
    name: business.name ?? '',
    phone: business.phone ?? '',
    address: business.address ?? '',
  })

  const passwordForm = useForm({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  })

  function handleBusinessSubmit(event: FormEvent) {
    event.preventDefault()

    businessForm.transform((data) => ({
      user: {
        business_name: data.name,
        business_phone: data.phone,
        business_address: data.address,
      },
    }))

    businessForm.patch('/settings/business', { preserveScroll: true })
  }

  function handlePasswordSubmit(event: FormEvent) {
    event.preventDefault()

    passwordForm.patch('/settings/password', {
      preserveScroll: true,
      onSuccess: () => {
        passwordForm.reset()
      },
    })
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar active="Configuración" userName="Yeri" />

      <main className="ml-64 flex-1 p-8">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Configuración
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Datos del salón y seguridad de la cuenta
            </p>
          </div>
          <NotificationBell />
        </header>

        <div className="max-w-2xl space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Datos del salón
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Cuenta: {user_email}
            </p>

            <form onSubmit={handleBusinessSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="business-name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Nombre del salón
                </label>
                <input
                  id="business-name"
                  type="text"
                  value={businessForm.data.name}
                  onChange={(e) => businessForm.setData('name', e.target.value)}
                  className={inputClassName}
                />
                {errorMessage(businessForm.errors.business_name) && (
                  <p role="alert" className="mt-1 text-sm text-red-600">
                    {errorMessage(businessForm.errors.business_name)}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="business-phone"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Teléfono del salón
                </label>
                <input
                  id="business-phone"
                  type="text"
                  value={businessForm.data.phone}
                  onChange={(e) => businessForm.setData('phone', e.target.value)}
                  className={inputClassName}
                />
                {errorMessage(businessForm.errors.business_phone) && (
                  <p role="alert" className="mt-1 text-sm text-red-600">
                    {errorMessage(businessForm.errors.business_phone)}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="business-address"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Dirección
                </label>
                <input
                  id="business-address"
                  type="text"
                  value={businessForm.data.address}
                  onChange={(e) => businessForm.setData('address', e.target.value)}
                  className={inputClassName}
                />
                {errorMessage(businessForm.errors.business_address) && (
                  <p role="alert" className="mt-1 text-sm text-red-600">
                    {errorMessage(businessForm.errors.business_address)}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={businessForm.processing}
                  className="rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Cambiar contraseña
            </h2>

            <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="current-password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Contraseña actual
                </label>
                <input
                  id="current-password"
                  type="password"
                  autoComplete="current-password"
                  value={passwordForm.data.current_password}
                  onChange={(e) =>
                    passwordForm.setData('current_password', e.target.value)
                  }
                  className={inputClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Nueva contraseña
                </label>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={passwordForm.data.new_password}
                  onChange={(e) =>
                    passwordForm.setData('new_password', e.target.value)
                  }
                  className={inputClassName}
                />
                {errorMessage(passwordForm.errors.password) && (
                  <p role="alert" className="mt-1 text-sm text-red-600">
                    {errorMessage(passwordForm.errors.password)}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="new-password-confirmation"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Confirmar nueva contraseña
                </label>
                <input
                  id="new-password-confirmation"
                  type="password"
                  autoComplete="new-password"
                  value={passwordForm.data.new_password_confirmation}
                  onChange={(e) =>
                    passwordForm.setData('new_password_confirmation', e.target.value)
                  }
                  className={inputClassName}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordForm.processing}
                  className="rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
                >
                  Actualizar contraseña
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>

      <Toast />
    </div>
  )
}
