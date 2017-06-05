"use strict";
const fs = require("fs");
const url = require("url");
const config = require('../../config/main');
module.exports = {
    "name": "html",
    "class": (application) => {
        let req = application.context.request;
        let home = config.home[req.headers.host];
        let routing = application.actionconfig.routing[application.command];
        let file, pathname = routing.tmpl;
        file = home + pathname;
        fs.access(file, fs.constants.R_OK | fs.constants.W_OK, (err) => {
            if (err) {
                file = home + "/404.html";
            };
            fs.readFile(file, 'utf-8', function(err, str) {
                if (!err) {
                    if (routing.mark) {
                        str = str.replace(/\{\*(.*?)\*\}/ig, function() {
                            let key = arguments[1].replace(/(^\s+)|(\s+$)/g, "");
                            if (application.datasource[key]) {
                                return application.datasource[key];
                            };
                            return "";
                        });
                    };
                    application.context.SetHeads("Content-Type", "text/html;charset=utf-8");
                    application.context.WriteBuffer(str);
                    application.emancipation();
                    application = null;
                };
            });
        });
    }
};