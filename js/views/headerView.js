
define(['marionette','app'],function(Marionette,App){

	return Marionette.ItemView.extend({
		className: 'navbar-inner container',
		collectionEvents: {
			'add remove': 'render',
		},
		ui: {
			count: '#my_shape_count',
			link: '#link_list'
		},
		initialize: function() {
			this.template = _.template(App.Templates['header_tpl']);
		},
		onRender: function() {
			this.ui.count.text(this.collection.length);
		}
	});

})