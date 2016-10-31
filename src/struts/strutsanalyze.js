"use strict";
/**
 * 解析当前注入AOP切面
 * @param  {object} cfg struts配置列表
 * @return {object}  解析完毕的对象
 */
function apoanalyze(cfg) {
	let json = {};
	cfg && cfg.forEach((data) => {
		let copy = Object.assign(data);
		copy["class"] = copy["class"].replace(/\./g, '/');
		copy["advice"] = copy["advice"] || "before";
		json[copy.id] = copy;
		delete copy["id"];
	});
	return json;
};
/**
 * 解析当前action
 * @param  {object} cfg action配置
 * @param  {object} aop 配置
 * @return {object} json    组合完毕新的配置
 */
function actionanalyze(cfg, aop) {
	let json = {};
	cfg.forEach((data) => {
		let copy = Object.assign(data);
		let namespace = (copy["namespace"] || "/") + copy["name"];
		copy["class"] = copy["class"].replace(/\./g, '/');
		if ("pointcut" in copy) {
			if (aop[copy["pointcut"]]) {
				copy["pointcut"] = aop[copy["pointcut"]];
			};
		};
		delete copy["namespace"];
		delete copy["name"];
		if (namespace.indexOf("{") != -1) {
			let arr = [];
			namespace = namespace.replace(/\{(.*?)\}/ig, () => {
				arr.push(arguments[1]);
				return '.*?';
			});
			copy["mate"] = arr;
		};
		json[namespace] = copy;
	});
	return json;
};
/**
 * 对struts配置文件进行加工生产
 * @return {object} json   组合完毕新的配置
 */
function strutsanalyze() {
	let data = require('../config/struts');
	let aop = apoanalyze(data["aop"]);
	return actionanalyze(data["action"], aop);
};
module.exports = strutsanalyze;