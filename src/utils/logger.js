"use strict";
/**
 * log4js 日志输出配置文件
 * @type {exports}
 */
const log4js = require('log4js');
const config = require('../config/main');
log4js.configure({
    appenders: [{
        type: 'console'
    }, {
        type: 'dateFile',
        filename: config.log,
        pattern: "_yyyy-MM-dd",
        maxLogSize: 1024,
        alwaysIncludePattern: false,
        backups: 4,
        category: 'logger'
    }],
    replaceConsole: true
});
module.exports = log4js.getLogger('logger');