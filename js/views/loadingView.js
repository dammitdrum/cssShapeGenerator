
define(['marionette','app'],function(Marionette,App){

	return Marionette.ItemView.extend({
		className: "preloader_field",
		initialize: function() {
			this.template = _.template(App.Templates['preload_tpl']);
		},
	});

})