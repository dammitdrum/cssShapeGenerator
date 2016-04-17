
App.Router = Backbone.Marionette.AppRouter.extend({
	appRoutes: {
		"":"listRoute",
		"myshapes/": "myListRoute",
		"myshapes/:id/edit": "editRoute",
		"myshapes/:id/create": "editRoute",
		"community/:id": "lookRoute",
	}
});

App.Controller = Marionette.Object.extend({
	initialize: function () {
		this.shapes = new App.ShapeCollection();
		this.commShapes = new App.CommShapeCollection();
		this.listLayout = new App.ListLayout();
		this.myListLayout = new App.MyListLayout();
		this.editLayout = new App.EditLayout();
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
		this.validate(id).format ? 
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
		var header = new App.HeaderView({
			collection: shapes
		});
		App.headerRegion.show(header);
	},
	showList: function(layout,data) {
		layout.render();
		var preloadView = new App.LoadingView();
		var listView = new App.ListView({
			collection: data
		});
		layout.showChildView('listRegion',preloadView);
		data.fetch().then(function() {
			layout.showChildView('listRegion',listView);
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
			var shape = new App.ShapeModel();
			shape.set({
				'query': name,
				'props': new App.CssPropCollection(),
				'props_b': new App.CssPropCollection(),
				'props_a': new App.CssPropCollection(),
			});
			shape.get('props').fetch();
			shape.get('props_b').fetch();
			shape.get('props_a').fetch();
			App.navigate('myshapes/'+name+'/create');
		};
		var sidebarView = new App.SidebarView({ 
			collection: shape.get('props')
		});
		var shapeView = new App.ShapeView({ 
			model: shape,
			collection: shape.get('props')
		});
		var gradientView = new App.GradientView({ 
			model: shape
		});
		this.editLayout.showChildView('sidebarRegion',sidebarView);
		this.editLayout.showChildView('shapeRegion',shapeView);
		this.editLayout.showChildView('gradientRegion',gradientView);
	},
	formatCSS: function(shape) {
		var default_css = 'position: relative;\n   box-sizing: content-box;\n   ',
			default_css_pseudo = "content:'';\n   position: absolute;\n   box-sizing: content-box;\n   ",
			str_css = '#'+shape.get('query')+' {\n   '+default_css,
			str_css_a = '#'+shape.get('query')+'::after {\n   '+default_css_pseudo,
			str_css_b = '#'+shape.get('query')+'::before {\n   '+default_css_pseudo;

		function worker(str_css,id) {
			var line = '',
				arr = [],
				arr_del = [],
				bd_empty = false,
				important = false;

			shape.get(id).each(function(prop,i) {
				var name = prop.get('name');
				var type = prop.get('multi_type');
				if (important&&prop.get('multi')===0) {
					arr_del.push(name);
				};
				if (prop.get('important')) {
					important = true;
				} else if (name==='border-color') {
					arr_del.push(name);
				};
				if (prop.get('val')===0&&(name==='transform'||type==='border_radius')) {
					arr_del.push(name);
				};
				if (prop.get('val')===0&&type==='border') {
					if (bd_empty) {
						arr_del.push(name+'-color');
					};
					if (prop.get('multi')===1) {
						bd_empty = true;
					};
					arr_del.push(name);
				};
				var del_prop = _.find(arr_del,function(name) {
					return name === prop.get('name');
				});
				if (name !== del_prop) {
					line=' '+prop.get('str_b')+prop.get('val')+prop.get('str_a');
					arr[i] = name + ':' + line + ';\n   ';
				};
			});
			str_css+= arr.join('').trim() + '\n}\n';
			return str_css;
		};
		return worker(str_css,'props') + 
			worker(str_css_b,'props_b') + worker(str_css_a,'props_a');
	},
	createShape: function(name) {
		this.shapes.findWhere({query:name}) ?
			App.navigate('myshapes/'+name+'/edit',{trigger:true}) :
			App.navigate('myshapes/'+name+'/create',{trigger:true});
	},
	validate: function(name) {
		var reg_name = /^[a-zA-ZА-Яа-яЁё]{1}[a-zA-ZА-Яа-яЁё0-9-]+$/,
			errors = {};
		this.shapes.findWhere({query:name}) ? 
			errors.exist = true : errors.exist = false;
		reg_name.test(name) ? 
			errors.format = true : errors.format = false;
		return errors;
	},
});
