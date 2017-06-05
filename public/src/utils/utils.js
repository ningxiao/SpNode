module.exports = {
	provide: function(str) { //创建空间
		var space = window;
		var spas = str.split('.');
		for (var i = 0, l = spas.length; i < l; i++) {
			if (space[spas[i]]) {
				space = space[spas[i]];
			} else {
				space = space[spas[i]] = new Object();
			};
		};
	}
};