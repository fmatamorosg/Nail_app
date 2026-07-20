import { Bell } from 'lucide-react'
import { router } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'

type PendingAppointment = {
  id: number
  client_name: string
  service_name: string
  date: string
  time: string
}

export default function NotificationBell() {
  const [count, setCount] = useState(0)
  const [appointments, setAppointments] = useState<PendingAppointment[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false

    fetch('/notifications/pending')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load notifications')
        return res.json()
      })
      .then((data: { count: number; appointments: PendingAppointment[] }) => {
        if (cancelled) return
        setCount(data.count)
        setAppointments(data.appointments)
      })
      .catch(() => {
        if (cancelled) return
        setCount(0)
        setAppointments([])
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!dropdownOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  const badgeLabel = count > 9 ? '9+' : String(count)

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Notificaciones"
        aria-expanded={dropdownOpen}
        onClick={() => setDropdownOpen((open) => !open)}
        className="relative rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span
            key={count}
            style={{ animationIterationCount: 1 }}
            className="absolute -right-1 -top-1 flex h-5 min-w-5 animate-bounce items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-bold text-white"
          >
            {badgeLabel}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-200 p-4 font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100">
            Citas de hoy
          </div>
          {appointments.length === 0 ? (
            <p className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
              No tienes más citas confirmadas para hoy
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {appointments.map((appt, index) => (
                <li
                  key={appt.id}
                  onClick={() => {
                    setDropdownOpen(false)
                    router.visit(`/appointments?edit=${appt.id}`)
                  }}
                  className={`cursor-pointer p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${
                    index < appointments.length - 1
                      ? 'border-b border-slate-200 dark:border-slate-700'
                      : ''
                  }`}
                >
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {appt.client_name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {appt.service_name}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {appt.date} · {appt.time}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
