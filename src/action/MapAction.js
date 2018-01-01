"use strict";
const http = require('http');
const config = require('../config');
const ActionSupport = require('../struts/ActionSupport');
class MapAction extends ActionSupport {
	/**
	 * es6初始化构造函数
	 * @return null
	 */
	constructor() {
		super();
	};
	ismobile() {

	};
	gpscity(x, y) {
		let errcallback = () => {
			this.datasource = '{"status":"404","message":"获取国标位置错误"}';
			this.execute("success");
		};
		http.get(`http://api.map.baidu.com/geocoder/v2/?ak=btsVVWf0TM1zUBEbzFz6QqWF&location=${y},${x}&output=json&pois=1`, (res) => {
			res.setEncoding('utf8');
			res.on('data', (data) => {
				data = JSON.parse(data);
				if (res.statusCode == 200 && data["status"] == 0) {
					let result = data["result"];
					this.datasource = `{"status":"200","lng":"${result.location.lng}","lat":"${result.location.lat}","province":"${result.addressComponent.province}","city":"${result.addressComponent.city}","district":"${result.addressComponent.district}","addr":"${result.pois[0].addr}"}`;
					this.execute("success");
					return;
				};
				errcallback();
			});
		}).on('error', errcallback);
	};
	gpsTransform(x, y, callback) {
		let errcallback = () => {
			this.datasource = '{"status":"404","message":"GPS转换失败"}';
			this.execute("success");
		};
		http.get(`http://api.map.baidu.com/geoconv/v1/?ak=btsVVWf0TM1zUBEbzFz6QqWF&coords=${x},${y}&from=1&to=5&output=json`, (res) => {
			res.setEncoding('utf8');
			res.on('data', (data) => {
				data = JSON.parse(data);
				if (res.statusCode == 200 && data["status"] == 0) {
					let location = data["result"][0];
					this.gpscity(location.x, location.y);
					return;
				};
				errcallback();
			});
		}).on('error', errcallback);
	};
	addresstogps(city, address) {
		let errcallback = () => {
			this.datasource = '{"status":"404","message":"地址转换GPS失败"}';
			this.execute("success");
		};
		http.get(`http://api.map.baidu.com/geocoder/v2/?ak=btsVVWf0TM1zUBEbzFz6QqWF&output=json&address=${address}&city=${city}`, (res) => {
			res.setEncoding('utf8');
			res.on('data', (data) => {
				data = JSON.parse(data);
				if (res.statusCode == 200 && data["status"] == 0) {
					let location = data["result"]["location"];
					this.datasource = `{"status":"200","lng":"${location.lng}","lat":"${location.lat}"}`;
					this.execute("success");
					return;
				};
				errcallback();
			});
		}).on('error', errcallback);
	};
	distancegps(origins, destinations) {
		let errcallback = () => {
			this.datasource = '{"status":"404","message":"计算距离错误"}';
			this.execute("success");
		};
		http.get(`http://api.map.baidu.com/direction/v1/routematrix?ak=btsVVWf0TM1zUBEbzFz6QqWF&output=json&mode=walking&origins=${origins}&destinations=${destinations}`, (res) => {
			res.setEncoding('utf8');
			res.on('data', (data) => {
				data = JSON.parse(data);
				if (res.statusCode == 200 && data["status"] == 0) {
					let elements = data["result"]["elements"][0];
					if (elements["status"]) {
						errcallback();
					} else {
						let distance = elements["distance"];
						this.datasource = `{"status":"200","distance":"${distance.text}"}`;
						this.execute("success");
					};
					return;
				};
				errcallback();
			});
		}).on('error', errcallback);
	};
	distanceByLatLon(lat1, lon1, lat2, lon2) {
		function rad(d) {
			return d * Math.PI / 180.0;
		};
		let radLat1 = rad(lat1);
		let radLat2 = rad(lat2);
		let a = radLat1 - radLat2;
		let b = rad(lon1) - rad(lon2);
		let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
		s = s * 6378.137;
		s *= 1000;
		return Math.floor(s);
	};
	/**
	 * 更具传入地址计算距离
	 * 1、先对每个地址进行经纬度转换请求
	 * 2、在对起始于结束的经纬度进行球面距离计算
	 * @param  {String} origins      起始地名
	 * @param  {String} destinations 结束地名
	 * @return {json}              {"status":"200","unit":"m","distance":"200"}
	 */
	sizegps(origins, destinations) {
		let promises = [origins, destinations].map((address, index) => {
			return new Promise((resolve, reject) => {
				http.get(`http://api.map.baidu.com/geocoder/v2/?ak=btsVVWf0TM1zUBEbzFz6QqWF&output=json&address=${address}`, (res) => {
					res.setEncoding('utf8');
					res.on('data', function(data) {
						data = JSON.parse(data);
						if (res.statusCode == 200 && data["status"] == 0) {
							let location = data["result"]["location"];
							return resolve(location);
						};
						return reject('{"status": "404","message": "计算距离错误"}');
					});
				}).on('error', function() {
					return reject('{"status": "404","message": "计算距离错误"}');
				});
			});
		});
		Promise.all(promises).then((posts) => {
			let distance = this.distanceByLatLon(posts[0]["lat"], posts[0]["lng"], posts[1]["lat"], posts[1]["lng"]);
			this.datasource = `{"status":"200","unit":"m","distance":"${distance}"}`;
			this.execute("success");
		}).catch((reason) => {
			this.datasource = reason;
			this.execute("success");
		});
	};
	districtAction() {
		let type = this.context.GetQuery("type");
		if (type == "city") {
			let address = encodeURIComponent(this.context.GetQuery("address"));
			let city = encodeURIComponent(this.context.GetQuery("city"));
			this.addresstogps(city, address);
		} else if (type == "gps") {
			let x = this.context.GetQuery("x");
			let y = this.context.GetQuery("y");
			this.gpsTransform(x, y);
		} else if (type == "len") {
			let origins = encodeURIComponent(this.context.GetQuery("origins"));
			let destinations = encodeURIComponent(this.context.GetQuery("destinations"));
			this.distancegps(origins, destinations);
		} else if (type == "size") {
			let origins = encodeURIComponent(this.context.GetQuery("origins"));
			let destinations = encodeURIComponent(this.context.GetQuery("destinations"));
			if (origins && destinations) {
				this.sizegps(origins, destinations);
				return;
			};
			this.datasource = '{"status":"404","message":"传入参数错误"}';
			this.execute("success");
		} else {
			this.datasource = '{"status":"404","message":"需求不明确"}';
			this.execute("success");
		};
	};
}
module.exports = MapAction;