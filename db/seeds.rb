user = User.find_or_create_by!(email: "yeri@nailapp.com") do |u|
  u.name = "Yeri"
  u.password = "password123"
  u.role = "admin"
end

services_data = [
  { name: "Manicura clásica", price: 8000, duration_minutes: 30 },
  { name: "Manicura francesa", price: 10000, duration_minutes: 45 },
  { name: "Uñas en gel", price: 15000, duration_minutes: 60 },
  { name: "Pedicura spa", price: 12000, duration_minutes: 50 },
  { name: "Nail art diseño", price: 18000, duration_minutes: 75 },
  { name: "Acrílico completo", price: 20000, duration_minutes: 90 }
]

services = services_data.map do |data|
  Service.find_or_create_by!(name: data[:name]) do |s|
    s.price = data[:price]
    s.duration_minutes = data[:duration_minutes]
    s.active = true
  end
end

clients_data = [
  { name: "Sofía Ramírez", phone: "8888-1111", email: "sofia@example.com" },
  { name: "Camila Torres", phone: "8888-2222", email: "camila@example.com" },
  { name: "Valeria Méndez", phone: "8888-3333", email: "valeria@example.com" },
  { name: "Isabella Cruz", phone: "8888-4444", email: "isabella@example.com" },
  { name: "Daniela Flores", phone: "8888-5555", email: "daniela@example.com" },
  { name: "Lucía Vega", phone: "8888-6666", email: "lucia@example.com" },
  { name: "Andrea Soto", phone: "8888-7777", email: "andrea@example.com" }
]

clients = clients_data.map do |data|
  Client.find_or_create_by!(email: data[:email]) do |c|
    c.name = data[:name]
    c.phone = data[:phone]
    c.vip = false
  end
end

today = Date.current

appointments_today = [
  { client: clients[0], service: services[1], hour: 9,  min: 0,  status: "confirmed" },
  { client: clients[1], service: services[2], hour: 10, min: 30, status: "completed" },
  { client: clients[2], service: services[3], hour: 11, min: 0,  status: "pending" },
  { client: clients[3], service: services[4], hour: 12, min: 30, status: "confirmed" },
  { client: clients[4], service: services[5], hour: 14, min: 0,  status: "pending" },
  { client: clients[5], service: services[0], hour: 15, min: 30, status: "confirmed" },
  { client: clients[6], service: services[2], hour: 17, min: 0,  status: "pending" }
]

appointments_today.each do |data|
  Appointment.find_or_create_by!(
    client: data[:client],
    service: data[:service],
    scheduled_at: today.to_time.change(hour: data[:hour], min: data[:min])
  ) do |a|
    a.status = data[:status]
  end
end

# Citas completadas en semanas anteriores, para que "Clientes recientes" tenga historial
[7, 14, 21].each_with_index do |days_ago, i|
  Appointment.find_or_create_by!(
    client: clients[i],
    service: services[i % services.size],
    scheduled_at: (today - days_ago.days).to_time.change(hour: 10)
  ) do |a|
    a.status = "completed"
  end
end

puts "Seed completado: #{User.count} usuarios, #{Client.count} clientas, #{Service.count} servicios, #{Appointment.count} citas"
