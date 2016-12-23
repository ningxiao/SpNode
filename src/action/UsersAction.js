"use strict";
const fs = require('fs');
const sql = require('../config/sql');
const mysql = require('../model/mysql');
const config = require('../config/main');
const logger = require('../utils/logger.js');
const childprocess = require('child_process');
const ActionSupport = require('../struts/ActionSupport');
class UsersAction extends ActionSupport {
	/**
	 * es6初始化构造函数
	 * @return null
	 */
	constructor(servlet, request, response, method) {
		super(servlet, request, response, method);
	};
	ismobile() {

	};
	userlog(data) {
		console.log("UsersAction-------log", data);
	};
	gruntAction() {
		let path = config.shell + 'deploy.sh';
		let type = this.context.GetQuery("type");
		let args = ['-T', type, '-N', 'dest.zip'];
		if (type) {
			childprocess.execFile(path, args, (err, stdout, stderr) => {
				if (err) {
					this.datasource = err;
				} else {
					this.datasource = stdout + stderr;
				};
				this.execute("success");
			});
		} else {
			this.datasource = "请传入执行类型"
			this.execute("success");
		};
	};
	testAction() {
		this.datasource = '{"name":"宁肖","age":27,"mobile":"13681182514"}';
		this.userlog(this.datasource);
		this.execute("success");
	};
	playAction() {
		this.datasource = {
			"title": "开启ejs缓存"
		};
		this.execute("success");
	};
	mplayAction() {
		this.datasource = {
			"title": "开启ejs缓存"
		};
		this.execute("success");
	};
	timeoutAction() {
		this.datasource = '{"name":"宁肖","age":27,"mobile":"13681182514"}';
		setTimeout(() => {
			this.execute("success");
		}, 5000);
	};
	postAction() {
		let usname = this.context.GetQuery("usname");
		let mobile = this.context.GetQuery("mobile");
		this.datasource = `{"name":"${usname}","age":27,"mobile":"${mobile}"}`;
		this.execute("success");
	};
	httpsAction() {
		let name = this.context.GetQuery("name");
		let device = "PC电脑";
		this.context.SetCookie("login", "nxiao");
		if (name) {
			if (this.ismobile(this.context.UserAgent)) {
				device = "移动端设备";
			};
			this.datasource = {
				"title": "401.1 - 未授权：登录失败",
				"device": device
			};
			this.execute("index");
			return;
		};
		this.datasource = '{"name":"宁肖","age":27,"mobile":"13681182514"}';
		this.execute("success");
	};
	ticketsAction() {
		let id = this.context.GetQuery("id");
		let login = this.context.GetCookie("login");
		let code = 500;
		let message = "登录失败";
		if (login == "nxiao") {
			mysql.pool(sql.WHERE_USER, [id], (err, results) => {
				let data = "[]";
				if (!err && results.length) {
					data = JSON.stringify(results);
					code = 200;
					message = "登录成功";
				};
				this.datasource = `{"status":${code},"message":"${message}","data":${data}}`;
				this.execute("success");
			});
		} else {
			this.datasource = `{"status":${code},"message":"${message}"}`;
			this.execute("success");
		};
	};
};
module.exports = UsersAction;