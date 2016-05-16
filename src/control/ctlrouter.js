"use strict";
/*********************************************************************************
 * ctlrouter.js
 *
 * http路由控制器模块
 *
 * @version 0.01
 * @author nxiao <363305175@qq.com>
 * @license {@link https://github.com/ningxiao}
 *********************************************************************************/
const fs = require("fs");
const url = require("url");
const path = require('path');
const config = require('../config/main');
const httpOutput = require('../server/httpOutput');
class ctlrouter {
	/**
	 * es6初始化构造函数
	 * @return null
	 */
	constructor() {
		this.actionmap = {};
		this.dispatcher = {};
	};
	/**
	 * 动态注入实现AOP模块
	 * @param  {object} act
	 */
	upaop(act) {
		let aop = act['pointcut'];
		let aopclass = aop["class"];
		let aopmethod = aop['method'];
		let joinpoint = aop['joinpoint'];
		let actclass = act["class"];
		if ((joinpoint in actclass.prototype) && (aopmethod in aopclass.prototype)) {
			let queue = [];
			let actfun = actclass.prototype[joinpoint];
			let aopfun = aopclass.prototype[aopmethod];
			switch (aop["advice"]) {
				case "before": //逻辑之前切入
					queue.push(aopfun, actfun);
					break;
				case "after": //逻辑之后切入
					queue.push(actfun, aopfun);
					break;
				case "around": //逻辑前后切入
					queue.push(aopfun, actfun, aopfun);
					break;
				case "replace": //替换原有逻辑
					actclass.prototype[joinpoint] = aopfun;
				default:
					return;
			};
			actclass.prototype[joinpoint] = function() {
				for (let i = 0, len = queue.length; i < len; i++) {
					queue[i].apply(this, arguments);
				}
			};
		}
	};
	/**
	 * 初始化路由进行配置文件
	 * @param  {object} data
	 */
	upstruts(data) {
		let obj;
		this.actionmap = data;
		for (let key in data) {
			obj = this.actionmap[key];
			obj["rule"] = new RegExp("^" + key + "$", 'i');
			obj["class"] = require('../' + data[key]["class"]);
			if ("pointcut" in obj) {
				obj["pointcut"]["class"] = require('../' + obj["pointcut"]["class"]);
				this.upaop(obj);
			}
		}
		this.createfil();
	};
	/**
	 * 创建对于的拦截解析器
	 * @return {null}
	 */
	createfil() {
		let path = config.root + "/src/control/routing";
		let files = fs.readdirSync(path);
		files.forEach(function(item) {
			if (item.indexOf(".js") != -1) {
				let obj = require("./routing/" + item);
				if (obj["name"] && obj["class"]) {
					this.dispatcher[obj["name"]] = obj["class"];
				}
			}
		}.bind(this));
	};
	/**
	 * 路由控制器异常处理方法
	 * @param  {Buffer} body    404内容
	 * @param  {[type]} response
	 */
	httpfail(body, response) {
		response.setHeader("Server", "nxiao/V5");
		response.writeHead(200, {
			'Content-Length': body.length,
			'Content-Type': 'text/html;charset=utf-8;'
		});
		response.write(body);
		response.end();
	};
	routmatch(key, request, response) {
		if (this.actionmap) {
			let action, query;
			for (let k in this.actionmap) {
				action = this.actionmap[k];
				if (query = key.match(action["rule"])) {
					new action['class'](request, response, this.dispatcher, action);
					return true;
				}
			}
		}
		return false;
	};
	/**
	 * 将HTTP 交个路由器进行代理处理
	 * @param  {request} request
	 * @param  {response} response
	 */
	proxy(request, response) {
		let key = url.parse(request.url).pathname;
		if (!this.routmatch(key, request, response)) {
			if (key.slice(-1) === "/") {
				key = "/index.html";
			}
			key = config.home + key;
			fs.exists(key, function(exists) {
				if (exists) {
					httpOutput(key, request, response);
					return;
				}
				this.httpfail(config.resmap["404"], response);
			}.bind(this));
		}
	}
}

module.exports = ctlrouter;