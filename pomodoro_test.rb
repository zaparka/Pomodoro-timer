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
    Task.all.destroy!
  end

  def test_if_inserts_task_to_database
    pre_count = Task.count
    post '/tasks', :name => 'Name of the task', :number_of_pomodoros => 1, :number_of_interuptions => 1
    
    assert last_response.ok?
    assert_equal pre_count + 1, Task.count
  end
  
  def test_if_inserts_right_data_for_task  
    post '/tasks', :name => 'Name of the task', :number_of_pomodoros => 1, :number_of_interuptions => 5
    
    assert last_response.ok?
    assert_equal 'Name of the task',Task.last.name
    assert_equal 1,Task.last.number_of_pomodoros
    assert_equal 5,Task.last.number_of_interuptions 
  end
  
  def test_if_gets_right_number_of_tasks  
    task = Task.create(:name => 'Name of the task', :number_of_pomodoros => 1, :number_of_interuptions => 5)
    
    get '/tasks'

    assert last_response.ok?
    assert_match /id: #{task.id}/, last_response.body
    assert_match /name: 'Name of the task'/, last_response.body
    assert_match /number_of_pomodoros: 1/, last_response.body
    assert_match /number_of_interuptions: 5/, last_response.body 
  end
  
  def test_if_gets_right_task 
    task = Task.create(:name => 'Name of the task', :number_of_pomodoros => 1, :number_of_interuptions => 5)
    
    get '/tasks/' + task.id.to_s

    assert last_response.ok?
    assert_match /id: #{task.id}/, last_response.body
    assert_match /name: 'Name of the task'/, last_response.body
    assert_match /number_of_pomodoros: 1/, last_response.body
    assert_match /number_of_interuptions: 5/, last_response.body 
  end
  
  def test_if_task_was_updated 
    task = Task.create(:name => 'Name of the task', :number_of_pomodoros => 1, :number_of_interuptions => 5)
      
    put '/tasks/' + task.id.to_s, :name => 'Updated name', :number_of_pomodoros => 2, :number_of_interuptions => 3

    assert last_response.ok?
    assert_match /id: #{task.id}/, last_response.body
    assert_match /name: 'Updated name'/, last_response.body
    assert_match /number_of_pomodoros: 2/, last_response.body
    assert_match /number_of_interuptions: 3/, last_response.body 
  end
  
   def test_if_task_was_deleted_from_database 
    Task.create(:name => 'Name of the task', :number_of_pomodoros => 1, :number_of_interuptions => 5)
    task = Task.create( :name => 'Updated name', :number_of_pomodoros => 2, :number_of_interuptions => 3 )
      
    delete '/tasks/' + task.id.to_s

    assert last_response.ok?
    assert_equal 1, Task.count
    assert_match 'Name of the task', Task.last.name
    assert_equal 1, Task.last.number_of_pomodoros
    assert_equal 5, Task.last.number_of_interuptions
  end
  
end