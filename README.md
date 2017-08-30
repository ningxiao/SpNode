## 简介

SpNode主要是利用NodeJS实现动态服务器

## 特点
1. 请求处理借鉴java成熟框架
    1. 实现类似于Struts框架对Action请求拦截调用与调用对应的处理类。
    2. 实现Spring对处理Action类可以动态注入AOP面向切面拦截处理。
    3. 请求与Action处理通过配置文件进行自动挂钩处理。
2. 服务进程使用一主多从的模式实现多核处理，工作进程自动重启。
3. 框架默认实现了动态与静态服务分离。
4. 该项目使用ES6语法。

## 目录结构
```
├── package.json (依赖配置)
├── public (前端js开发目录)
├── src
│   ├── action (拦截请求处理)
│   │   ├── MapAction.js
│   │   ├── ProxyAction.js
│   │   └── UsersAction.js
│   ├── aspect (验证动态注入)
│   │   └── Verify.js
│   ├── config (配置目录)
│   │   ├── db.js
│   │   ├── guard.json
│   │   ├── main.js
│   │   ├── sql.js
│   │   └── struts.js
│   ├── control (控制器)
│   │   ├── ctlrouter.js
│   │   └── routing (不同类型返回处理)
│   │       ├── rehtml.js
│   │       ├── rejson.js
│   │       ├── reproxy.js
│   │       └── retmpl.js
│   ├── guard.js (模拟pm2的实现)
│   ├── logs (日志模块)
│   │   └── log.log
│   ├── main.js (启动文件)
│   ├── main.json (pm2启动配置)
│   ├── model (数据库)
│   │   └── mysql.js
│   ├── server
│   │   ├── httpOutput.js
│   │   └── httpServer.js
│   ├── shell
│   │   ├── catvideo.sh
│   │   └── deploy.sh
│   ├── struts 
│   │   ├── ActionSupport.js
│   │   ├── ServletActionContext.js
│   │   └── strutsanalyze.js
│   ├── test (单元测试)
│   │   └── main.js
│   ├── utils (工具包)
│   │   ├── logger.js
│   │   ├── ProxyRequest.js
│   │   ├── sign.js
│   │   ├── thread.js
│   │   └── utils.js
│   └── view (模板)
│       ├── 404.ejs
│       ├── mplay.ejs
│       └── play.ejs
└── www
    └── html (静态资源目录)
```
## 注意

 1. 安装NODEJS(版本6.9以上)
 2. 下载SpNode框架开启读写权限
 3. 80端口是否被占用

## 启动流程图
```
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

## 项目启动(也可以pm2启动)

```
cd src
sudo node main.js 或者 sudo pm2 start main.json
```
## 备注

本人会不断更具研究项目进行更新(363305175)。


