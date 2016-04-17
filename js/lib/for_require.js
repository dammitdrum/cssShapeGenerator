require.config({
	baseUrl: '/serg/app/js',
	paths: {
		backbone: 'lib/backbone',
		localStorage: 'lib/backbone.localStorage',
		marionette: 'lib/backbone.marionette.min',
		bootstrap: 'lib/bootstrap',
		jquery: 'lib/jquery',
		jqueryUi: 'lib/jquery-ui.min',
		jscolor: 'lib/jscolor.min',
		underscore: 'lib/underscore',
		app: 'app',
		router: 'router',
		view: 'view',
		models: 'models'
	},
	shim: {
		underscore: {
			exports: '_'
		}, 
		backbone: {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		},
		marionette: {
			deps: ["backbone"],
			exports: "Marionette"
		},
		bootstrap: {
			deps: ["jquery"]
		},
	}
});

require(['app','router','view','models'],function(App) {
	App.on("start", function() {
		App.ctrl = new App.Controller();
		App.ctrl.router = new App.Router({
			controller: App.ctrl
		});
		App.ctrl.start();

		Backbone.history.start();
	});

	App.start();
})
