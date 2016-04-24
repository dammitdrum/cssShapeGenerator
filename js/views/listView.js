
define(['marionette','app','format'],function(Marionette,App,format){

	var listItemView = Marionette.ItemView.extend({
		className: 'col-sm-6 col-md-4',
		ui: {
			edit: '.edit',
			del: '.delete',
		},
		events: {
			'click @ui.del': 'deliteShape',
		},
		initialize: function() {
			this.template = _.template(App.Templates['list_tpl/list_item_tpl']);
		},
		deliteShape: function() {
			this.model.destroy();
		},
		serializeData: function() {
			var str = format(this.model);
			return {
				query: this.model.get('query'),
				str_css: str, 
				community: this.model.get('community')
			};
		},
	});

	return Marionette.CollectionView.extend({
		childView: listItemView,
		className: 'row',
		collectionEvents: {
			'add': 'render'
		}
	});

})