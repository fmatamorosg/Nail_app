class MessagesController < ApplicationController
  def index
    render inertia: "Messages/Index", as: :json
  end
end
