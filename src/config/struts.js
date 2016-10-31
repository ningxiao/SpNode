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
		"routing": {
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
		"name": "test",
		"namespace": "/",
		"method": "testAction",
		"type": "GET",
		"class": "action.UsersAction",
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
		"pointcut": "adminpointcut",
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
		"pointcut": "adminpointcut",
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
	}]
};