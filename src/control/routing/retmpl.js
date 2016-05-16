"use strict";
const ejs = require('ejs');
const lru = require('lru-cache');
const config = require('../../config/main');
ejs.delimiter = config.ejs.delimiter;
ejs.cache = lru(config.cache);//使用缓存

function analyze(resultname, data, boo) {
	let action = this.actioninvocation['result'][resultname];
	let param = action['param'] || "data";
	let name = action['value'];
	let file = config.tpl + name;
	let tpldata = {};
	if (this.results) {
		tpldata[param] = this.results;
	}
	ejs.renderFile(file, tpldata, {
		cache: config.ejs.cache,
		filename: name
	}, function(err, tpl_c) {
		this.context.SetHeads("Content-Type", "text/html;charset=utf-8");
		if (err) {
			tpl_c = config.resmap["404"];
		} else {
			tpl_c = new Buffer(tpl_c);
		}
		this.context.WriteBuffer(tpl_c);
		this.release();
	}.bind(this));
};
module.exports = {
	"name": "freemarker",
	"class": analyze
};