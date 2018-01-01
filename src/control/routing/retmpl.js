"use strict";

const ejs = require('ejs');
const lru = require('lru-cache');
const config = require('../../config');
ejs.delimiter = config.ejs.delimiter; //设置ejs渲染指定分解好 <% 变为<?
ejs.cache = lru(config.cache); //使用缓存

module.exports = {
	"name": "freemarker",
	"class": (application) => {
		let routing = application.actionconfig.routing[application.command];
		let file = config.tpl + routing.value;
		let data = {};
		if (application.datasource) {
			data[routing.param || "data"] = application.datasource;
		};
		ejs.renderFile(file, data, {
			cache: config.ejs.cache,
			filename: routing.value
		}, (err, tmpl) => {
			application.context.SetHeads("Content-Type", "text/html;charset=utf-8");
			if (err) {
				tmpl = config.resmap["404"];
			};
			application.context.WriteBuffer(tmpl);
			application.emancipation();
			application = null;
		});
	}
};