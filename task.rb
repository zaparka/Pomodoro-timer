class Task
  include DataMapper::Resource
  property :id, Serial
  property :name, String
  property :number_of_pomodoros, Integer
  property :number_of_interuptions, Integer
  property :status, String, :default => 'waiting'
end