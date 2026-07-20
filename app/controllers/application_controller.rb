class ApplicationController < ActionController::Base
  include Pagy::Backend

  before_action :authenticate_user!

  inertia_share do
    {
      flash: {
        notice: flash[:notice],
        alert: flash[:alert],
        id: (flash[:notice] || flash[:alert]) ? SecureRandom.hex(4) : nil
      },
      business_name: user_signed_in? ? current_user.business_name : nil
    }
  end
end
