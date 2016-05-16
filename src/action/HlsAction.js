"use strict";
const fs = require('fs');
const config = require('../config/main');
const ActionSupport = require('../struts/ActionSupport');
class HlsAction extends ActionSupport {
	/**
	 * es6初始化构造函数
	 * @return null
	 */
	constructor(servlet, request, response, method) {
		super(servlet, request, response, method);
	};
	sizeAction() {
		let name = this.context.GetQuery("name");
		fs.stat(config.home + "/media/" + name, function(err, stats) {
			let size = stats.size,
				code = 200;
			if (err) {
				size = 0;
				code = 500;
			}
			this.results = new Buffer(`{"status":${code},"size":${size},"asseturl":"./media/${name}"}`);
			this.execute("success");
		}.bind(this));
	};
}
module.exports = HlsAction;