"use strict";
let url = require("url");
let util = require('util');
let events = require('events');
let querystring = require('querystring');

function GetCookie(request) {
	return querystring.parse(request.headers.cookie, "; ", "=");
};

function istype(obj) {
	return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
};

function analyserequest(request) {
	let sources = "";
	if (request.method == "GET") {
		this.requestend(url.parse(request.url).query);
	} else {
		request.on('data', function(postchunk) {
			sources += postchunk;
		});
		request.once('end', function() {
			this.requestend(sources);
		}.bind(this));
	}
};

function requestheaders(name, data) {
	let temp;
	if (name == '') {
		return data;
	}
	if (istype(name) == 'Array') { //数组形式传递进来
		temp = {};
		for (var i = 0, l = name.length; i < l; i++) {
			if (data[name[i]]) {
				temp[name[i]] = data[name[i]];
			} else {
				temp[name[i]] = '';
			}
		}
		return temp;
	} else {
		if (data[name]) {
			return data[name];
		} else {
			return null;
		}
	}
};

function ServletActionContext() {
	events.EventEmitter.call(this);
	this.request;
	this.response;
	this.cookiemap;
	this.datasources;
	this.getdata;
	this.code = 200;
	this.cookies = []; //存放cookie输出数据
	this.heads = {
		"Content-Type": "text/plain;charset=utf-8;",
		"Server": "nxiao/V5"
	};
};
util.inherits(ServletActionContext, events.EventEmitter);
ServletActionContext.prototype.dispatchEvent = function(event) {
	this.emit(event.type, event.data);
};
ServletActionContext.prototype.addEventListener = function(type, fun) {
	this.on(type, fun);
};
ServletActionContext.prototype.GetRequest = function() {
	return this.request;
};
ServletActionContext.prototype.GetResponse = function() {
	return this.response;
};
ServletActionContext.prototype.SetRequest = function(req) {
	this.request = req;
	analyserequest.call(this, req);
};
ServletActionContext.prototype.SetResponse = function(res) {
	this.response = res;
};
ServletActionContext.prototype.GetHeaders = function(name) {
	return requestheaders(name, this.request.headers);
};
ServletActionContext.prototype.GetClientip = function() {
	let ipaddress, forwardedips, forwardedipsstr = this.GetHeaders('x-forwarded-for');
	if (forwardedipsstr) {
		forwardedips = forwardedipsstr.split(',');
		ipaddress = forwardedips[0];
	}
	if (!ipaddress) {
		ipaddress = this.request.connection.remoteAddress.split(':');
		ipaddress = ipaddress[ipaddress.length - 1];
	}
	return ipaddress;
};
ServletActionContext.prototype.SetHeads = function(name, value) {
	this.heads[name] = value;
};
ServletActionContext.prototype.setCode = function(code) {
	this.code = code;
};
ServletActionContext.prototype.WriteBuffer = function(buf) {
	this.heads["Set-Cookie"] = this.cookies;
	this.heads["Content-Length"] = buf.length;
	this.response.writeHead(this.code, this.heads);
	if (buf) {
		this.response.write(buf,"");
	}
	this.response.end();
};
ServletActionContext.prototype.SetCookie = function(name, value, expires, path, domain) {
	let today, new_date, expiresDate, cookie = name + '=' + value + ';';
	if (expires != undefined) { //cookie有效期时间
		today = new Date();
		new_date = new Date(today.getTime() + parseInt(expires) * 1000);
		expiresDate = new_date.toGMTString(); //转换成 GMT 格式。
		cookie += 'Expires=' + expiresDate + ';';
	}
	if (path != undefined) { //目录
		cookie += 'Path=' + path + ';';
	}
	if (domain != undefined) { //域名
		cookie += 'Domain=' + domain + ';';
	}
	this.cookies.push(cookie);
};
ServletActionContext.prototype.DelCookie = function(name) {
	this.SetCookie(name, '', -999);
};
ServletActionContext.prototype.GetCookie = function(name) {
	return requestheaders(name, this.cookiemap);
};
ServletActionContext.prototype.GetQuery = function(name) {
	return requestheaders(name, this.datasources);
};
ServletActionContext.prototype.GetUserAgent = function() {
	return this.request.headers['user-agent'];
};
ServletActionContext.prototype.GetQueryMap = function(name) {
	return this.datasources;
};
ServletActionContext.prototype.getQueryString = function(name) {
	return url.parse(this.request.url).query;
};
ServletActionContext.prototype.requestend = function(data) {
	this.datasources = querystring.parse(data);
	this.cookiemap = GetCookie(this.request);
	this.dispatchEvent({
		'type': 'end'
	});
};
ServletActionContext.prototype.release = function() {
	this.request = this.response = this.cookiemap = this.datasources = this.code = this.cookies = this.heads = null;
};
module.exports = ServletActionContext;