
define([
		'marionette',
		'app',
		'views/layouts',
		'views/headerView',
		'views/loadingView',
		'views/listView',
		'views/sidebarView',
		'views/shapeView',
		'views/gradientView',
		'entyties'
	],
	function(Marionette, App, Layouts, headerView, loadingView, listView, sidebarView, shapeView, gradientView, Entyties){

	var Router = Marionette.AppRouter.extend({
		appRoutes: {
			"":"listRoute",
			"myshapes/": "myListRoute",
			"myshapes/:id/edit": "editRoute",
			"myshapes/:id/create": "editRoute",
			"community/:id": "lookRoute",
		}
	});

	var Controller = Marionette.Object.extend({
		initialize: function () {
			this.shapes = Entyties.shapes;
			this.commShapes = Entyties.commShapes;
			this.listLayout = new Layouts.list();
			this.myListLayout = new Layouts.myList();
			this.editLayout = new Layouts.edit();
		},
		start: function() {
			this.showHeader(this.shapes);
		},
		listRoute: function() {
			this.showList(this.listLayout,this.commShapes);
		},
		myListRoute: function() {
			this.showList(this.myListLayout,this.shapes);
		},
		editRoute: function(id) {
			this.validate(id) ? 
				this.showEdit(id,this.shapes) : App.navigate('',{trigger:true});
		},
		lookRoute: function(id) {
			var self = this;
			if(this.commShapes.length==0) {
				this.commShapes.fetch().then(function() {
					self.showEdit(id,self.commShapes);
				})
			} else {
				this.showEdit(id,this.commShapes);
			};
		},
		showHeader: function(shapes) {
			var header = new headerView({
				collection: shapes
			});
			App.headerRegion.show(header);
		},
		showList: function(layout,data) {
			layout.render();
			var loading = new loadingView();
			var list = new listView({
				collection: data
			});
			layout.showChildView('listRegion',loading);
			data.fetch().then(function() {
				layout.showChildView('listRegion',list);
			});
		},
		showEdit: function(name,data) {
			var existShape = data.findWhere({'query': name});
			this.editLayout.render();
			if (existShape) {
				var shape = existShape;
				existShape.get('community') ? 
					App.navigate('community/'+name) :
					App.navigate('myshapes/'+name+'/edit');
			} else {
				var shape = new Entyties.ShapeModel();
				shape.set({
					'query': name,
					'props': new Entyties.CssPropCollection(),
					'props_b': new Entyties.CssPropCollection(),
					'props_a': new Entyties.CssPropCollection(),
				});
				shape.get('props').fetch();
				shape.get('props_b').fetch();
				shape.get('props_a').fetch();
				App.navigate('myshapes/'+name+'/create');
			};
			var sidebar = new sidebarView({ 
				collection: shape.get('props')
			});
			var shapeV = new shapeView({ 
				model: shape,
				collection: shape.get('props')
			});
			var gradient = new gradientView({ 
				model: shape
			});
			this.editLayout.showChildView('sidebarRegion',sidebar);
			this.editLayout.showChildView('shapeRegion',shapeV);
			this.editLayout.showChildView('gradientRegion',gradient);
		},
		validate: function(name) {
			var reg_name = /^[a-zA-ZА-Яа-яЁё]{1}[a-zA-ZА-Яа-яЁё0-9-]+$/;
			return reg_name.test(name) ? true : false;
		},
	});
	
	return {
		router: Router,
		controller: Controller
	}
})