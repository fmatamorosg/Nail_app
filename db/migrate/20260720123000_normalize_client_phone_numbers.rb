class NormalizeClientPhoneNumbers < ActiveRecord::Migration[8.1]
  def up
    Client.find_each do |client|
      next if client.phone.blank?

      normalized = client.phone.gsub(/\D/, "")
      client.update_column(:phone, normalized) if normalized != client.phone
    end
  end

  def down
    # irreversible: original formatting is not stored
  end
end
