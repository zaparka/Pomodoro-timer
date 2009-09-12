// JavaScript Document
// Autor: Petr Zaparka petr@zaparka.cz
// Date: 3.9.2009
// used libraries: jquery.js

function ClientSideStorage() {
  if (window.openDatabase){
    this.storage = openDatabase("pomodoro_timer", "1.0", "HTML5 Database for PomodoroTimer", 200000);
    if (!this.storage)
      alert("Failed to open the database on disk.");
  } else {
    alert("Couldn't open the database.  Please try with a WebKit nightly with this feature enabled");
  }
  
  this.init();
  // this.storage.transaction(function(request) {
  //   request.executeSql("DROP TABLE tasks", [], function(req, result) {}, 
  //     function(error) {
  //       alert(error.message);
  //     } );
  // });
}

ClientSideStorage.prototype = {
  storage: null,
  
  init: function() {
    this.storage.transaction(function(request) {
      request.executeSql("SELECT COUNT(*) FROM tasks", [], function(result) {},
      
      function(request, error) {
        request.executeSql("CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, number_of_pomodoros INT, number_of_interuptions INT)", [],
          function(result, error) { 
            //alert(error);
          });
      });
    });
  },
  
  insert: function(task) {
    this.storage.transaction(function(request) {
      request.executeSql("INSERT INTO tasks (name, number_of_pomodoros, number_of_interuptions) VALUES (?, ?, ?)", 
       [task.name, task.number_of_pomodoros, task.number_of_interuptions], function(result) {}, 
       function(request, error) {
         alert(error.message);
         return;
       });
    });
  },
  
  update: function(id, task) {
    this.storage.transaction(function(request) {
      request.executeSql("UPDATE tasks SET name = ?, number_of_pomodoros = ?, number_of_interuptions = ? LIMIT 1 OFFSET ?", 
        [task.name, task.number_of_pomodoros, task.number_of_interuptions]);
    });
  },
  
  list: function() {
    var tasks = new Array();
    var wait4result = true;
    
    this.storage.transaction(function(request) {
      request.executeSql("SELECT * FROM tasks", [], function(req, result) {
        for (var i = 0; i < result.rows.length; ++i) {
          var row = result.rows.item(i);
          var task = new Task();
          task.id = row['id'];
          task.name = row['name'];
          task.number_of_pomodoros = row['number_of_pomodoros'];
          task.number_of_interuptions = row['number_of_interuptions'];

          tasks.push(task);
        }

        wait4result = false;
      }, function(tx, error) {
          wait4result = false;
          alert('Failed to retrieve notes from database - ' + error.message);
          return;
        }
      );
      
    });
    
    while (wait4result) {  };
    
    return tasks;
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
  
  get: function(id) {
    return this.storage[id];
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
    this.tasks.insert(new Task(name));
    this.updateHTMLSelect();
  },
  
  deleteTask: function(id) {
    this.tasks.remove(id);
    this.updateHTMLSelect();
  },
  
  updateTask: function(id) {
    var task = this.tasks.get(id);
    task.name = prompt('Task name', task.name); 
    this.tasks.update(id, task);
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
    jQuery.each(this.tasks.list(), function(i, task) {
      $("#task_list").prepend('<option>'+task.name+'</option>');
    });
  }

};

function Task(name) {
  this.name = name;
};

Task.prototype = {
  name: '',
  number_of_pomodoros: 0,
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
  var taskManager = new TaskManager(new MemoryStorage());
  taskManager.updateHTMLSelect();
  $('#button_start').bind('click',function(){ pomodoroTimer.start(); });
  $('#button_interruption').bind('click',function(){ pomodoroTimer.stop(); });
  $('#button_add').bind('click', function(){ taskManager.addTask(); });
  $('#button_delete').bind('click',function() { taskManager.deleteSelectedTask($('#task_list')); });
  $('#button_edit').bind('click',function() { taskManager.udpateSelectedTask($('#task_list')); });
});//document ready