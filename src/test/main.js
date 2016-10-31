"use strict";
const http = require('http');
const zlib = require('zlib');
const assert = require('assert');
const ProxyRequest = require('../utils/ProxyRequest');

function add() {
	return Array.prototype.slice.call(arguments).reduce(function(prev, curr) {
		return prev + curr;
	}, 0);
};
describe('add-函数测试', function() {
	let tests = [{
		args: [1, 2],
		expected: 3
	}, {
		args: [1, 2, 3],
		expected: 6
	}, {
		args: [1, 2, 3, 4],
		expected: 10
	}];
	tests.forEach((test) => {
		it('对象args长度' + test.args.length, function() {
			let res = add.apply(null, test.args);
			//对比执行结果
			assert.equal(res, test.expected);
		});
	});
});
describe('MySql-查询测试', () => {
	it('/tickets?id=1', (done) => {
		let proxyhttp = new ProxyRequest();
		let options = {
			hostname: '192.168.203.71',
			port: 80,
			path: '/tickets?id=1',
			method: 'GET',
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Accept-Encoding': 'gzip, deflate, sdch',
				'Connection': 'keep-alive',
				'Cookie': 'login=nxiao',
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36'
			}
		};
		proxyhttp.once("error", (err) => {
			done(err);
		});
		proxyhttp.once("end", (buff) => {
			assert.equal(JSON.parse(buff.toString()).status, 200);
			done();
		});
		proxyhttp.send(options);
	});
});
describe('百度地图异步-查询测试', () => {
	let map = [{
		title: '/locate?type=len 百度返回距离',
		path: '/locate?type=len&origins=' + encodeURIComponent('北京海淀区学院路51号') + '&destinations=' + encodeURIComponent('海淀区马甸东路')
	}, {
		title: '/locate?type=size 经纬度计算距离',
		path: '/locate?type=size&origins=' + encodeURIComponent('北京海淀区学院路51号') + '&destinations=' + encodeURIComponent('北京市朝阳区双桥')
	}];
	map.forEach((data) => {
		it(data.title, (done) => {
			let proxyhttp = new ProxyRequest();
			let options = {
				hostname: '192.168.203.71',
				port: 80,
				path: data.path,
				method: 'GET',
				headers: {
					'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
					'Connection': 'keep-alive',
					'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36'
				}
			};
			proxyhttp.once("error", (err) => {
				done(err);
			});
			proxyhttp.once("end", (buff) => {
				assert.equal(JSON.parse(buff.toString()).status, 200);
				done();
			});
			proxyhttp.send(options);
		});
	});
});
describe('用户中心代理登录-查询测试', () => {
	it('/ssobf?name=pangjincai', (done) => {
		let proxyhttp = new ProxyRequest();
		let options = {
			hostname: '192.168.203.71',
			port: 80,
			path: '/ssobf?name=pangjincai',
			method: 'GET',
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Accept-Encoding': 'gzip, deflate, sdch',
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36'
			}
		};
		proxyhttp.once("error", (err) => {
			done(err);
		});
		proxyhttp.once("end", (buff) => {
			assert.equal(200, 200);
			done();
		});
		proxyhttp.send(options);
	});
});