class SettingsController < ApplicationController
  def index
    render inertia: "Settings/Index", props: {
      business: {
        name: current_user.business_name,
        phone: current_user.business_phone,
        address: current_user.business_address
      },
      user_email: current_user.email
    }, as: :json
  end

  def update_business
    if current_user.update(business_params)
      redirect_to settings_path, notice: "Datos del salón actualizados correctamente"
    else
      redirect_to settings_path, inertia: { errors: current_user.errors }
    end
  end

  def update_password
    if current_user.valid_password?(params[:current_password])
      if params[:new_password] != params[:new_password_confirmation]
        redirect_to settings_path, alert: "Las contraseñas nuevas no coinciden"
      elsif current_user.update(password: params[:new_password], password_confirmation: params[:new_password_confirmation])
        redirect_to settings_path, notice: "Contraseña actualizada correctamente"
      else
        redirect_to settings_path, inertia: { errors: current_user.errors }
      end
    else
      redirect_to settings_path, alert: "La contraseña actual no es correcta"
    end
  end

  private

  def business_params
    params.require(:user).permit(:business_name, :business_phone, :business_address)
  end
end
