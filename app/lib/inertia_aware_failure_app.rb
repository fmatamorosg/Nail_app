class InertiaAwareFailureApp < Devise::FailureApp
  def respond
    if request.headers["X-Inertia"]
      redirect_to_inertia
    else
      super
    end
  end

  def redirect_to_inertia
    self.status = 409
    headers["X-Inertia-Location"] = redirect_url
    self.response_body = ""
  end
end
