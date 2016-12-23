"use strict";
class Verify {
	constructor() {};
	ismobile(agent) {
		if (/iPhone|iPad|iPod/i.test(agent)) {
			return true;
		};
		return false;
	};
	log(agent) {
		console.log("AOP-------log", agent);
	};
};
module.exports = Verify;