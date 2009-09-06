// JavaScript Document
// Autor: Petr Zaparka petr@zaparka.cz
// Date: 3.9.2009
// used libraries: jquery.js

  //I am not quite sure with this construction :), realy extend jQuery? 
  var pomodoroTimer = jQuery.extend({
    init: function(){
     // this.state = 'stopped';
    },
    start: function(){        
      this.state = 'running';
    },
    stop: function(){        
      this.state = 'stopped';
    },
    state: 'stopped'
  }); 
  
  $(document).ready(function () {
    $('#button_start').bind('click',function(){ pomodoroTimer.start(); alert(pomodoroTimer.state); });                 
    $('#button_interruption').bind('click',function(){ pomodoroTimer.stop();alert(pomodoroTimer.state); });
  });//document ready
 
 