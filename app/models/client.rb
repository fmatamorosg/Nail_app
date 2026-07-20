class Client < ApplicationRecord
  has_many :appointments

  before_validation :normalize_phone

  validates :name, presence: true, uniqueness: { case_sensitive: false, message: "ya existe un cliente con este nombre" }
  validates :phone, presence: true, uniqueness: { message: "ya existe un cliente con este número de teléfono" }

  private

  def normalize_phone
    self.phone = phone.gsub(/\D/, "") if phone.present?
  end
end
