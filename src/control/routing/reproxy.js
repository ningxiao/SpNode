"use strict";

function istype(obj) {
	return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
};

module.exports = {
	"name": "proxy",
	"class": (application) => {
		application.context.WriteBuffer(application.datasource);
		application.emancipation();
		application = null;
	}
};