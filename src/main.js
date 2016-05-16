"use strict";
/*********************************************************************************
 * main.js
 *
 * 博客框架入口
 *
 * @version 0.01
 * @author nxiao <363305175@qq.com>
 * @license {@link https://github.com/ningxiao}
 *********************************************************************************/
const os = require('os');
const cluster = require('cluster');
let port = 80;
/**
 * 获取当前服务器IP地址
 * @return {String} 返回IP 默认127.0.0.1
 */
function getip() {
	let list, hostname = os.hostname();
	let network = os.networkInterfaces();
	for (let key in network) {
		list = network[key];
		for (let i = 0, len = list.length; i < len; i++) {
			if (list[i].family == "IPv4") {
				return list[i].address;
			}
		}
	}
	return "127.0.0.1";
};
if (cluster.isMaster) {
	let strutsanalyze = require('./struts/strutsanalyze');
	let body = strutsanalyze();
	for (let i = 0, cpus = os.cpus().length; i < cpus; i++) {
		cluster.fork().send({
			'head': 'set action',
			'body': body
		});
	};
	cluster.on('exit', function(worker, code, signal) {
		console.log('[master] ' + 'exit worker' + worker.id + ' died');
	});
} else {
	/**
	 * 主函数入口
	 * @param  {array} argv 命令行输入数据
	 * @return null
	 */
	function main(argv) {
		if (argv.length == 1) {
			port = argv[0];
		}
		require('./server/httpServer').listen(port);
		console.log(getip(), '--', process.pid);
	}
	main(process.argv.slice(2));
}