// JavaScript Document
// Autor: Petr Zaparka petr@zaparka.cz
// Date: 3.9.2009
// used libraries: jquery.js

(function($){
 
   PomodoroTimer = {
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
  };
 })(jQuery);
 
  $(document).ready(function () {      
    $('#button_start').bind('click',function(){ PomodoroTimer.start(); alert(PomodoroTimer.state); });
    $('#button_interruption').bind('click',function(){ PomodoroTimer.stop();alert(PomodoroTimer.state); });
  });//document ready