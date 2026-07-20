class DashboardController < ApplicationController
  def index
    render inertia: "Dashboard/Index", props: {
      user_name: current_user.name,
      today_date: I18n.l(Date.current, format: "%A, %d de %B de %Y"),
      stats: stats,
      today_appointments: today_appointments,
      recent_clients: recent_clients,
      popular_services: popular_services
    }, as: :json
  end

  private

  def stats
    {
      appointments_today: Appointment.today.count,
      revenue_month: Appointment.completed.this_month.joins(:service).sum("services.price"),
      new_clients_month: Client.where(created_at: Date.current.beginning_of_month..Date.current.end_of_month).count,
      cancelled_this_month: Appointment.where(
        status: "cancelled",
        scheduled_at: Date.current.beginning_of_month..Date.current.end_of_month
      ).count
    }
  end

  def today_appointments
    Appointment.today.includes(:client, :service).order(:scheduled_at).map do |appt|
      {
        id: appt.id,
        client_name: appt.client.name,
        time: appt.scheduled_at.strftime("%H:%M"),
        service_name: appt.service.name,
        status: appt.status
      }
    end
  end

  def recent_clients
    Client.order(created_at: :desc).limit(5).map do |client|
      completed = client.appointments.completed
      {
        id: client.id,
        name: client.name,
        instagram_handle: client.instagram_handle,
        last_visit: client.appointments.maximum(:scheduled_at)&.strftime("%d/%m/%Y") || "Sin visitas",
        total_spent: completed.joins(:service).sum("services.price"),
        visit_count: completed.count
      }
    end
  end

  def popular_services
    Service.left_joins(:appointments)
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
  end
end
