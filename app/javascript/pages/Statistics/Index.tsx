import NotificationBell from '@/components/NotificationBell'
import Sidebar from '@/components/Sidebar'
import StatCard from '@/components/StatCard'
import { useDarkMode } from '@/hooks/useDarkMode'
import { formatCurrency } from '@/lib/format-currency'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Calendar, DollarSign, TrendingUp, Users } from 'lucide-react'
import type { ReactNode } from 'react'

interface StatisticsProps {
  stats: {
    revenue_month: number
    appointments_month: number
    average_ticket: number
    total_clients: number
  }
  revenue_by_month: { month: string; revenue: number }[]
  status_distribution: { status: string; count: number }[]
  top_services: { name: string; revenue: number }[]
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  completed: '#10B981',
  cancelled: '#94A3B8',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

function ChartCard({
  title,
  children,
  className = '',
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-800 ${className}`}
    >
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h2>
      {children}
    </div>
  )
}

function EmptyChartMessage() {
  return (
    <p className="flex min-h-[240px] items-center justify-center text-sm text-slate-500 dark:text-slate-400">
      No hay datos suficientes todavía
    </p>
  )
}

export default function Index({
  stats,
  revenue_by_month,
  status_distribution,
  top_services,
}: StatisticsProps) {
  const { isDark } = useDarkMode()

  const axisColor = isDark ? '#94a3b8' : '#64748b'
  const gridColor = isDark ? '#334155' : '#e2e8f0'
  const tooltipBg = isDark ? '#1e293b' : '#ffffff'
  const tooltipBorder = isDark ? '#475569' : '#e2e8f0'

  const hasRevenueData = revenue_by_month.some((row) => row.revenue > 0)
  const hasStatusData = status_distribution.some((row) => row.count > 0)
  const hasTopServices = top_services.length > 0

  const statCards = [
    {
      label: 'Ingresos del mes',
      value: formatCurrency(stats.revenue_month),
      icon: DollarSign,
      iconBg: 'bg-pink-100 dark:bg-pink-900/40',
      iconColor: 'text-pink-600 dark:text-pink-400',
    },
    {
      label: 'Citas del mes',
      value: stats.appointments_month.toString(),
      icon: Calendar,
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Ticket promedio',
      value: formatCurrency(stats.average_ticket),
      icon: TrendingUp,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Total clientes',
      value: stats.total_clients.toString(),
      icon: Users,
      iconBg: 'bg-violet-100 dark:bg-violet-900/40',
      iconColor: 'text-violet-600 dark:text-violet-400',
    },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar active="Estadísticas" userName="Yeri" />

      <main className="ml-64 flex-1 p-8">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Estadísticas
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Resumen del rendimiento del salón
            </p>
          </div>
          <NotificationBell />
        </header>

        <div className="grid grid-cols-4 gap-6">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}

          <ChartCard title="Ingresos por mes" className="col-span-3">
            {hasRevenueData ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenue_by_month} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: axisColor, fontSize: 12 }}
                    axisLine={{ stroke: gridColor }}
                    tickLine={{ stroke: gridColor }}
                  />
                  <YAxis
                    tick={{ fill: axisColor, fontSize: 12 }}
                    axisLine={{ stroke: gridColor }}
                    tickLine={{ stroke: gridColor }}
                    tickFormatter={(value: number) => formatCurrency(value)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      borderColor: tooltipBorder,
                      borderRadius: '0.75rem',
                      color: isDark ? '#f1f5f9' : '#0f172a',
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Ingresos']}
                  />
                  <Bar dataKey="revenue" fill="#EC4899" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartMessage />
            )}
          </ChartCard>

          <ChartCard title="Citas por estado" className="col-span-1">
            {hasStatusData ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={status_distribution}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {status_distribution.map((entry) => (
                        <Cell
                          key={entry.status}
                          fill={STATUS_COLORS[entry.status] ?? '#94A3B8'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        borderColor: tooltipBorder,
                        borderRadius: '0.75rem',
                        color: isDark ? '#f1f5f9' : '#0f172a',
                      }}
                      formatter={(value: number, _name, item) => [
                        value,
                        STATUS_LABELS[String(item.payload.status)] ?? item.payload.status,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <ul className="mt-4 space-y-2">
                  {status_distribution.map((entry) => (
                    <li
                      key={entry.status}
                      className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              STATUS_COLORS[entry.status] ?? '#94A3B8',
                          }}
                        />
                        {STATUS_LABELS[entry.status] ?? entry.status}
                      </span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {entry.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <EmptyChartMessage />
            )}
          </ChartCard>

          <ChartCard title="Top 5 servicios por ingresos" className="col-span-2">
            {hasTopServices ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  layout="vertical"
                  data={top_services}
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: axisColor, fontSize: 12 }}
                    axisLine={{ stroke: gridColor }}
                    tickLine={{ stroke: gridColor }}
                    tickFormatter={(value: number) => formatCurrency(value)}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fill: axisColor, fontSize: 12 }}
                    axisLine={{ stroke: gridColor }}
                    tickLine={{ stroke: gridColor }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      borderColor: tooltipBorder,
                      borderRadius: '0.75rem',
                      color: isDark ? '#f1f5f9' : '#0f172a',
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Ingresos']}
                  />
                  <Bar dataKey="revenue" fill="#8B5CF6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartMessage />
            )}
          </ChartCard>
        </div>
      </main>
    </div>
  )
}
