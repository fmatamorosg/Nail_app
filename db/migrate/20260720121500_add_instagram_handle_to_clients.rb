class AddInstagramHandleToClients < ActiveRecord::Migration[8.1]
  def change
    add_column :clients, :instagram_handle, :string
  end
end
