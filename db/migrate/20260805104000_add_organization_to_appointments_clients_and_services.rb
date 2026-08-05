class AddOrganizationToAppointmentsClientsAndServices < ActiveRecord::Migration[8.1]
  def up
    add_reference :appointments, :organization, foreign_key: true
    add_reference :clients, :organization, foreign_key: true
    add_reference :services, :organization, foreign_key: true

    organization_id = 1

    Appointment.update_all(organization_id: organization_id)
    Client.update_all(organization_id: organization_id)
    Service.update_all(organization_id: organization_id)

    change_column_null :appointments, :organization_id, false
    change_column_null :clients, :organization_id, false
    change_column_null :services, :organization_id, false
  end

  def down
    remove_reference :appointments, :organization, foreign_key: true
    remove_reference :clients, :organization, foreign_key: true
    remove_reference :services, :organization, foreign_key: true
  end
end
