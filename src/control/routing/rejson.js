"use strict";

function istype(obj) {
	return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
};

module.exports = {
	"name": "json",
	"class": (application) => {
		application.context.SetHeads("Content-Type", "application/json;charset=utf-8");
		application.context.SetHeads("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		application.context.SetHeads("Access-Control-Allow-Origin", "*");
		application.context.WriteBuffer(application.datasource);
		application.emancipation();
		application = null;
	}
};