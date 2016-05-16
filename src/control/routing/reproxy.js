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
	this.context.WriteBuffer(this.results);
	this.release();
};
module.exports = {
	"name": "proxy",
	"class": analyze
};