// JavaScript Document
// Autor: Petr Zaparka petr@zaparka.cz
// Date: 3.9.2009
// used libraries: jquery.js

function TaskManager() {
  this.tasks = new Array();
};

TaskManager.prototype = {
  tasks: null,
  
  addTask: function(name) {
    if(name == '' || name == null ){
      name = prompt('Task name','Enter task nane');
    }  
    this.tasks.push(new Task(name));
    this.updateHTMLSelect();
  },
  
  deleteTask: function(i) {
    this.tasks.splice(i,1);
    this.updateHTMLSelect();
  },
  
  updateTask: function(i) {
    this.tasks[i].name = prompt('Task name',this.tasks[i].name);
    this.updateHTMLSelect();
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

  // private
  updateHTMLSelect: function() {
    $("#task_list").empty();   
    jQuery.each(this.tasks, function(i, task) {
      $("#task_list").prepend('<option>'+task.name+'</option>');
    });
  }

};

function Task(name) {
  this.name = name;
};

Task.prototype = {
  name: '',
  number_of_pomodoro: 0,
  number_of_interuptions: 0
};

Times = {
  sec: 1000,
  min: 1000*60,
  hour: 1000*60*60
};

function PomodoroTimer() {
  this.state = 'stopped';
  this.timer = new Timer(this.update_time);
};

PomodoroTimer.prototype = {
  state: 'stopped',
  timer: null,

  start: function() {
    this.state = 'running';
    this.timer.start(Times.sec * 10);
  },

  stop: function() {
    this.state = 'stopped';
  },

  update_time: function() {
    console.log('Time out!');
  }

};

function Timer(callback) {
  this.callback = callback; 
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
  
  update: function() {
    if (this.state != "running") {
      return;
    }
    
    this.display();
    var totalSecs = parseInt(this.getTimeLeft() / Times.sec);
    if (totalSecs <= 0) {
      this.state = "stopped";
      setTimeout(this.callback, Times.sec);
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
  var pomodoroTimer = new PomodoroTimer();
  var taskManager = new TaskManager();
  $('#button_start').bind('click',function(){ pomodoroTimer.start(); });
  $('#button_interruption').bind('click',function(){ pomodoroTimer.stop(); });
  $('#button_add').bind('click', function(){ taskManager.addTask(); });
  $('#button_delete').bind('click',function() { taskManager.deleteSelectedTask($('#task_list')); });
  $('#button_edit').bind('click',function() { taskManager.udpateSelectedTask($('#task_list')); });
});//document ready