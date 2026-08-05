class PendingChecksController < ApplicationController
  def index
    appointments = current_user.organization.appointments
                     .includes(:client, :service)
                     .pending_attendance_check
                     .order(:scheduled_at)

    render json: appointments.map { |a|
      {
        id: a.id,
        client_name: a.client.name,
        service_name: a.service.name,
        scheduled_at: a.scheduled_at.iso8601
      }
    }
  end

  def update
    appointment = current_user.organization.appointments.find(params[:id])
    attended = ActiveModel::Type::Boolean.new.cast(params[:attended])
    new_status = attended ? "completed" : "absent"

    if appointment.update(status: new_status)
      render json: { success: true, status: appointment.status }
    else
      render json: { success: false, errors: appointment.errors }, status: :unprocessable_entity
    end
  end
end
