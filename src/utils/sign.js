"use strict";
const crypto = require('crypto');

function createNonceStr() {
	return Math.random().toString(36).substr(2, 15);
};

function createTimestamp() {
	return parseInt(new Date().getTime() / 1000) + '';
};

function raw(args) {
	let newArgs = {};
	let string = '';
	let keys = Object.keys(args).sort();
	keys.forEach(function(key) {
		newArgs[key.toLowerCase()] = args[key];
	});
	for (var k in newArgs) {
		string += '&' + k + '=' + newArgs[k];
	}
	string = string.substr(1);
	return string;
};
/**
 * @synopsis 签名算法 
 *
 * @param jsapi_ticket 用于签名的 jsapi_ticket
 * @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
 *
 * @returns
 */
function sign(jsapi_ticket, url) {
	let string, md5sum, ret = {
		"jsapi_ticket": jsapi_ticket,
		"nonceStr": createNonceStr(),
		"timestamp": createTimestamp(),
		"url": url,
		"debug": false,
		"beta": false,
		"jsApiList": []
	};
	string = raw(ret);
	md5sum = crypto.createHash('sha1');
	md5sum.update(string);
	ret.signature = md5sum.digest('hex');
	return ret;
};
module.exports = sign;