"use strict";
const config = require('../config/main');
const ActionSupport = require('../struts/ActionSupport');
class ProxyAction extends ActionSupport {
	/**
	 * es6初始化构造函数
	 * @return null
	 */
	constructor(servlet, request, response, method) {
		super(servlet, request, response, method);
	};
	ismobile() {

	};
	ssoAction() {
		let http = require('http');
		let response = this.context.GetResponse();
		let options = {
			hostname: 'sso.baofeng.net',
			port: 80,
			path: '/api/main/login',
			method: 'GET',
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Accept-Encoding': 'gzip, deflate, sdch',
				'Connection': 'keep-alive',
				'Cookie': 'lastloginname=13681182514; BOXID=80d7ebfa0a5c9090116abd03860fd3e1; VISIT=1; DATE=1448882317; LASTDAYS=0; PHPSESSID=655c501b85ed28d52b7924ec4c3f29aa; Hm_lvt_3db4e6c080c584499653380ee17343be=1449801182,1449801195; Hm_lpvt_3db4e6c080c584499653380ee17343be=1449801234',
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36'
			}
		};
		let self = this;
		let name = this.context.GetQuery("name") || '屌毛';
		function proxysuccess(headers, buff) {
			buff = buff.toString().replace(/(href=")/g, 'href="http://sso.baofeng.net').replace(/(src=")/g, 'src="http://sso.baofeng.net').replace(/(暴风影音 - 用户登录)/,`暴风影音 -${name}`);
			self.results = buff.replace(/(\<\/body\>)/, `<script>setTimeout(function(){document.getElementById("loginname").value='${name}';document.getElementById("password").value=123456789;SSO.Login()},200);</script>`);
			if ('content-encoding' in headers) {
				delete headers['content-encoding'];
			}
			self.context.heads = headers;
			self.execute("success");
		};
		let request = http.request(options, function(res) {
			let size = 0;
			let chunks = [];
			res.on('data', function(chunk) {
				if (res.statusCode == 200) {
					chunks.push(chunk);
					size += chunk.length;
				}
			});
			res.on('end', function() {
				let chunk, buff = new Buffer(size);
				let encoding = res.headers['content-encoding'];
				for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
					chunk = chunks[i];
					chunk.copy(buff, pos);
					pos += chunk.length;
				}
				chunk = null;
				chunks = null;
				if (encoding) {
					let zlib = require("zlib");
					if (encoding.match(/\bgzip\b/)) {
						zlib.gunzip(buff, function(error, data) {
							if (!error) {
								proxysuccess(res.headers, data);
								buff = null;
							}
						});
					} else if (encoding.match(/\bdeflate\b/)) {
						zlib.deflate(buff, function(error, data) {
							if (!error) {
								proxysuccess(res.headers, data);
								buff = null;
							}
						});
					}
				} else {
					proxysuccess(res.headers, data);
				}
			});
		});
		request.on('error', function(e) {
			this.results = config.resmap["404"];
			this.execute("success");
		}.bind(this));
		request.end();
	};
}
module.exports = ProxyAction;