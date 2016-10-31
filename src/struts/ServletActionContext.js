"use strict";
const url = require("url");
const events = require('events');
const querystring = require('querystring');
class ServletActionContext extends events {
	/**
	 * es6初始化构造函数
	 * @return null
	 */
	constructor() {
		super();
		this.request;
		this.response;
		this.cookiemap;
		this.datasources;
		this.code = 200;
		this.cookies = []; //存放cookie输出数据
		this.heads = {
			"Content-Type": "text/plain;charset=utf-8;",
			"Server": "nxiao/V5"
		};
	};
	GetRequest() {
		return this.request;
	};
	GetResponse() {
		return this.response;
	};
	SetRequest(req) {
		this.request = req;
		if (req.method == "GET") {
			this.requestend(url.parse(req.url).query);
		} else {
			let sources = "";
			req.on('data', (postchunk) => {
				sources += postchunk;
			}).once('end', () => {
				this.requestend(sources);
			});
		};
	};
	SetResponse(res) {
		this.response = res;
	};
	GetHeaders(name) {
		return this.request.headers[name];
	};
	SetHeads(name, value) {
		this.heads[name] = value;
	};
	SetCode(code) {
		this.code = code;
	};
	WriteBuffer(buf) {
		this.heads["Set-Cookie"] = this.cookies;
		this.heads["Content-Length"] = Buffer.byteLength(buf);
		this.response.writeHead(this.code, this.heads);
		buf && this.response.write(buf);
		this.response.end();
	};
	SetCookie(name, value, expires, path, domain) {
		let today, new_date, expiresDate, cookie = name + '=' + value + ';';
		if (expires != undefined) { //cookie有效期时间
			today = new Date();
			new_date = new Date(today.getTime() + parseInt(expires) * 1000);
			expiresDate = new_date.toGMTString(); //转换成 GMT 格式。
			cookie += 'Expires=' + expiresDate + ';';
		};
		if (path != undefined) { //目录
			cookie += 'Path=' + path + ';';
		};
		if (domain != undefined) { //域名
			cookie += 'Domain=' + domain + ';';
		};
		this.cookies.push(cookie);
	};
	DelCookie(name) {
		this.SetCookie(name, '', -999);
	};
	GetCookie(name) {
		return this.cookiemap[name];
	};
	GetQuery(name) {
		return this.datasources[name];
	};
	QueryString(name) {
		return url.parse(this.request.url).query;
	};
	requestend(data) {
		this.datasources = querystring.parse(data);
		this.cookiemap = querystring.parse(this.request.headers.cookie, "; ", "=");
		this.emit("end", null);
	};
	emancipation() {
		this.request = this.response = this.cookiemap = this.datasources = this.code = this.cookies = this.heads = null;
	};
	get UserAgent() {
		return this.request.headers['user-agent'];
	};
	get ClientIp() {
		let ipaddress, forwardedips, forwardedipsstr = this.GetHeaders('x-forwarded-for');
		if (forwardedipsstr) {
			forwardedips = forwardedipsstr.split(',');
			ipaddress = forwardedips[0];
		};
		if (!ipaddress) {
			ipaddress = this.request.connection.remoteAddress.split(':');
			ipaddress = ipaddress[ipaddress.length - 1];
		};
		return ipaddress;
	};
};
module.exports = ServletActionContext;