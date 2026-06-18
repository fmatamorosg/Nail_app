Rails.application.routes.draw do
  root "dashboard#index"

  resources :appointments
  resources :clients
  resources :services

  get "up" => "rails/health#show", as: :rails_health_check
end