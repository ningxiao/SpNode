"use strict";

function istype(obj) {
	return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
};

function analyze() {
	let data, type = istype(this.results);
	switch (type) {
		case "Object":
			data = new Buffer(JSON.stringify(this.results));
			break;
		case "String":
			data = new Buffer(this.results);
			break;
		default:
			data = this.results;
	}
	this.context.SetHeads("Content-Type", "application/json;charset=utf-8");
	this.context.SetHeads("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    this.context.SetHeads("Access-Control-Allow-Headers", "Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, Content-Language, Cache-Control, X-E4M-With");
	this.context.SetHeads("Access-Control-Allow-Credentials", "true");
	this.context.SetHeads("Access-Control-Allow-Origin", "*");
	this.context.WriteBuffer(data);
	this.release();
};
module.exports = {
	"name": "json",
	"class": analyze
};