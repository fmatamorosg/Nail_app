class StatisticsController < ApplicationController
  def index
    completed = Appointment.where(status: "completed").includes(:service)

    render inertia: "Statistics/Index", props: {
      stats: {
        revenue_month: revenue_for_month(Date.current),
        appointments_month: Appointment.where(scheduled_at: Date.current.beginning_of_month..Date.current.end_of_month).count,
        average_ticket: average_ticket,
        total_clients: Client.count
      },
      revenue_by_month: revenue_by_month,
      status_distribution: status_distribution,
      top_services: top_services
    }, as: :json
  end

  private

  def revenue_for_month(date)
    Appointment.where(status: "completed", scheduled_at: date.beginning_of_month..date.end_of_month)
               .joins(:service).sum("services.price").to_f
  end

  def revenue_by_month
    (0..5).map do |i|
      date = i.months.ago(Date.current)
      {
        month: date.strftime("%b"),
        revenue: revenue_for_month(date)
      }
    end.reverse
  end

  def status_distribution
    Appointment.group(:status).count.map { |status, count| { status: status, count: count } }
  end

  def average_ticket
    completed = Appointment.where(status: "completed").joins(:service)
    total = completed.sum("services.price").to_f
    count = completed.count
    count.zero? ? 0 : (total / count).round
  end

  def top_services
    Appointment.where(status: "completed")
               .joins(:service)
               .group("services.id", "services.name")
               .sum("services.price")
               .sort_by { |_key, revenue| -revenue }
               .first(5)
               .map { |(_id, name), revenue| { name: name, revenue: revenue.to_f } }
  end
end
