class ApplicationController < ActionController::Base
  include Pagy::Backend

  before_action :authenticate_user!

  inertia_share do
    {
      flash: {
        notice: flash[:notice],
        alert: flash[:alert],
        id: (flash[:notice] || flash[:alert]) ? SecureRandom.hex(4) : nil
      }
    }
  end
end
