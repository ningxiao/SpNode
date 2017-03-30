module.exports = {
	"aop": [{ //AOP注入实例
		"id": "adminpointcut",
		"class": "aspect.Verify",
		"method": "ismobile",
		"joinpoint": "ismobile",
		"advice": "replace"
	}, { //AOP注入请求结束之后读取输出数据
		"id": "aoplog",
		"class": "aspect.Verify",
		"method": "log",
		"joinpoint": "userlog",
		"advice": "before"
	}],
	"action": [{
		"name": "index", //路由
		"namespace": "/", //命名空间
		"method": "httpsAction", //路由对应处理类对应方法
		"type": "GET", //请求模式
		"class": "action.UsersAction", //路由处理类
		"pointcut": "adminpointcut", //使用aop注入
		"routing": { //指令success返回
			"success": { //请求成功返回josn
				"type": "json"
			},
			"index": { //指令index调用模板渲染
				"type": "freemarker",
				"param": "list",
				"value": "404.ejs"
			}
		}
	}, {
		"name": "grunt",
		"namespace": "/",
		"method": "gruntAction",
		"type": "GET",
		"class": "action.UsersAction",
		"routing": {
			"success": {
				"type": "json"
			}
		}
	}, {
		"name": "cat",
		"namespace": "/",
		"method": "catvideo",
		"type": "GET",
		"class": "action.UsersAction",
		"routing": {
			"success": {
				"type": "json"
			}
		}
	}, {
		"name": "test",
		"namespace": "/",
		"method": "testAction",
		"type": "GET",
		"class": "action.UsersAction",
		"pointcut": "aoplog", //使用aop注入日志写入
		"routing": {
			"success": {
				"type": "json"
			}
		}
	}, {
		"name": "tickets",
		"namespace": "/",
		"method": "ticketsAction",
		"type": "GET",
		"class": "action.UsersAction",
		"routing": {
			"success": {
				"type": "json"
			}
		}
	}, {
		"name": "timeout",
		"namespace": "/",
		"method": "timeoutAction",
		"type": "GET",
		"class": "action.UsersAction",
		"routing": {
			"success": {
				"type": "json"
			}
		}
	}, {
		"name": "actionpost",
		"namespace": "/",
		"method": "postAction",
		"type": "GET",
		"class": "action.UsersAction",
		"routing": {
			"success": {
				"type": "json"
			}
		}
	}, {
		"name": "ssobf",
		"namespace": "/",
		"method": "ssoAction",
		"type": "GET",
		"class": "action.ProxyAction",
		"routing": {
			"success": {
				"type": "proxy"
			}
		}
	}, {
		"name": "locate",
		"namespace": "/",
		"method": "districtAction",
		"type": "GET",
		"class": "action.MapAction",
		"routing": {
			"success": {
				"type": "json"
			}
		}
	}, {
		"name": "play/[0-9]*/(.*).html", //play/[0-9]*/play-[0-9]*-drama-[0-9]*.html
		"namespace": "/",
		"method": "playAction",
		"type": "GET",
		"class": "action.UsersAction",
		"routing": {
			"success": {
				"type": "freemarker",
				"param": "list",
				"value": "play.ejs"
			}
		}
	}, {
		"name": "micv/[0-9]*/(.*).html", //micv/1/micv-1-37-vid-3242614.html
		"namespace": "/",
		"method": "mplayAction",
		"type": "GET",
		"class": "action.UsersAction",
		"routing": {
			"success": {
				"type": "freemarker",
				"param": "list",
				"value": "mplay.ejs"
			}
		}
	}]
};