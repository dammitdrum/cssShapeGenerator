
App.Storage = new Backbone.LocalStorage('shape');

App.ShapeModel = Backbone.Model.extend({
	defaults: {
		'community': false,
		'currProps': 'props'
	},
	parse: function(response) {
	    response.props = new App.CssPropCollection(response.props);
	    response.props_b = new App.CssPropCollection(response.props_b);
	    response.props_a = new App.CssPropCollection(response.props_a);
	    return response;
	},
	localStorage: App.Storage
});

App.ShapeCollection = Backbone.Collection.extend({
	model: App.ShapeModel,
	localStorage: App.Storage,
	initialize: function() {
		this.fetch();
	}
});

App.CommShapeCollection = Backbone.Collection.extend({
	model: App.ShapeModel,
	url: '/serg/app/js/shapes.json'
});

App.CssPropModel = Backbone.Model.extend({
	defaults: {
		
	},
	initialize: function() {
		if (this.attributes.multi==1&&!this.get('select_tab')) {
			this.set('select_tab',false);
		}
	}
});

App.CssPropCollection = Backbone.Collection.extend({
	model: App.CssPropModel,
    url: '/serg/app/js/props.json',
});

