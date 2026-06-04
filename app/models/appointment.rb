class Appointment < ApplicationRecord
  belongs_to :client
  belongs_to :service
  
  enum :status, { pending: "pending", confirmed: "confirmed", completed: "completed", cancelled: "cancelled" }
end