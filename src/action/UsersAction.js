"use strict";
const fs = require('fs');
const axios = require('axios');
const sql = require('../config/sql');
const mysql = require('../model/mysql');
const config = require('../config/main');
const logger = require('../utils/logger.js');
const childprocess = require('child_process');
const ActionSupport = require('../struts/ActionSupport');
class UsersAction extends ActionSupport {
    /**
     * es6初始化构造函数
     * @return null
     */
    constructor(servlet, request, response, method) {
        super(servlet, request, response, method);
    };
    ismobile() {

    };
    userlog(data) {
        console.log("UsersAction-------log", data);
    };
    gruntAction() {
        let path = config.shell + 'deploy.sh';
        let type = this.context.GetQuery("type");
        let args = ['-T', type, '-N', 'dest.zip'];
        if (type) {
            childprocess.execFile(path, args, (err, stdout, stderr) => {
                if (err) {
                    this.datasource = err;
                } else {
                    this.datasource = stdout + stderr;
                };
                this.execute("success");
            });
        } else {
            this.datasource = "请传入执行类型"
            this.execute("success");
        };
    };
    testAction() {
        this.datasource = '{"name":"宁肖","age":27,"mobile":"13681182514"}';
        this.userlog(this.datasource);
        this.execute("success");
    };
    playAction() {
        this.datasource = {
            "title": "开启ejs缓存"
        };
        this.execute("success");
    };
    mplayAction() {
        this.datasource = {
            "title": "开启ejs缓存"
        };
        this.execute("success");
    };
    timeoutAction() {
        this.datasource = '{"name":"宁肖","age":27,"mobile":"13681182514"}';
        setTimeout(() => {
            this.execute("success");
        }, 5000);
    };
    postAction() {
        let data;
        let usname = this.context.GetQuery("usname");
        let mobile = this.context.GetQuery("mobile");
        let sign = this.context.GetQuery("sign");
        let callback = this.context.GetQuery("callback");
        if (sign == "7068c37999c481d783943745d8") {
            data = `{"status":"1","name":"${usname}","age":27,"mobile":"${mobile}"}`;
        } else {
            data = '{"status":"0","msgcode":"102"}';
        };
        if (callback) {
            data = callback + "(" + data + ");"
        };
        this.datasource = data;
        this.execute("success");
    };
    signAction() {
        let callback = this.context.GetQuery("callback");
        this.datasource = callback + '({"status":"1","sign":"7068c37999c481d783943745d8"})';
        this.execute("success");
    };
    httpsAction() {
        let name = this.context.GetQuery("name");
        let device = "PC电脑";
        this.context.SetCookie("login", "nxiao");
        if (name) {
            if (this.ismobile(this.context.UserAgent)) {
                device = "移动端设备";
            };
            this.datasource = {
                "title": "401.1 - 未授权：登录失败",
                "device": device
            };
            this.execute("index");
            return;
        };
        this.datasource = '{"name":"宁肖","age":27,"mobile":"13681182514"}';
        this.execute("success");
    };
    ticketsAction() {
        let id = this.context.GetQuery("id");
        let login = this.context.GetCookie("login");
        let code = 500;
        let message = "登录失败";
        if (login == "nxiao") {
            mysql.pool(sql.WHERE_USER, [id], (err, results) => {
                let data = "[]";
                if (!err && results.length) {
                    data = JSON.stringify(results);
                    code = 200;
                    message = "登录成功";
                };
                this.datasource = `{"status":${code},"message":"${message}","data":${data}}`;
                this.execute("success");
            });
        } else {
            this.datasource = `{"status":${code},"message":"${message}"}`;
            this.execute("success");
        };
    };
    getaddrAction() {
        let callback = this.context.GetQuery("callback");
        let json = JSON.stringify({ status: 1, tel: "13681182514", name: "宁肖", postcode: "230102", addr: "北京市朝阳区三间房乡" });
        this.datasource = callback + `(${json})`;
        this.execute("success");
    };
    updateaddrAction() {
        let callback = this.context.GetQuery("callback");
        this.datasource = callback + '({"status": 1})';
        this.execute("success");
    };
    htmlAction() {
        let userinfo = ['<script type="text/javascript">var userinfo=['];
        let cookie = this.context.request.headers.cookie;
        let proxy = (url) => {
            return axios.get(url, {
                headers: {
                    cookie: cookie
                }
            }).then((res) => {
                if (res.status == 200) {
                    return JSON.stringify(res.data);
                };
                return "";
            }).catch(function(error) {
                return "";
            });
        };
        axios.all([
            proxy('http://user.baofeng.net/user/?a=getinfo&from=web'),
            proxy('http://shop.baofeng.com/order/?a=wuxianUserSignInfo')
        ]).then((res) => {
            userinfo.push(res.join(","), '];var now = ' + Date.now() + ';</script>');
            this.datasource = { "userinfo": userinfo.join("") };
            this.execute("success");
        });
    };
};
module.exports = UsersAction;