module RoleAuthorization
  extend ActiveSupport::Concern

  private

  def require_manager!
    return if current_user.owner? || current_user.admin?

    redirect_to appointments_path, alert: "No tenés permiso para acceder a esta sección"
  end

  def require_owner!
    return if current_user.owner?

    redirect_to settings_path, alert: "No tenés permiso para realizar esta acción"
  end

  def forbid_employee_appointment_mutations!
    return unless current_user.employee?

    redirect_to appointments_path, alert: "No tenés permiso para modificar citas"
  end

  def redirect_employees_from_dashboard!
    return unless current_user.employee?

    redirect_to appointments_path, alert: "No tenés permiso para acceder a esta sección"
  end
end
