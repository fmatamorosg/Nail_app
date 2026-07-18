class ServicesController < ApplicationController
  def index
    render inertia: "Services/Index", props: {
      services: services,
      stats: stats
    }, as: :json
  end

  def create
    service = Service.new(service_params)
    if service.save
      redirect_to services_path, notice: "Servicio creado correctamente"
    else
      redirect_to services_path, inertia: { errors: service.errors }
    end
  end

  def update
    service = Service.find(params[:id])
    if service.update(service_params)
      redirect_to services_path, notice: "Servicio actualizado correctamente"
    else
      redirect_to services_path, inertia: { errors: service.errors }
    end
  end

  def destroy
    service = Service.find(params[:id])
    service.destroy
    redirect_to services_path, notice: "Servicio eliminado correctamente"
  end

  private

  def services
    Service.left_joins(:appointments)
      .select("services.*, COUNT(appointments.id) AS appointment_count")
      .group("services.id")
      .order(:name)
      .map do |service|
        {
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price.to_f,
          duration_minutes: service.duration_minutes,
          active: service.active,
          appointment_count: service.appointment_count
        }
      end
  end

  def stats
    {
      total: Service.count,
      most_popular: most_popular_service_name,
      average_price: Service.average(:price).to_f.round,
      active_count: Service.where(active: true).count
    }
  end

  def most_popular_service_name
    result = Service.joins(:appointments)
                     .group(:name)
                     .order(Arel.sql("COUNT(appointments.id) DESC"))
                     .limit(1)
                     .count
    result.keys.first
  end

  def service_params
    params.require(:service).permit(:name, :description, :price, :duration_minutes, :active)
  end
end
