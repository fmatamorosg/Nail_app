class NotificationsController < ApplicationController
  def pending
    appointments = Appointment.includes(:client, :service)
                              .where(status: "pending")
                              .order(scheduled_at: :asc)
                              .limit(10)

    render json: {
      count: Appointment.where(status: "pending").count,
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
