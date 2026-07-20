class AppointmentsController < ApplicationController
  def index
    scope = Appointment.includes(:client, :service).order(scheduled_at: :asc)

    if params[:status].present? && params[:status] != "all"
      scope = scope.where(status: params[:status])
    end

    if params[:search].present?
      term = "%#{params[:search]}%"
      scope = scope.joins(:client, :service)
                   .where("clients.name ILIKE :term OR services.name ILIKE :term", term: term)
    end

    if params[:from].present? && params[:to].present?
      from_date = Date.parse(params[:from])
      to_date = Date.parse(params[:to])
      scope = scope.where(scheduled_at: from_date.beginning_of_day..to_date.end_of_day)
    end

    pagy, appointments = pagy(scope, limit: 12)

    render inertia: "Appointments/Index", props: {
      appointments: appointments.map do |appt|
        {
          id: appt.id,
          client_id: appt.client_id,
          service_id: appt.service_id,
          scheduled_at: appt.scheduled_at.iso8601,
          client_name: appt.client.name,
          date: appt.scheduled_at.strftime("%d %b %Y"),
          time: appt.scheduled_at.strftime("%H:%M"),
          service_name: appt.service.name,
          status: appt.status
        }
      end,
      stats: {
        total_week: Appointment.where(scheduled_at: Date.current.beginning_of_week..Date.current.end_of_week).count,
        confirmed: Appointment.where(status: "confirmed").count,
        cancelled: Appointment.where(status: "cancelled").count,
        completed: Appointment.where(status: "completed").count
      },
      filters: {
        status: params[:status] || "all",
        search: params[:search] || "",
        from: params[:from],
        to: params[:to]
      },
      pagination: {
        page: pagy.page,
        pages: pagy.pages,
        count: pagy.count
      },
      clients: Client.order(:name).select(:id, :name).map { |c| { id: c.id, name: c.name } },
      services: Service.order(:name).select(:id, :name, :duration_minutes, :price).map { |s| { id: s.id, name: s.name, duration_minutes: s.duration_minutes, price: s.price.to_f } }
    }, as: :json
  end

  def create
    appointment = Appointment.new(appointment_params)
    if appointment.save
      redirect_to appointments_path, notice: "Cita creada correctamente"
    else
      redirect_to appointments_path, inertia: { errors: appointment.errors }
    end
  end

  def update
    appointment = Appointment.find(params[:id])
    if appointment.update(appointment_params)
      redirect_to appointments_path, notice: "Cita actualizada correctamente"
    else
      redirect_to appointments_path, inertia: { errors: appointment.errors }
    end
  end

  def destroy
    appointment = Appointment.find(params[:id])
    appointment.destroy
    redirect_to appointments_path, notice: "Cita eliminada correctamente"
  end

  private

  def appointment_params
    params.require(:appointment).permit(:client_id, :service_id, :scheduled_at, :status)
  end
end
