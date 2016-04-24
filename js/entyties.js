
define(['backbone','lib/backbone.localStorage'],function(Backbone){

	var storage = new Backbone.LocalStorage('shape');

	var ShapeModel = Backbone.Model.extend({
		defaults: {
			'community': false,
			'currProps': 'props'
		},
		parse: function(response) {
		    response.props = new CssPropCollection(response.props);
		    response.props_b = new CssPropCollection(response.props_b);
		    response.props_a = new CssPropCollection(response.props_a);
		    return response;
		},
		localStorage: storage
	});

	var ShapeCollection = Backbone.Collection.extend({
		model: ShapeModel,
		localStorage: storage,
		initialize: function() {
			this.fetch();
		}
	});

	var CommShapeCollection = Backbone.Collection.extend({
		model: ShapeModel,
		url: '/serg/app/js/shapes.json'
	});

	var CssPropModel = Backbone.Model.extend({
		initialize: function() {
			if (this.attributes.multi==1&&!this.get('select_tab')) {
				this.set('select_tab',false);
			}
		}
	});

	var CssPropCollection = Backbone.Collection.extend({
		model: CssPropModel,
	    url: '/serg/app/js/props.json',
	});

	return {
		ShapeModel: ShapeModel,
		ShapeCollection: ShapeCollection,
		CommShapeCollection: CommShapeCollection,
		CssPropCollection: CssPropCollection,
		shapes: new ShapeCollection(),
		commShapes: new CommShapeCollection()
	}

})
