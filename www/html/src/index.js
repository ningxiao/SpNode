var $ = require("jquery");
//var user = require('./module/user');
import user from "./module/user";
var utils = require('./utils/utils');
var template = require('./utils/template');
// import {
// 	sum,
// 	square,
// 	variable
// } from "./module/user.js";
console.log(user); // Object
console.log(user.variable); // 8
console.log(user.sum(1)); // 7
console.log(user.square(5)); // 25
console.log("---");
console.log(utils.provide("baofeng.base"), $("#doc"));