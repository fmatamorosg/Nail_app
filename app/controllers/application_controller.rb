class ApplicationController < ActionController::Base
  include Pagy::Backend
  include RoleAuthorization

  before_action :authenticate_user!

  inertia_share do
    {
      flash: {
        notice: flash[:notice],
        alert: flash[:alert],
        id: (flash[:notice] || flash[:alert]) ? SecureRandom.hex(4) : nil
      },
      business_name: user_signed_in? ? current_user.business_name : nil,
      user_role: user_signed_in? ? current_user.role : nil,
      user_name: user_signed_in? ? current_user.name : nil
    }
  end

  def after_sign_in_path_for(resource)
    stored_location_for(resource) || (resource.employee? ? appointments_path : root_path)
  end
end
