class Service < ApplicationRecord
  belongs_to :organization
  has_many :appointments
end
