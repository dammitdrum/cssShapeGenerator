
define(['marionette','app','views/sidebarView','entyties'],function(Marionette,App,sidebarView,Entyties){

	var editLayout = Marionette.LayoutView.extend({
		el: '#content',
		regions: {
			sidebarRegion: "#sidebar_region",
		    shapeRegion: "#shape_region",
		    gradientRegion: "#gradient_region"	
		},
		childEvents: {
			'refresh:sidebar': 'refreshSidebar',
		},
		initialize: function() {
			this.template = _.template(App.Templates['edit_tpl/shape_layout_tpl']);
		},
		refreshSidebar: function(child, props) {
			var sidebar = new sidebarView({ 
				collection: props
			});
			this.showChildView('sidebarRegion',sidebar);
		}
	});

	var myListLayout = Marionette.LayoutView.extend({
		el: '#content',
		regions: {
			listRegion: "#shape_list",
		},
		initialize: function() {
			this.template = _.template(App.Templates['list_tpl/my_list_layout_tpl']);
		}
	});

	var listLayout = Marionette.LayoutView.extend({
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
			if (this.validate(val).format) {
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
			var name = self.ui.input.val();
			Entyties.shapes.findWhere({query:name}) ?
				App.navigate('myshapes/'+name+'/edit',{trigger:true}) :
				App.navigate('myshapes/'+name+'/create',{trigger:true});
		},
		validate: function(name) {
			var reg_name = /^[a-zA-ZА-Яа-яЁё]{1}[a-zA-ZА-Яа-яЁё0-9-]+$/,
				errors = {};
			Entyties.shapes.findWhere({query:name}) ? 
				errors.exist = true : errors.exist = false;
			reg_name.test(name) ? 
				errors.format = true : errors.format = false;
			return errors;
		},
	});

	return {
		edit: editLayout,
		list: listLayout,
		myList: myListLayout
	};

})