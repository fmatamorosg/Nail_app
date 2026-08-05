class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  belongs_to :organization

  enum :role, { employee: 0, admin: 1, owner: 2 }

  validates :name, presence: true
end
