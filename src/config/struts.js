module.exports = {
	"aop": [{
		"id": "adminpointcut",
		"class": "aspect.Verify",
		"method": "ismobile",
		"joinpoint": "ismobile",
		"advice": "replace"
	}],
	"action": [{
		"name": "index",
		"namespace": "/",
		"method": "httpsAction",
		"type": "GET",
		"class": "action.UsersAction",
		"pointcut": "adminpointcut",
		"result": {
			"success": {
				"type": "json"
			},
			"index": {
				"type": "freemarker",
				"param": "list",
				"value": "404.ejs"
			}
		}
	}, {
		"name": "log",
		"namespace": "/",
		"method": "logAction",
		"type": "GET",
		"class": "action.UsersAction",
		"result": {
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
		"pointcut": "adminpointcut",
		"result": {
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
		"pointcut": "adminpointcut",
		"result": {
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
		"result": {
			"success": {
				"type": "json"
			}
		}
	}, {
		"name": "api/theatre/index",
		"namespace": "/",
		"method": "indexAction",
		"type": "GET",
		"class": "action.UsersAction",
		"result": {
			"success": {
				"type": "json"
			}
		}
	}, {
		"name": "api/theatre/city",
		"namespace": "/",
		"method": "cityAction",
		"type": "GET",
		"class": "action.UsersAction",
		"result": {
			"success": {
				"type": "json"
			}
		}
	}, {
		"name": "api/room/index",
		"namespace": "/",
		"method": "roomAction",
		"type": "GET",
		"class": "action.UsersAction",
		"result": {
			"success": {
				"type": "json"
			}
		}
	}, {
		"name": "size",
		"namespace": "/",
		"method": "sizeAction",
		"type": "GET",
		"class": "action.HlsAction",
		"result": {
			"success": {
				"type": "json"
			}
		}
	}, {
		"name": "tick",
		"namespace": "/",
		"method": "ticketsAction",
		"type": "GET",
		"class": "action.MobileAction",
		"result": {
			"success": {
				"type": "json"
			}
		}
	}, {
		"name": "quire",
		"namespace": "/",
		"method": "quireAction",
		"type": "GET",
		"class": "action.MobileAction",
		"result": {
			"success": {
				"type": "json"
			}
		}
	}, {
		"name": "route",
		"namespace": "/",
		"method": "routeAction",
		"type": "GET",
		"class": "action.MobileAction",
		"result": {
			"success": {
				"type": "json"
			}
		}
	}, {
		"name": "play/[0-9]*/(.*).html", //play/[0-9]*/play-[0-9]*-drama-[0-9]*.html
		"namespace": "/",
		"method": "playAction",
		"type": "GET",
		"class": "action.MobileAction",
		"result": {
			"success": {
				"type": "freemarker",
				"param": "list",
				"value": "play.ejs"
			}
		}
	}, {
		"name": "micv/[0-9]*/(.*).html", //play/[0-9]*/play-[0-9]*-drama-[0-9]*.html
		"namespace": "/",
		"method": "mplayAction",
		"type": "GET",
		"class": "action.MobileAction",
		"result": {
			"success": {
				"type": "freemarker",
				"value": "mplay.ejs"
			}
		}
	}]
};