"use strict";
const fs = require('fs');
const sql = require('../config/sql');
const mysql = require('../model/mysql');
const config = require('../config/main');
const logger = require('../utils/logger.js');
const ActionSupport = require('../struts/ActionSupport');
class MobileAction extends ActionSupport {
	/**
	 * es6初始化构造函数
	 * @return null
	 */
	constructor(servlet, request, response, method) {
		super(servlet, request, response, method);
	};
	routeAction() {
		let id = this.context.GetQuery("id") || 0;
		this.results = new Buffer(`{"status":200,"id":"${id}"}`);
		this.execute("success");
	};
	ticketsAction() {
		let page = this.context.GetQuery("page") || 0;
		setTimeout(function() {
			this.results = new Buffer(`{"status":200,"page":"${page}"}`);
			this.execute("success");
		}.bind(this), 2000);
	};
	quireAction() {
		let page = this.context.GetQuery("page") || 2;
		let type = this.context.GetQuery("type");
		let callback = this.context.GetQuery("callback");
		let data = [];
		if (type) {
			if (type == 2) {
				for (let i = 0; i < 21; i++) {
					data.push({
						"score": "9.5分",
						"title": `拆局专家${i}`,
						"detail": "钱嘉乐做魅力领袖",
						"url": "www.baidu.com",
						"img": "/images/picshow.jpg"
					});
				}
			} else {
				for (let i = 0; i < 10; i++) {
					data.push({
						"time": "03:45",
						"title": `${i}<strong>太阳的后羿</strong>OST《Always》`,
						"url": "www.baidu.com",
						"img": "/images/picshow.jpg"
					});
				}
			}
		} else {
			for (let i = 0; i < 5; i++) {
				data.push({
					"actor": "宋慧乔 / 宋仲基 / 金智媛 / 晋久/宋慧乔 / 宋仲基",
					"title": `太阳的后羿${i}`,
					"img": "/images/playlist.jpg",
					"area": "韩国",
					"era": "2016",
					"type": "爱情 / 剧情",
					"channel": "电视剧",
					"url": "www.baidu.com"
				});
			}
		}
		data = JSON.stringify(data);
		setTimeout(function() {
			if (callback) {
				this.results = new Buffer(`${callback}({"status": 200,"data": ${data}})`);
			} else {
				this.results = new Buffer(`{"status": 200,"data": ${data}}`);
			}
			this.execute("success");
		}.bind(this), 2000);
	};
	playAction() {
		this.results = {
			"title": "开启ejs缓存"
		};
		this.execute("success");
	};
	mplayAction() {
		this.execute("success");
	};
}
module.exports = MobileAction;