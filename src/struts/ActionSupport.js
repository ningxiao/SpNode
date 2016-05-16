"use strict";
const ServletActionContext = require("./ServletActionContext");
class ActionSupport {
	/**
	 * es6初始化构造函数
	 * @return null
	 */
	constructor(request, response, dispatcher, action) {
		this.callback;
		this.actioninvocation = action;
		this.dispatcher = dispatcher;
		this.context = new ServletActionContext();
		this.context.addEventListener("end", this[action['method']].bind(this));
		this.context.SetResponse(response);
		this.context.SetRequest(request);
	};
	execute(resultname) {
		this.callback = this.context.GetQuery("callback");
		let result = this.actioninvocation['result'];
		let type = result[resultname]['type'];
		this.dispatcher[type].call(this, resultname);
	};
	release() {
		this.context.release();
		this.dispatcher = this.actioninvocation = this.callback = this.actioninvocation = this.context = null;;
	};
}
module.exports = ActionSupport;