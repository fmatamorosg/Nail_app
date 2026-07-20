class Appointment < ApplicationRecord
  belongs_to :client
  belongs_to :service

  enum :status, { confirmed: "confirmed", completed: "completed", cancelled: "cancelled" }

  before_validation :assign_default_status, on: :create

  validate :no_overlapping_appointments

  scope :today, -> { where(scheduled_at: Date.current.all_day) }
  scope :this_month, -> { where(scheduled_at: Date.current.beginning_of_month..Date.current.end_of_month) }
  scope :this_week, -> { where(scheduled_at: Date.current.beginning_of_week..Date.current.end_of_week) }

  private

  def assign_default_status
    self.status = "confirmed" if status.blank?
  end

  def no_overlapping_appointments
    return unless scheduled_at.present? && service.present?
    return unless new_record? || scheduled_at_changed?

    new_start = scheduled_at
    new_end = scheduled_at + service.duration_minutes.minutes

    overlapping = Appointment
                    .where.not(id: id)
                    .joins(:service)
                    .where.not(status: "cancelled")
                    .where(
                      "appointments.scheduled_at < ? AND (appointments.scheduled_at + (services.duration_minutes * interval '1 minute')) > ?",
                      new_end, new_start
                    )

    if overlapping.exists?
      errors.add(:scheduled_at, "ya hay otra cita agendada en ese horario, elegí otra hora")
    end
  end
end
