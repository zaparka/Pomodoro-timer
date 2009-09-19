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
  @tasks = Array.new
  @tasks.push( Task.get( params[:id ] ) ) 
  erb :index
end