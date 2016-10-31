"use strict";
class Verify {
	constructor() {};
	ismobile(agent) {
		if (/iPhone|iPad|iPod/i.test(agent)) {
			return true;
		};
		return false;
	};
};
module.exports = Verify;