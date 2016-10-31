"use strict";
/*********************************************************************************
 * httpServer.js
 *
 * http服务模块
 *
 * @version 0.01
 * @author nxiao <363305175@qq.com>
 * @license {@link https://github.com/ningxiao}
 *********************************************************************************/
const http = require('http');
const ctlrouter = require('../control/ctlrouter');
class httpServer {
	/**
	 * es6初始化构造函数
	 * @return null
	 */
	constructor() {
		this.ctlrouter = new ctlrouter();
		this.http = http.createServer(this.httprouter.bind(this));
		this.http.on('error', function(error) {
			if (error.code == 'EADDRINUSE') {
				console.log('服务端口被占用');
			}
		});
	};
	/**
	 * 设置Action拦截器值配置路由
	 * @param {object} data
	 */
	set action(data) {
		this.ctlrouter.upstruts(data);
	};
	/**
	 * 开启http服务
	 * @param  {int} port 启动端口 默认80端口
	 */
	listen(port) {
		this.http.listen(port);
	};
	/**
	 * http请求接受之后交个路由控制模块处理
	 * @param  {request} request
	 * @param  {response} response
	 */
	httprouter(request, response) {
		this.ctlrouter.proxy(request, response);
	};
}
const actionserver = new httpServer();
/**
 * 接收主进程对子进程的通知
 * @param  {object} head 通知消息头;
 * @return null;
 */
process.on('message', (msg) => {
	switch (msg.head) {
		case 'set action':
			actionserver.action = msg.body;
			break;
		default:
	}
});
/**
 * 监听服务器异常退出
 * @param  {object} err 退出异常信息
 * @return null
 */
process.on('exit', (err) => {
	console.log("服务器退出");
});
/**
 * 监听服务器uncaughtException退出
 * @param  {object} err 退出异常信息
 * @return null
 */
process.on('uncaughtException', (err) => {
	console.log(err.toString());
});
module.exports = actionserver;