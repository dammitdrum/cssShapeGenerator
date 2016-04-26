
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

  var tplLoader = new App.Loader([
        'header_tpl',
        'preload_tpl',
        'list_tpl/list_layout_tpl',
        'list_tpl/list_item_tpl',
        'list_tpl/my_list_layout_tpl',
        'edit_tpl/shape_layout_tpl',
        'edit_tpl/shape_tpl',
        'edit_tpl/prop_tpl',
        'edit_tpl/sidebar_tpl',
        'edit_tpl/gradient_tpl'
      ]);
    tplLoader.start();
 
});