class ClientsController < ApplicationController
  def index
    scope = Client.order(:name)

    if params[:search].present?
      term = "%#{params[:search]}%"
      scope = scope.where("name ILIKE :term OR phone ILIKE :term", term: term)
    end

    clients = scope.map { |client| client_json(client) }

    render inertia: "Clients/Index", props: {
      clients: clients,
      stats: {
        total: Client.count,
        vip_count: Client.where(vip: true).count
      },
      filters: {
        search: params[:search] || ""
      },
      services: Service.order(:name).select(:id, :name, :duration_minutes, :price).map { |s| { id: s.id, name: s.name, duration_minutes: s.duration_minutes, price: s.price.to_f } }
    }, as: :json
  end

  def create
    client = Client.new(client_params)
    if client.save
      redirect_to clients_path, notice: "Cliente creado correctamente"
    else
      redirect_to clients_path, inertia: { errors: client.errors }
    end
  end

  def update
    client = Client.find(params[:id])
    if client.update(client_params)
      redirect_to clients_path, notice: "Cliente actualizado correctamente"
    else
      redirect_to clients_path, inertia: { errors: client.errors }
    end
  end

  def destroy
    client = Client.find(params[:id])

    if client.appointments.exists?
      redirect_to clients_path, alert: "No se puede eliminar a #{client.name} porque tiene citas registradas. Elimina o reasigna sus citas primero."
    else
      client.destroy
      redirect_to clients_path, notice: "Cliente eliminado correctamente"
    end
  end

  private

  def client_json(client)
    completed = client.appointments.completed

    {
      id: client.id,
      name: client.name,
      phone: client.phone,
      instagram_handle: client.instagram_handle,
      vip: client.vip || false,
      last_visit: client.appointments.maximum(:scheduled_at)&.strftime("%d %b %Y") || "Sin visitas",
      visit_count: completed.count,
      total_spent: completed.joins(:service).sum("services.price"),
      favorite_service: favorite_service_for(client),
      appointment_history: client.appointments.includes(:service).order(scheduled_at: :desc).limit(5).map do |appt|
        {
          id: appt.id,
          service_name: appt.service.name,
          date: appt.scheduled_at.strftime("%d %b %Y"),
          status: appt.status
        }
      end
    }
  end

  def favorite_service_for(client)
    result = client.appointments.joins(:service)
                    .group("services.name")
                    .order(Arel.sql("COUNT(appointments.id) DESC"))
                    .limit(1)
                    .count
    result.keys.first
  end

  def client_params
    params.require(:client).permit(:name, :phone, :instagram_handle, :vip)
  end
end
