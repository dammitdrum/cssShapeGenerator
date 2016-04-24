
define(['marionette','backbone'],function(Marionette,Backbone){

	var App = new Marionette.Application();

	App.addRegions({
		headerRegion: "#header",
		contentRegion: "#content",
	});

	App.navigate = function(route, options){
		options || (options = {});
		Backbone.history.navigate(route, options);
	};


	App.Loader = Marionette.Object.extend({
		initialize: function() {
			App.Templates = {};
			this.arr_tpl = [
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
			];
			this.count = 0;
			this.xhr = new XMLHttpRequest();
		},
		start: function() {
			this.loader(this.arr_tpl);
		},
		loader: function(arr) {
			var self = this;

			this.xhr.open('GET',"/serg/app/templates/"+arr[self.count]+".html",true);
			this.xhr.send();
			this.xhr.onreadystatechange = function() {
	    		if (self.xhr.readyState != 4) return;
	    		App.Templates[arr[self.count]]=this.responseText;
				self.count++;
				if (self.count === self.arr_tpl.length) {
					App.start();
					return;
				};
				self.loader(self.arr_tpl);
	    	};
		}
	});

<<<<<<< HEAD
	return App;
=======
		this.xhr.open('GET',"/serg/app/templates/"+arr[self.count]+".html",true);
		this.xhr.send();
		this.xhr.onreadystatechange = function() {
    		if (self.xhr.readyState != 4) return;
    		App.Templates[arr[self.count]]=this.responseText;
			self.count++;
			if (self.count === self.arr_tpl.length) {
				App.start();
				return;
			};
			conssole.log(self.count);
			self.loader(self.arr_tpl);
    	};
	}
});
>>>>>>> parent of 1c5439d... console

})
