	
define([
		'marionette',
		'app',
		'format',
		'clipboard',
		'entyties'
	],function(Marionette,App,format,Clipboard,Entyties){

	return Marionette.ItemView.extend({
		ui: {
			modalCode: '#modalCode',
			getCss: '#get_css',
			save: '#save',
			copy: '#copy',
			random: '#random',
			style: 'style',
			name: '#shape_name',
			editName: '#editName',
			err_f: '#error_format',
			err_e: '#error_exist',
			pseudo: '.pseudoTrigg'
		},
		events: {
			'click @ui.getCss': 'getCSS',
			'click @ui.save': 'onSaveShape',
			'click @ui.copy': 'onCopyShape',
			'click @ui.random': 'getRandom',
			'click @ui.editName': 'editName',
			'click @ui.pseudo': 'changePseudo',
			'blur @ui.name': 'saveName',
			'keydown @ui.name': 'enterPush',
		},
		modelEvents: {
			'change:query':'render',
			'change':'checkGrad'
		},
		initialize: function() {
			this.template = _.template(App.Templates['edit_tpl/shape_tpl']);
			this.listenTo(this.collection, "change", this.renderCss, this);
		},
		serializeData: function() {
			var str = format(this.model);
			return {
				str_css: str, 
				query: this.model.get('query'),
				community: this.model.get('community')
			};
		},
		onRender: function() {
			this.ui.save.popover();
			this.ui.copy.popover();
		},
		onDomRefresh: function() {
			$('[data-tab="'+this.model.get('currProps')+'"]').click();
			this.checkGrad();
			new Clipboard('#clipboard');
		},
		renderCss: function() {
			this.ui.style.html(format(this.model));
		},
		onSaveShape: function() {
			var self = this;
			this.model.save().then(function() {
				Entyties.shapes.add(self.model);
				self.collection = self.model.get(self.curr);
				self.listenTo(self.collection, "change", self.renderCss, self);
				self.triggerMethod('refresh:sidebar',self.collection);
			});
		},
		onCopyShape: function() {
			var copy_model = this.model.clone();
			copy_model.set('community',false);
			copy_model.save().then(function() {
				Entyties.shapes.add(copy_model);
			});
		},
		changePseudo: function(e,curr) {
			this.stopListening(this.collection, "change");
			this.curr = $(e.target).attr('data-tab')||curr;
			this.collection = this.model.get(this.curr);
			this.listenTo(this.collection, "change", this.renderCss, this);
			this.triggerMethod('refresh:sidebar',this.collection);
			this.model.set('currProps',this.curr);
		},
		editName: function() {
			this.ui.name.attr('contenteditable',true).addClass('edit');
			this.ui.name.focus();
			this.ui.editName.hide();
		},
		saveName: function() {
			var name = this.ui.name.text();
			if (!this.validate(name).format) {
				this.ui.err_f.show();
			} else {
				if (this.validate(name).exist&&name!==this.model.get('query')) {
					this.ui.err_e.show();
				} else {
					this.ui.name.attr('contenteditable',false).removeClass('edit');
					this.ui.editName.show();
					this.model.set({'query':name});
					this.ui.err_e.hide();
				};
				this.ui.err_f.hide();
			};
		},
		enterPush: function(e) {
			if(e.keyCode == 13) {
				e.preventDefault();
				this.saveName();
			};
		},
		getCSS: function() {
			var html = this.ui.style.html().trim();
			this.ui.modalCode.html(html);
		},
		checkGrad: function() {
			var self = this;
			this.ui.pseudo.each(function() {
				if (self.model.get('gradient_'+$(this).attr('data-tab'))) {
					$(this).addClass('gr');
				}
			});
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
		getRandom: function() {
			var props = this.model.get(this.curr);
			props.each(function(prop) {
				var min = prop.get('min'),
					max = prop.get('max'),
					letters = '0123456789ABCDEF'.split(''),
				    color = '';

				if (prop.get('type') === 'color') {
				    for (var i = 0; i < 6; i++ ) {
				        color += letters[Math.floor(Math.random() * 16)];
				    };
				    prop.set({'val':'#'+color});
				} else {
					var rand = Math.floor(Math.random() * (max - min) + min);
					prop.set({'val': rand});
				};
			});
			this.triggerMethod('refresh:sidebar',props);
		}
	});

})