class DashboardController < ApplicationController
  def index
    today = Date.current

    today_appointments_scope = Appointment.where(scheduled_at: today.all_day)

    render inertia: "Dashboard/Index", props: {
      user_name: current_user.name,
      today_date: I18n.l(today, format: "%A, %d de %B de %Y"),
      stats: {
        appointments_today: today_appointments_scope.count,
        revenue_month: Appointment.where(scheduled_at: today.beginning_of_month..today.end_of_month, status: "completed")
                                   .joins(:service).sum("services.price"),
        new_clients_month: Client.where(created_at: today.beginning_of_month..today.end_of_month).count,
        pending_confirmations: Appointment.where(status: "pending").count
      },
      today_appointments: today_appointments_scope.includes(:client, :service).order(:scheduled_at).map do |appt|
        {
          id: appt.id,
          client_name: appt.client.name,
          time: appt.scheduled_at.strftime("%H:%M"),
          service_name: appt.service.name,
          status: appt.status
        }
      end,
      recent_clients: Client.order(created_at: :desc).limit(5).map do |client|
        completed = client.appointments.where(status: "completed")
        {
          id: client.id,
          name: client.name,
          last_visit: client.appointments.maximum(:scheduled_at)&.strftime("%d/%m/%Y") || "Sin visitas",
          total_spent: completed.joins(:service).sum("services.price"),
          visit_count: completed.count
        }
      end,
      popular_services: Service.left_joins(:appointments)
        .group("services.id")
        .order(Arel.sql("COUNT(appointments.id) DESC"))
        .limit(5)
        .map do |service|
          {
            id: service.id,
            name: service.name,
            appointment_count: service.appointments.count
          }
        end
    }, as: :json
  end
end