class TeamController < ApplicationController
  ASSIGNABLE_ROLES = %w[employee admin].freeze

  before_action :require_admin_or_owner!

  def index
    render inertia: "Team/Index", props: {
      members: team_members_json,
      current_user_id: current_user.id
    }, as: :json
  end

  def create
    member = current_user.organization.users.build(create_params)
    member.role = :employee if member.role.blank?

    unless assignable_role?(member.role)
      redirect_to team_index_path, alert: "Rol no permitido"
      return
    end

    if assigning_admin_role?(member.role)
      unless current_user.owner?
        redirect_to team_index_path, alert: "Solo la dueña del salón puede asignar el rol de administrador"
        return
      end

      unless valid_current_password?
        redirect_to team_index_path, alert: "La contraseña actual no es correcta"
        return
      end
    end

    if member.save
      redirect_to team_index_path, notice: "Miembro del equipo agregado correctamente"
    else
      redirect_to team_index_path, inertia: { errors: member.errors }
    end
  end

  def update
    member = find_team_member
    role = update_role_param

    unless assignable_role?(role)
      redirect_to team_index_path, alert: "Rol no permitido"
      return
    end

    if assigning_admin_role?(role)
      unless current_user.owner?
        redirect_to team_index_path, alert: "Solo la dueña del salón puede asignar el rol de administrador"
        return
      end

      unless valid_current_password?
        redirect_to team_index_path, alert: "La contraseña actual no es correcta"
        return
      end
    end

    if member.update(role: role)
      redirect_to team_index_path, notice: "Rol actualizado correctamente"
    else
      redirect_to team_index_path, inertia: { errors: member.errors }
    end
  end

  def destroy
    member = find_team_member

    if member.owner?
      redirect_to team_index_path, alert: "No se puede eliminar a la persona dueña del salón"
      return
    end

    member.destroy
    redirect_to team_index_path, notice: "Miembro del equipo eliminado correctamente"
  end

  private

  def require_admin_or_owner!
    return if current_user.owner? || current_user.admin?

    redirect_to root_path, alert: "No tenés permiso para acceder a esta sección"
  end

  def find_team_member
    current_user.organization.users.find(params[:id])
  end

  def team_members_json
    current_user.organization.users.order(:name).map do |member|
      {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role
      }
    end
  end

  def create_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :role)
  end

  def update_role_param
    params.require(:user).permit(:role)[:role]
  end

  def assigning_admin_role?(role)
    role.to_s == "admin"
  end

  def assignable_role?(role)
    ASSIGNABLE_ROLES.include?(role.to_s)
  end

  def valid_current_password?
    current_user.valid_password?(params[:current_password].to_s)
  end
end
