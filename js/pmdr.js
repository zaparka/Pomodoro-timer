// JavaScript Document
// Autor: Petr Zaparka petr@zaparka.cz
// Date: 3.9.2009
// used libraries: jquery.js


function ServerStorage(taskManager) {
  this.taskManager = taskManager;
}

ServerStorage.prototype = {

  insert: function(task) {
    a = this;
    this.ajax_call('POST', '/tasks', {
      name: task.name,
      number_of_pomodoros: task.number_of_pomodoros,
      number_of_interuptions: task.number_of_interuptions,
      status: task.status
    }, function() {
      a.list();
    });
  },

  update: function(task){
    a = this;
    this.ajax_call('PUT', '/tasks/' + task.id, task,
      function(){
        a.list();
      });
  },

  remove: function(id) {
    if (id < 0)
      return;
    a = this;
    this.ajax_call('DELETE', '/tasks/' + id, null,
      function() {
        a.list();
      });
  },

  list: function() {
    a = this;
    this.ajax_call('GET', '/tasks', null, function(script) {
      eval(script);
      a.taskManager.updateHTMLSelect(tasks);
    });
  },

  get: function(id,method) {
    a = this;
    this.ajax_call('GET', '/tasks/' + id,null,function(script){
      eval(script);
      method(task, a);
    });
  },

  ajax_call: function(type, url, data, on_success_method){
    $.ajax({
     type: type,
     url: url,
     dataType: "script",
     data: data,
     success: on_success_method
    });
  }

};

function MemoryStorage(){
 this.storage = new Array();
}

MemoryStorage.prototype = {
  storage: null,

  insert: function(task) {
    this.storage.push(task);
  },

  update: function(id,task){
    this.storage[id] = task;
  },

  remove: function(id) {
    this.storage.splice(id,1);
  },

  list: function() {
    return this.storage;
  },

  get: function(id, method) {
    task = this.storage[id];
    if (method) {
      method(task, self)
    }

    return task;
  }

};

function TaskManager(storage) {
  this.tasks = storage;
};

TaskManager.prototype = {
  tasks: null,

  addTask: function(name) {
    if(name == '' || name == null ){
      name = prompt('Task name','Enter task nane');
    }
    this.tasks.insert(new Task(0, name, 0, 0, 'waiting'));
  },

  deleteTask: function(id) {
    this.tasks.remove(id);
  },

  updateTask: function(id) {
    this.tasks.get(id,function(task,self){
      self.taskManager.editTask(task);
    });
  },

  editTask: function(task) {
    task.name = prompt('Task name', task.name);
    this.tasks.update(task);
  },

  deleteSelectedTask: function(select) {
    if (select[0].selectedIndex == undefined) {
      return;
    }
    this.deleteTask(select[0].selectedIndex);
  },

  udpateSelectedTask: function(select) {
    if (select[0].selectedIndex == undefined) {
      return;
    }
    this.updateTask(select[0].selectedIndex);
  },

  update: function() {
    this.tasks.list();
  },

  // private
  updateHTMLSelect: function(list) {
    var selected_task = $("#task_list")[0].selectedIndex;
    $("#task_list").empty();
    jQuery.each(list, function(i, task) {
      cssclass = (task.status == 'done')? 'class="done"' : '';
      $("#task_list").append('<option '+ cssclass +'>'+task.to_s()+'</option>');
    });
    $("#task_list")[0].selectedIndex = selected_task;
  }

};

function Task(id, name, number_of_pomodoros, number_of_interuptions, status) {
  this.id = id;
  this.name = name;
  this.number_of_pomodoros = number_of_pomodoros;
  this.number_of_interuptions = number_of_interuptions;
  this.status = status;
}

Task.prototype = {
  id: 0,
  name: '',
  number_of_pomodoros: 0,
  number_of_interuptions: 0,
  status: '',

  to_s: function() {
    return this.name + ' (' + this.number_of_pomodoros + ') - ' + this.number_of_interuptions;
  }
};

Times = {
  sec: 1000,
  min: 1000*60,
  hour: 1000*60*60
};

function PomodoroTimer(task_manager) {
  this.state = 'stopped';
  this.task_manager = task_manager;
  this.timer = new Timer(this.stop, this);
};

PomodoroTimer.prototype = {
  state: 'stopped',
  task_manager: null,
  timer: null,

  start: function() {
    if(this.selected_task() == -1){
      alert('You must select task');
    } else if(this.state != 'running' ){
      $("#task_list").attr('disabled',true);
      this.state = 'running';
      this.timer.start(Times.sec * 10);
      $('#button_start').val('stop');
    } else {
       this.timer.state = 'stopped';
       this.stop(this);
    }
  },

  stop: function(thisObj) {
    thisObj.state = 'stopped';
    thisObj.timer.reset_display()

    $("#task_list").attr('disabled',false);
    $('#button_start').val('start');
    var selected_task = thisObj.selected_task();
    var task = thisObj.task_manager.tasks.get(selected_task, function(task, self){
      task.number_of_pomodoros += 1;
      self.taskManager.tasks.update(task);
    });
  },

  interuption: function () {
    if(this.state == 'running'){
     var selected_task = this.selected_task();
     var task = this.task_manager.tasks.get(selected_task,function(task, self){
       task.number_of_interuptions += 1;
       self.taskManager.tasks.update(task);
     });
    }
  },

  done: function () {
    var selected_task = this.selected_task();
    if (this.state != 'stopped')
      var task = this.task_manager.tasks.get(selected_task,function(task, self){
        task.number_of_pomodoros += 1;
        task.status = 'done';
        self.taskManager.tasks.update(task);
      });
    else
      var task = this.task_manager.tasks.get(selected_task,function(task, self){
        task.status = 'done';
        self.taskManager.tasks.update(task);
      });
    this.timer.state = 'stopped';
    this.timer.reset_display()
    this.state = 'stopped';
  },

  selected_task: function() {
    var selected_task = $("#task_list")[0].selectedIndex;
    return selected_task;
  }

};

function Timer(callback, obj) {
  this.callback = callback;
  this.obj = obj;
};

Timer.prototype = {
  endTime: 0,

  // end is in seconds
  start: function(end) {
    this.state = "running";
    this.setEndTime(end);
    this.update();
  },

  display: function (){
    $('#timer_seconds').val( TimeFormatter.formatSecs(this.getTimeLeft()) );
    $('#timer_minutes').val( TimeFormatter.formatMins(this.getTimeLeft()) );
  },

  reset_display: function (){
    $('#timer_seconds').val('00');
    $('#timer_minutes').val('00');
  },

  update: function() {
    if (this.state != "running") {
      return;
    }

    this.display();
    var totalSecs = parseInt(this.getTimeLeft() / Times.sec);
    if (totalSecs <= 0) {
      this.state = "stopped";
      setTimeout(this.callback, Times.sec, this.obj);
    } else {
      setTimeout(function(thisObj) { thisObj.update(); }, 100, this);
    }
  },

  // private
  getTime: function() {
    return new Date().getTime();
  },

  setEndTime: function(duration) {
    this.endTime = this.getTime() + duration;
  },

  getEndTime:function() {
    return this.endTime;
  },

  getTimeLeft:function() {
    var end = this.getEndTime();
    var now = this.getTime();
    var left = end - now;
    return left;
  }
};

TimeFormatter = {
  formatSecs:function(time) {
    var time_s = parseInt(time / Times.sec % 60);
    if(time_s < 10) {
      time_s = "0" + time_s;
    }
    return time_s;
  },

  formatMins:function(time) {
    var time_m = parseInt((time / Times.sec) / 60);	
    if(time_m <= 0){
      time_m = "00";
    }
    return time_m;
  }
};

$(document).ready(function () {
  var taskManager = new TaskManager();
  taskManager.tasks = new ServerStorage(taskManager);

  var pomodoroTimer = new PomodoroTimer(taskManager);
  taskManager.update();
  $('#button_start').bind('click', function(){ pomodoroTimer.start(); });
  $('#button_interruption').bind('click',function(){ pomodoroTimer.interuption(); });
  $('#button_done').bind('click',function(){ pomodoroTimer.done(); });

  $('#button_add').bind('click', function(){ taskManager.addTask(); });
  $('#button_delete').bind('click',function() { taskManager.deleteSelectedTask($('#task_list')); });
  $('#button_edit').bind('click',function() { taskManager.udpateSelectedTask($('#task_list')); });
});//document ready