var util = require('util');
var util = require('util');
var zlib = require('zlib');
var http = require('http');
var events = require('events');

function ProxyRequest() {}
util.inherits(ProxyRequest, events.EventEmitter);
ProxyRequest.prototype.dispatchEvent = function(event) {
	this.emit(event.type, event.data);
}
ProxyRequest.prototype.addEventListener = function(type, fun) {
	this.on(type, fun);
}
ProxyRequest.prototype.request = function(options) {
	var self = this,
		request = http.request(options, function(res) {
			var json, size = 0,
				chunks = [];
			res.on('data', function(chunk) {
				if (res.statusCode == 200) {
					chunks.push(chunk);
					size += chunk.length;
				}
			});
			res.on('end', function() {
				var chunk, buff, coding = res.headers['content-encoding'];
				switch (chunks.length) {
					case 0:
						self.dispatchEvent({
							'type': 'error',
							'data': '返回数据为空'
						});
						return;
						break;
					default:
						buff = new Buffer(size);
						for (var i = 0, pos = 0, l = chunks.length; i < l; i++) {
							chunk = chunks[i];
							chunk.copy(buff, pos);
							pos += chunk.length;
						}
						chunk.length = 0;
						chunk = null;
						chunks.length = 0;
						chunks = null;
						break;
				}
				if (coding && coding.indexOf('gzip') != -1) {
					zlib.gunzip(buff, function(error, data) {
						json = {
							'type': 'error',
							'data': '解压缩错误'
						};
						if (!error) {
							json["type"] = 'end';
							json["data"] = data.toString();
							buff.length = 0;
							buff = null;
							request = null;
						}
						self.dispatchEvent(json);
					});
				} else {
					self.dispatchEvent({
						'type': 'end',
						'data': buff.toString()
					});
				}
			});
			res.on('error', function(error) {
				self.dispatchEvent({
					'type': 'error',
					'data': '代理请求异常' + error.message
				});
				request = null;
			});
		});
	request.end();
}
module.exports = ProxyRequest;