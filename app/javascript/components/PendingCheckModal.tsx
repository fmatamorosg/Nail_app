import { type PendingCheck } from '@/types/appointment'
import { AlertTriangle } from 'lucide-react'
import { useEffect, useId, useState } from 'react'

function formatTime(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function csrfToken(): string {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? ''
}

export default function PendingCheckModal() {
  const titleId = useId()
  const [pendingChecks, setPendingChecks] = useState<PendingCheck[]>([])

  useEffect(() => {
    let cancelled = false

    function loadPendingChecks() {
      fetch('/pending_checks')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load pending checks')
          return res.json()
        })
        .then((data: PendingCheck[]) => {
          if (cancelled) return
          setPendingChecks(data)
        })
        .catch(() => {
          if (cancelled) return
          setPendingChecks([])
        })
    }

    loadPendingChecks()
    const intervalId = setInterval(loadPendingChecks, 60_000)

    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [])

  const current = pendingChecks[0]
  if (!current) return null

  const time = formatTime(current.scheduled_at)

  function handleResponse(attended: boolean) {
    fetch(`/pending_checks/${current.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRF-Token': csrfToken(),
      },
      body: JSON.stringify({ attended }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update pending check')
        setPendingChecks((prev) => prev.filter((item) => item.id !== current.id))
      })
      .catch(() => {})
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
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <h2 id={titleId} className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Confirmar asistencia
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            ¿{current.client_name} llegó a la cita de {current.service_name} a las {time}?
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => handleResponse(false)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            No llegó
          </button>
          <button
            type="button"
            onClick={() => handleResponse(true)}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Sí llegó
          </button>
        </div>
      </div>
    </div>
  )
}
