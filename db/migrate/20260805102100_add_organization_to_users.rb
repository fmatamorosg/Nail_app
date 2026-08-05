class AddOrganizationToUsers < ActiveRecord::Migration[8.1]
  def up
    add_reference :users, :organization, foreign_key: true

    organization = Organization.create!(name: "Default")
    User.update_all(organization_id: organization.id)

    change_column_null :users, :organization_id, false
  end

  def down
    remove_reference :users, :organization, foreign_key: true
  end
end
