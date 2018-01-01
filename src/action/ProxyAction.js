"use strict";
const config = require('../config');
const ProxyRequest = require('../utils/ProxyRequest');
const ActionSupport = require('../struts/ActionSupport');
class ProxyAction extends ActionSupport {
	/**
	 * es6初始化构造函数
	 * @return null
	 */
	constructor() {
		super();
	};
	ismobile() {

	};
	ssoAction() {
		let proxyhttp = new ProxyRequest();
		let options = {
			hostname: 'sso.baofeng.net',
			port: 80,
			path: '/api/main/login',
			method: 'GET',
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Connection': 'keep-alive',
				'Cookie': 'lastloginname=13681182514; BOXID=80d7ebfa0a5c9090116abd03860fd3e1; VISIT=1; DATE=1448882317; LASTDAYS=0; PHPSESSID=655c501b85ed28d52b7924ec4c3f29aa; Hm_lvt_3db4e6c080c584499653380ee17343be=1449801182,1449801195; Hm_lpvt_3db4e6c080c584499653380ee17343be=1449801234',
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36'
			}
		};
		proxyhttp.once("error", (err) => {
			this.datasource = config.resmap["404"];
			this.execute("success");
		});
		proxyhttp.once("end", (buff) => {
			let headers = proxyhttp.request.headers;
			let name = this.context.GetQuery("name") || '屌毛';
			let data = buff.toString().replace(/(href=")/g, 'href="http://sso.baofeng.net').replace(/(src=")/g, 'src="http://sso.baofeng.net').replace(/(暴风影音 - 用户登录)/, `暴风影音 -${name}`);
			if ('content-encoding' in headers) {
				delete headers['content-encoding'];
			};
			if ('transfer-encoding' in headers) {
				delete headers['transfer-encoding'];
			};
			this.datasource = data.replace(/(\<\/body\>)/, `<script>setTimeout(function(){document.getElementById("loginname").value='${name}';document.getElementById("password").value=123456789;SSO.Login()},200);</script>`);
			this.context.heads = headers;
			this.execute("success");
		});
		proxyhttp.send(options);
	};
}
module.exports = ProxyAction;