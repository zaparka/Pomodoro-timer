// JavaScript Document
// Autor: Petr Zaparka petr@zaparka.cz
// Date: 3.9.2009
// used libraries: jquery.js

Times = {
   sec: 1000,
   min: 1000*60,
   hour: 1000*60*60
 };

function PomodoroTimer() {
  this.state = 'stopped';
  this.timer = new Timer(Times.sec * 10, this.update_time);
};

PomodoroTimer.prototype = {
  state: 'stopped',
  timer: null,

  start: function() {
    this.state = 'running';
    this.timer.start();
  },

  stop: function() {
    this.state = 'stopped';
  },

  update_time: function() {
    console.log('Time out!');
  }

};

function Timer(end, callback) {
  this.callback = callback;
  this.setEndTime(end);    
};

Timer.prototype = {
  endTime: 0,

  // end is in seconds
  start: function(end, callback) {
    this.state = "running";
    this.update();
  },

  update: function() {
    if (this.state != "running") {
      return;
    }
    
    //Timer.display(Timer.el, Timer.getTimeLeft());
    console.log('Update timer time.');
    var totalSecs = parseInt(this.getTimeLeft() / Times.sec);
    if (totalSecs <= 0) {
      this.state = "stoped";
      setTimeout(this.callback, Times.sec);
    } else {
      setTimeout(function(thisObj) { thisObj.update(); }, 1000, this);
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

  
$(document).ready(function () {
  var pomodoroTimer = new PomodoroTimer();
  $('#button_start').bind('click',function(){ pomodoroTimer.start(); });
  $('#button_interruption').bind('click',function(){ pomodoroTimer.stop(); });
});//document ready