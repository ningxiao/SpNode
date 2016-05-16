"use strict";
/*********************************************************************************
 * main.js
 *
 * 工程配置文件
 *
 * @version 0.01
 * @author nxiao <363305175@qq.com>
 * @license {@link https://github.com/ningxiao}
 *********************************************************************************/

const path = require('path');
let root = path.dirname(path.dirname(__dirname));
module.exports = {
	"root": root,
	"home": root + "/www/html",
	"tpl": root + "/src/view/",
	"log": root + '/src/logs/log.log',
	"iszip": /^(htm|html|js|css)$/ig,
	"rulemap": {
		"static.hd.baofeng.com": /\_(.[\d_]+?)\./ig,
		"staticm.hd.baofeng.com": /\_(.[\d_]+?)\./ig
	},
	"defmap": {
		"/": "/index.html"
	},
	"cache": {
		"max": 100,
		"maxAge": 1000 * 60 * 60 //开启一小时缓存
	},
	"ejs": {
		"cache": true,
		"delimiter": "?"
	},
	"resmap": {
		"404": new Buffer('<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/><meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport"><meta name="description" content="" /><meta name="keywords" content="" /><title>404 Not Found</title></head><body bgcolor="white"><center><h1>404 Not Found</h1></center><center><h4>1、请检查是否开启静态访问            2、请检查访问文件是否存在</h4></center><hr><center>nxiao/0.1.7</center></body></html>'),
		"405": new Buffer('<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/><meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport"><meta name="description" content="" /><meta name="keywords" content="" /><title>405 Method Not Allowed</title></head><body bgcolor="white"><center><h1>405 Method Not Allowed</h1></center><center><h4>1、非GET访问静态文件</h4></center><hr><center>nxiao/0.1.7</center></body></html>')
	},
	"mimemap": {
		"css": "text/css",
		"gif": "image/gif",
		"html": "text/html;charset=utf-8",
		"ico": "image/x-icon",
		"jpeg": "image/jpeg",
		"jpg": "image/jpeg",
		"js": "application/x-javascript;charset=utf-8",
		"json": "application/json;charset=utf-8",
		"pdf": "application/pdf",
		"png": "image/png",
		"svg": "image/svg+xml",
		"swf": "application/x-shockwave-flash",
		"tiff": "image/tiff",
		"txt": "text/plain",
		"wav": "audio/x-wav",
		"mp3": "audio/mpeg ",
		"mp4": "video/mp4",
		"ogg": "application/ogg",
		"m4a": "audio/x-m4a",
		"mp4": "video/mp4",
		"webm": "video/webm",
		"wma": "audio/x-ms-wma",
		"wmv": "video/x-ms-wmv",
		"xml": "text/xml",
		"vtt": "text/vtt",
		"srt": "text/vtt",
		"m3u8": "application/x-mpegURL",
		"flv": "flv-application/octet-stream",
		"appcache": "text/cache-manifest",
		"manifest": "text/cache-manifest"
	}
};