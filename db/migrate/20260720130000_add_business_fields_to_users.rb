class AddBusinessFieldsToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :business_name, :string
    add_column :users, :business_phone, :string
    add_column :users, :business_address, :string
  end
end
