
App.EditLayout = Marionette.LayoutView.extend({
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
		var sidebarView = new App.SidebarView({ 
			collection: props
		});
		this.showChildView('sidebarRegion',sidebarView);
	}
});

App.ShapeView = Marionette.ItemView.extend({
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
		var str = App.ctrl.formatCSS(this.model);
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
		this.ui.style.html(App.ctrl.formatCSS(this.model));
	},
	onSaveShape: function() {
		var self = this;
		this.model.save().then(function() {
			App.ctrl.shapes.add(self.model);
			self.collection = self.model.get(self.curr);
			self.listenTo(self.collection, "change", self.renderCss, self);
			self.triggerMethod('refresh:sidebar',self.collection);
		});
	},
	onCopyShape: function() {
		var copy_model = this.model.clone();
		copy_model.set('community',false);
		copy_model.save().then(function() {
			App.ctrl.shapes.add(copy_model);
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
		if (!App.ctrl.validate(name).format) {
			this.ui.err_f.show();
		} else {
			if (App.ctrl.validate(name).exist&&name!==this.model.get('query')) {
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

App.SidebarPropView = Marionette.ItemView.extend({
	className: 'wrap_range row',
	ui: {
		line: '.range_slider',
		input: '.field',
		trigger: '[data-trigger]',
		trans: '.checkbox',
		apply: '.button_apply',
		radio: '.radio span'
	},
	events: {
		'change @ui.input': 'setCss',
		'click @ui.trigger': 'changeTab',
		'click @ui.trans': 'changeTransparent',
		'click @ui.apply': 'changeApply',
		'click @ui.radio': 'changeType'
	},
	initialize: function() {
		this.template = _.template(App.Templates['edit_tpl/prop_tpl']);
	},
	onRender: function() {
		var prop = this.model,
			input = this.ui.input;
			
		input.val(prop.get('val'));
		this.ui.line.slider({
			min: prop.get('min'),
			max: prop.get('max'),
			value: prop.get('val'),
			slide: function(event, ui) {
				prop.set({'val':ui.value});
				input.val(ui.value);
			},
			change: function(event, ui) {
				prop.set({'val':ui.value});
			}
		});
		if (prop.get('type') === 'color') {
			this.ui.line.slider('destroy');
			var picker = new jscolor(input.get(0));
		};
		if (prop.get('val')==='transparent') {
			this.ui.trans.find('input').prop('checked',true);
		};
		if (prop.get('important')) {
			this.ui.apply.addClass('active');
		};
		this.ui.radio.each(function() {
			if ($(this).text()===prop.get('str_a')) {
				$(this).click();
			}
		});
	},
	onDomRefresh: function() {
		if (this.ui.trigger.length) {
			var tab = this.model.get('select_tab');
			this.ui.trigger.find('button').eq(tab).addClass('active');	
			$(this.ui.trigger.attr('data-trigger')).hide().eq(tab).show();
		};
	},
	setCss: function(e) {
		var tgt = e.target;
		var val = tgt.value;
		var max = this.model.get('max');
		
		if(this.model.get('type') !== 'color') {
			var reg = /^[0-9-]+$/;
			if(reg.test(val)) {
				this.ui.line.slider({value: val});
				$(tgt).val(val>=max?max:val);
			} else {
				$(tgt).val(this.model.get('val'));
			};
		} else {
			var reg = /^([0-9a-f]{3}|[0-9a-f]{6})$/i;
			reg.test(val) ?
				this.model.set({'val':'#'+val}) :
				$(tgt).val(this.model.get('val').substring(1));
		}
	},
	changeTab: function(e) {
		var n = $(e.target).attr('data-num');
		if ($(e.target).hasClass('active')) return;
		this.ui.trigger.find('button').removeClass('active');
		$(e.target).addClass('active');
		$(this.ui.trigger.attr('data-trigger')).hide().eq(n).show();
		this.model.set('select_tab',+n?n:false);
	},
	changeTransparent: function() {
		if (this.ui.trans.find('input').prop('checked')) {
			this.model.set('val','transparent');
		} else {
			this.model.set('val','#'+this.ui.input.val());
		}
	},
	changeApply: function() {
		this.ui.apply.toggleClass('active');
		this.model.set('important',this.ui.apply.hasClass('active')?true:false);
	},
	changeType: function(e) {
		var type = $(e.target).text();
		this.model.set('str_a',type);
		this.ui.radio.removeClass('check');
		$(e.target).addClass('check');
	}
});

App.SidebarView = Marionette.CompositeView.extend({
	childView: App.SidebarPropView,
	childViewContainer: "#props",
	initialize: function() {
		this.template = _.template(App.Templates['edit_tpl/sidebar_tpl']);
	}
});

App.GradientView = Marionette.ItemView.extend({
	ui: {
		color: '.color_field',
		range: '.range_slider',
		submit: '#submit_grad',
		directs: '.direct',
		style: 'style'
	},
	events: {
		'click @ui.directs': 'changeDirect',
		'change @ui.color': 'renderCss',
		'click @ui.submit': 'submitGradient'
	},
	modelEvents: {
		'change:currProps':'render'
	},
	initialize: function() {
		this.template = _.template(App.Templates['edit_tpl/gradient_tpl']);
		this.position = 50;
		this.direct = 'linear-gradient(to right';
	},
	onRender: function() {
		var self = this;
		var picker = [];
		this.obj = this.model.get('gradient_'+this.model.get('currProps'))||{};
		this.ui.range.slider({
			min: 0,
			max: 1000,
			value: self.obj.position*10+1||500,
			slide: function(event, ui) {
				self.position = ui.value/10;
				self.renderCss();
			}
		});
		if (this.obj.position){
			this.ui.color.eq(0).val(this.obj.start);
			this.ui.color.eq(1).val(this.obj.middle);
			this.ui.color.eq(2).val(this.obj.end);
			this.position = this.obj.position;
			this.ui.directs.each(function(i) {
				if($(this).attr('data-str')===self.obj.direct) {
					$(this).trigger('click');
				}
			});
		} else {
			this.direct = 'linear-gradient(to right';
			this.position = 50;
			this.ui.directs.eq(0).addClass('active');
			this.renderCss();
		};
		this.ui.color.each(function(i) {
			picker[i] = new jscolor($(this).get(0));
		});
	},
	renderCss: function() {
		this.obj = {
			start: this.ui.color.eq(0).val(),
			middle: this.ui.color.eq(1).val(),
			end: this.ui.color.eq(2).val(),
			position: this.position,
			direct: this.direct
		};
		this.str = this.obj.direct+',#'+this.obj.start+' 0%,#'+this.obj.middle+' '+this.obj.position+'%,#'+this.obj.end+' 100%)';
		this.ui.style.html('.gradient_field{background:'+this.str+';}');
	},
	changeDirect: function(e) {
		if ($(e.target).hasClass('active')) return;
		this.direct = $(e.target).attr('data-str');
		this.ui.directs.removeClass('active');
		$(e.target).addClass('active');
		this.renderCss();
	},
	submitGradient: function() {
		this.model.get(this.model.get('currProps'))
			.findWhere({name:'background'}).set({val:this.str});
		this.model.set('gradient_'+this.model.get('currProps'),this.obj);
	}
});
