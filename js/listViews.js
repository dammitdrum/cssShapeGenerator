App.LoadingView = Marionette.ItemView.extend({
	className: "preloader_field",
	initialize: function() {
		this.template = _.template(App.Templates['preload_tpl']);
	},
});

App.HeaderView = Marionette.ItemView.extend({
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

App.ListItemView = Marionette.ItemView.extend({
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
		var str = App.ctrl.formatCSS(this.model);
		return {
			query: this.model.get('query'),
			str_css: str, 
			community: this.model.get('community')
		};
	},
});

App.ListView = Marionette.CollectionView.extend({
	childView: App.ListItemView,
	className: 'row',
	collectionEvents: {
		'add': 'render'
	}
});

App.MyListLayout = Marionette.LayoutView.extend({
	el: '#content',
	regions: {
		listRegion: "#shape_list",
	},
	initialize: function() {
		this.template = _.template(App.Templates['list_tpl/my_list_layout_tpl']);
	}
});

App.ListLayout = Marionette.LayoutView.extend({
	el: '#content',
	regions: {
		listRegion: '#community_shape_list'
	},
	ui: {
		form: '#form_add',
		input: '#name_form',
		modal: '#myForm',
		err: '#error_msg'
	},
	initialize: function() {
		this.template = _.template(App.Templates['list_tpl/list_layout_tpl']);
	},
	events: {
		'shown.bs.modal @ui.modal': 'focus',
		'submit @ui.form': 'submit'
	},
	focus: function() {
		this.ui.input.focus();
	},
	submit: function(e) {
		e.preventDefault();
		var val = this.ui.input.val();
		if (App.ctrl.validate(val).format) {
			this.ui.modal.modal('hide');
			var self = this;
			this.ui.modal.on('hidden.bs.modal',function() {
				self.create(self);
			});
		} else {
			this.ui.err.show();
		}
	},
	create: function(self) {
		self.ui.modal.unbind('hidden.bs.modal');
		App.ctrl.createShape(self.ui.input.val());
	}
});