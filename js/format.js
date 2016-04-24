	
define([],function(){

	return function(shape) {
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
	};

})