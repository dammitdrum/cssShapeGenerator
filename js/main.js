
require.config({
  paths : {
    underscore : 'lib/underscore',
    backbone   : 'lib/backbone',
    marionette : 'lib/backbone.marionette.min',
    jquery     : 'lib/jquery',
    jqueryUI   : 'lib/jquery-ui.min',
    jscolor    : 'lib/jscolor.min',
    bootstrap  : 'lib/bootstrap',
    clipboard  : 'lib/clipboard'
  },
  shim : {
    'lib/backbone.localStorage' : ['backbone'],
    underscore : {
      exports : '_'
    },
    backbone : {
      exports : 'Backbone',
      deps : ['jquery','underscore']
    },
    marionette : {
      exports : 'Marionette',
      deps : ['backbone']
    },
    bootstrap: {
    	deps: ['jquery']
    }
  },
  deps : ['jquery','underscore','bootstrap','jscolor']
});

require(['backbone','app','controller'],function(Backbone,App,Controller){

  App.on("start", function() {
    var ctrl = new Controller.controller();
    ctrl.router = new Controller.router({
      controller: ctrl
    });
    ctrl.start();
    Backbone.history.start();
    $('#app').addClass('loaded');
  });

	var tplLoader = new App.Loader();
  	tplLoader.start();
 
});