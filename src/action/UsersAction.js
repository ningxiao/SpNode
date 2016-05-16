"use strict";
const fs = require('fs');
const sql = require('../config/sql');
const mysql = require('../model/mysql');
const config = require('../config/main');
const logger = require('../utils/logger.js');
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
	logAction() {
		let debuglog = this.context.GetQuery("debuglog");
		if (debuglog) {
			let key = this.context.GetQuery("key");
			logger.info(`${key}->${debuglog}`);
			this.results = new Buffer('{"status":"200"}');
		} else {
			this.results = new Buffer(fs.readFileSync('./logs/log.log', 'utf-8'));
		}
		this.execute("success");
	};
	httpsAction() {
		let name = this.context.GetQuery("name");
		let device = "PC电脑";
		this.context.SetCookie("login", "thy");
		if (name) {
			if (this.ismobile(this.context.GetUserAgent())) {
				device = "移动端设备";
			}
			this.results = {
				"title": "401.1 - 未授权：登录失败",
				"device": device
			};
			this.execute("index");
			return;
		}
		this.results = new Buffer('{"name":"宁肖","age":27,"mobile":"13681182514"}');
		this.execute("success");
	};
	ticketsAction() {
		let id = this.context.GetQuery("id");
		let login = this.context.GetCookie("login");
		let code = 500;
		let message = "登录失败";
		if (login == "nxiao") {
			mysql.pool(sql.WHERE_USER, [id], function(err, results) {
				let data = "[]";
				if (!err && results.length) {
					data = JSON.stringify(results);
					code = 200;
					message = "登录成功";
				}
				this.results = new Buffer(`{"status":${code},"message":"${message}","data":${data}}`);
				this.execute("success");
			}.bind(this));
		} else {
			this.results = new Buffer(`{"status":${code},"message":"${message}"}`);
			this.execute("success");
		}
	};
	cityAction() {
		let map = ['A', 'B', 'C', 'D', 'E'];
		let json, list = [];
		for (let i = 0; i < map.length; i++) {
			json = {
				"title": map[i],
				"city": []
			};
			for (let k = 0; k < 4; k++) {
				json.city.push({
					"id": i + k,
					"title": "北京-" + i + k + "市"
				});
			};
			list.push(json);
		};
		this.results = {
			"status": 200,
			"message": "",
			"list": list
		};
		//		this.execute("success");
		setTimeout(function() {
			this.execute("success");
		}.bind(this), 1000);
	};
	roomAction() {
		let unite = this.context.GetQuery("unite");
		let json = {
			"status": 200,
			"message": ""
		};
		if (unite) {
			let room_list = [];
			for (let i = 0; i < 6; i++) {
				room_list.push({
					"id": i,
					"title": `红牛${i}号厅`,
					"score": 2.7 + i,
					"type": 1 + (i % 2), //1.标准厅,2.自由厅
					"img": 40,
					"item": ["4人间", "DBOX"]
				});
			};
			let theatre = {
				"title": "北京艾米影院三里屯店",
				"address": "北京朝阳区工人体育场北路10号三里屯soho A座B栋1号楼3单元 ",
				"tel": "010-65750180",
				"date_list": ["2015-11-08", "2015-11-09", "2015-11-10", "2015-11-11", "2015-11-12", "2015-11-13", "2015-11-14"],
				"room_list": room_list
			};
			json.theatre = theatre;
		}
		let list = [];
		for (let i = 0; i < 10; i++) {
			list.push({
				"id": i,
				"start": `2015-12-30 0${i}:00:00`,
				"end": `2015-12-30 ${i+2}:00:00`,
				"status": 1 + (i % 2), //.可用,2.不可用
				"duration": 120,
				"price": 1120910
			});
		};
		json.list = list;
		this.results = json;
		// this.execute("success");
		setTimeout(function() {
			this.execute("success");
		}.bind(this), 1000);
	};
	indexAction() {
		let unite = this.context.GetQuery("unite");
		let quire = {
			"city": {
				"id": 1,
				"title": "北京市",
				"area": [{
					"id": 1,
					"title": "海淀区"
				}, {
					"id": 2,
					"title": "朝阳区"
				}, {
					"id": 3,
					"title": "通州区"
				}, {
					"id": 4,
					"title": "东城区"
				}, {
					"id": 5,
					"title": "宣武区"
				}]
			}
		};
		if (unite) {
			quire.sort = [{
				"id": 1,
				"title": "默认排序"
			}, {
				"id": 2,
				"title": "最新开店"
			}, {
				"id": 3,
				"title": "离我最近"
			}, {
				"id": 4,
				"title": "评分最高"
			}, {
				"id": 5,
				"title": "暴风自营"
			}];
			quire.itemtype = [];
			for (let i = 0; i < 10; i++) {
				quire.itemtype.push({
					"id": i,
					"title": "房间大小",
					"item": [{
						"id": 1,
						"title": "2人间"
					}, {
						"id": 2,
						"title": "3人间"
					}, {
						"id": 3,
						"title": "4人间"
					}, {
						"id": 4,
						"title": "5人间"
					}, {
						"id": 5,
						"title": "6人间"
					}, {
						"id": 6,
						"title": "6人间"
					}, {
						"id": 7,
						"title": "7人间"
					}]
				});
			};
		};
		let list = [];
		let imgs = [80, 48, 50, 52, 71, 56, 72, 71, 77];
		for (var i = 0; i < imgs.length; i++) {
			list.push({
				"id": 1,
				"title": `${quire.city.title}三里屯${i+1}店`,
				"discount": 100 - i * 10,
				"type": 1 + (i % 2),
				"price": 72315,
				"score": i + 2.5,
				"been": i % 2,
				"distance": 1385 - (i * 100),
				"img": imgs[i],
				"item": ["2人间", "全景声", "usb", "沙发", "自由预定", "Quake座椅", "牛逼震天音响", "吊炸天服务"]
			})
		};
		this.results = {
			"status": 200,
			"message": "",
			"quire": quire,
			"list": list
		};
		//this.execute("success");
		setTimeout(function() {
			this.execute("success");
		}.bind(this), 500);
	}
}
module.exports = UsersAction;