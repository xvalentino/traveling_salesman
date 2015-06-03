Rails.application.routes.draw do
  get '/feed', to: 'pages#feed'

  root 'pages#home'
end
