require 'pomodoro'
require 'nokogiri'
require 'test/unit'
require 'rack/test'

set :environment, :test

class PomodoroTest < Test::Unit::TestCase
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup
    #Task.all.destroy!
  end

  def test_it_inserts_task_to_database
    #pre_count = Task.count
    post '/', :name => 'Name of the task', :number_of_pomodoros => 1, :number_of_interuptions => 5
    
    assert last_response.ok?
    #assert pre_count + 1, Task.count
  end
  
end