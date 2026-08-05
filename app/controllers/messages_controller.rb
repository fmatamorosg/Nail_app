class MessagesController < ApplicationController
  before_action :require_manager!

  def index
    render inertia: "Messages/Index", as: :json
  end
end
