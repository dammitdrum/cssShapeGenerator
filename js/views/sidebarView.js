	
define(['marionette','app','jqueryUI'],function(Marionette,App){

	var sidebarPropView = Marionette.ItemView.extend({
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
				if (this.ui.trans.find('input').prop('checked')) {
					return;
				};
				if(reg.test(val)) {
					this.model.set({'val':'#'+val});
				} else {
					$(tgt).val(this.model.get('val').substring(1));
				}
			};
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

	return Marionette.CompositeView.extend({
		childView: sidebarPropView,
		childViewContainer: "#props",
		initialize: function() {
			this.template = _.template(App.Templates['edit_tpl/sidebar_tpl']);
		}
	});

})