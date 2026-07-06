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
        pending: Appointment.where(status: "pending").count,
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
      }
    }, as: :json
  end

  def show
  end

  def new
  end

  def create
  end

  def edit
  end

  def update
  end

  def destroy
  end
end