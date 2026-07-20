class NotificationsController < ApplicationController
  def pending
    today_start = Date.current.beginning_of_day
    today_end = Date.current.end_of_day

    appointments = Appointment.includes(:client, :service)
                              .where(status: "confirmed", scheduled_at: today_start..today_end)
                              .order(scheduled_at: :asc)
                              .limit(10)

    render json: {
      count: Appointment.where(status: "confirmed", scheduled_at: today_start..today_end).count,
      appointments: appointments.map do |appt|
        {
          id: appt.id,
          client_name: appt.client.name,
          service_name: appt.service.name,
          date: appt.scheduled_at.strftime("%d %b %Y"),
          time: appt.scheduled_at.strftime("%H:%M")
        }
      end
    }
  end
end
