import { usePage } from '@inertiajs/react'
import { CheckCircle, X, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface FlashProps {
  flash?: {
    notice?: string | null
    alert?: string | null
    id?: string | null
  }
}

function ToastContent({
  message,
  variant,
}: {
  message: string
  variant: 'success' | 'error'
}) {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDismissed(true), 4000)
    return () => clearTimeout(timer)
  }, [])

  if (dismissed) return null

  const isSuccess = variant === 'success'

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg ${
        isSuccess
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/90 dark:text-emerald-200'
          : 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/90 dark:text-red-200'
      }`}
      role="alert"
    >
      {isSuccess ? (
        <CheckCircle className="h-5 w-5 shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 shrink-0" />
      )}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Cerrar notificación"
        className="shrink-0 opacity-70 hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export default function Toast() {
  const { props } = usePage<FlashProps>()
  const notice = props.flash?.notice
  const alert = props.flash?.alert

  if (notice) {
    return <ToastContent key={`notice-${props.flash?.id}`} message={notice} variant="success" />
  }

  if (alert) {
    return <ToastContent key={`alert-${props.flash?.id}`} message={alert} variant="error" />
  }

  return null
}
