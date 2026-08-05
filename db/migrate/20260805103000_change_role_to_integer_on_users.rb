class ChangeRoleToIntegerOnUsers < ActiveRecord::Migration[8.1]
  def up
    add_column :users, :role_integer, :integer, default: 0, null: false

    execute <<~SQL.squish
      UPDATE users
      SET role_integer = CASE role
        WHEN 'admin' THEN 1
        WHEN 'owner' THEN 2
        ELSE 0
      END
    SQL

    remove_column :users, :role
    rename_column :users, :role_integer, :role
  end

  def down
    add_column :users, :role_string, :string

    execute <<~SQL.squish
      UPDATE users
      SET role_string = CASE role
        WHEN 1 THEN 'admin'
        WHEN 2 THEN 'owner'
        ELSE 'employee'
      END
    SQL

    remove_column :users, :role
    rename_column :users, :role_string, :role
  end
end
