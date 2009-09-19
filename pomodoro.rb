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

post '/' do
  Task.create(params)   
end

get '/' do
  @tasks = Task.all
  erb :index
end

get '/:id' do
  @task = Task.get( params[:id ] )  
  erb :task
end

put '/:id' do
  @task = Task.get( params[:id] )
  
  if @task
    @task.update(:name => params[:name], :number_of_pomodoros => params[:number_of_pomodoros],  :number_of_interuptions => params[:number_of_interuptions])
  end
  
  erb :task
end

delete '/:id' do
  Task.get( params[:id] ).destroy
end