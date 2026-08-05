class Organization < ApplicationRecord
  has_many :users
  has_many :appointments
  has_many :clients
  has_many :services

  validates :name, presence: true
end
