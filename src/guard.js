"use strict";
const fs = require("fs");
const logger = require('./utils/logger');
const spawn = require('child_process').spawn;
const execsync = require('child_process').execSync;
const path = "./config/guard.json";

function start(arg) {
	let child = spawn('node', ["./utils/thread.js"].concat(arg), {
		detached: true,
		stdio: 'ignore'
	});
	fs.writeFileSync(path, JSON.stringify({
		"pid": child.pid,
		"config": arg
	}), {
		"encoding": "utf-8"
	});
	logger.info("守护进程" + child.pid);
	child.unref();
};

function stop(data, callback) {
	let pid, iswin = process.platform == 'win32';
	if (!data) {
		data = JSON.parse(fs.readFileSync(path, "utf-8"));
	};
	try {
		pid = data.pid;
		execsync(iswin ? `taskkill /pid ${pid} /f ` : `kill -9 ${pid}`);
		if (data.cpid) {
			for (let i = 0; i < data.cpid.length; i++) {
				pid = data.cpid[i];
				execsync(iswin ? `taskkill /pid ${pid} /f ` : `kill -9 ${pid}`);
			};
		}
		console.log(`指定${pid}成功杀掉！`);
		callback && callback();
	} catch (ex) {
		return console.log(`释放进程${pid}失败！！`, ex);
	};
};

function restart() {
	let data = JSON.parse(fs.readFileSync(path, "utf-8"));
	stop(data, () => {
		start(data.config);
		console.log("从启任务成功");
	});
};
(function(arg) {
	let data;
	if (arg.length >= 1) {
		switch (arg.shift()) {
			case "start":
				start(arg);
				break;
			case "stop":
				stop();
				break;
			case "restart":
				restart();
				break;
			case "list":
				console.log(JSON.parse(fs.readFileSync(path, "utf-8")));
				break;
			default:
		};
	};
})(process.argv.slice(2));