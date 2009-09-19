require 'rubygems'
require 'sinatra'
require 'haml'
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