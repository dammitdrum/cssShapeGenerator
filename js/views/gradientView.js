	
define(['marionette','app'],function(Marionette,App){

	return Marionette.ItemView.extend({
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

})