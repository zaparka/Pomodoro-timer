require 'rubygems'
require 'sinatra'
require 'haml'
require 'erb'
#require 'sass'
require 'dm-core'
require 'dm-validations'
require 'dm-aggregates'
#require 'dm-more'
require 'fileutils'
require 'task'

DataMapper::setup(:default, {
  :adapter  => "mysql",
  :database => "pomodoro",
  :username => "root",
  :password => "",
  :host     => "localhost"
})

get '/' do
  erb :pomodoro
end

post '/tasks' do
  Task.create(params)
end

get '/tasks' do
  @tasks = Task.all
  erb :index
end

get '/tasks/:id' do
  @task = Task.get( params[:id ] )
  erb :task
end

put '/tasks/:id' do
  @task = Task.get( params[:id] )

  if @task
    @task.update(:name => params[:name], :number_of_pomodoros => params[:number_of_pomodoros],  :number_of_interuptions => params[:number_of_interuptions])
  end

  erb :task
end

delete '/tasks/:id' do
  Task.get( params[:id] ).destroy
end

# Static files

get '/css/layout.css' do
  headers 'Content-Type' => 'text/css; charset=utf-8'
  File.read(File.join(File.dirname(__FILE__), 'css', 'layout.css' ))
end

get '/js/pmdr.js' do
  headers 'Content-Type' => 'text/javascript; charset=utf-8'
  File.read(File.join(File.dirname(__FILE__), 'js', 'pmdr.js' ))
end