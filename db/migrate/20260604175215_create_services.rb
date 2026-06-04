class CreateServices < ActiveRecord::Migration[8.1]
  def change
    create_table :services do |t|
      t.string :name
      t.integer :duration_minutes
      t.decimal :price
      t.text :description
      t.boolean :active

      t.timestamps
    end
  end
end
