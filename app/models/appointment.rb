class Appointment < ApplicationRecord
  belongs_to :client
  belongs_to :service

  enum :status, { pending: "pending", confirmed: "confirmed", completed: "completed", cancelled: "cancelled" }

  scope :today, -> { where(scheduled_at: Date.current.all_day) }
  scope :this_month, -> { where(scheduled_at: Date.current.beginning_of_month..Date.current.end_of_month) }
  scope :this_week, -> { where(scheduled_at: Date.current.beginning_of_week..Date.current.end_of_week) }
end