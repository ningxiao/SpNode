"use strict";
const ServletActionContext = require("./ServletActionContext");
class ActionSupport {
	/**
	 * es6初始化构造函数
	 * @return null
	 */
	constructor(req, res, dispatcher, config, agent) {
		this._datasource;
		this._cmd = "success";
		this.agent;
		this.context;
		this.dispatcher;
		this.actionconfig;
	};
	activation(req, res, dispatcher, config, agent){
		this.agent = agent;
		this.actionconfig = config;
		this.dispatcher = dispatcher;
		this.context = new ServletActionContext();
		this.context.once("end", () => {
			this[config['method']]();
		});
		this.context.SetAgent(agent);
		this.context.SetResponse(res);
		this.context.SetRequest(req);
	}
	execute(cmd) {
		let data = this.actionconfig.routing;
		let type = data[cmd]['type'];
		if (type) {
			this._cmd = cmd;
			this.dispatcher[type](this);
		};
	};
	emancipation() {
		this.context.emancipation();
		this.dispatcher = this.actionconfig = this.context = this._datasource = this.agent = this._cmd = null;
	};
	get command() {
		return this._cmd;
	};
	get datasource() {
		return this._datasource;
	};
	set datasource(data) {
		this._datasource = data;
	};
}
module.exports = ActionSupport;