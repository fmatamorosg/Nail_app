class UpdatePendingAppointmentsToConfirmed < ActiveRecord::Migration[8.1]
  def up
    execute <<~SQL.squish
      UPDATE appointments SET status = 'confirmed' WHERE status = 'pending'
    SQL

    change_column_default :appointments, :status, from: nil, to: "confirmed"
  end

  def down
    change_column_default :appointments, :status, from: "confirmed", to: nil
  end
end
