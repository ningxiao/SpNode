"use strict";
const fs = require("fs");
const logger = require('./logger');
const spawn = require('child_process').spawn;
const total = 3;
const path = "./config/guard.json";
const arg = process.argv.slice(2);
const datasource = JSON.parse(fs.readFileSync(path, "utf-8"));
let child, sum = 0;

function restart() {
	if (sum >= total) {
		logger.info("重启超过3次");
		process.exit(0);
	};
	child = spawn('node', arg, {
		detached: true
	});
	child.stdout.on('data', function(data) {
		console.log(data.toString());
	});
	// 添加一个end监听器来关闭文件流
	child.stdout.on('end', function(data) {
		console.log(data);
	});
	// 当子进程退出时，检查是否有错误，同时关闭文件流
	child.on('exit', function(code) {
		if (code != 0) {
			sum++;
			logger.info("工作进程异常重启第" + sum + "次");
			restart();
		};
	});
	datasource.cpid = [child.pid];
	fs.writeFileSync(path, JSON.stringify(datasource), {
		"encoding": "utf-8"
	});
	logger.info("工作进程" + child.pid);
};
restart();