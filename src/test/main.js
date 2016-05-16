var http = require('http');
var http = require('http');
var zlib = require('zlib');
var assert = require('assert');

function add() {
	return Array.prototype.slice.call(arguments).reduce(function(prev, curr) {
		return prev + curr;
	}, 0);
}
describe('add()', function() {
	var tests = [{
		args: [1, 2],
		expected: 3
	}, {
		args: [1, 2, 3],
		expected: 6
	}, {
		args: [1, 2, 3, 4],
		expected: 10
	}];
	tests.forEach(function(test) {
		it('correctly adds ' + test.args.length + ' args', function() {
			var res = add.apply(null, test.args);
			assert.equal(res, test.expected);
		});
	});
});
describe('GET /noticelist', function() {
	var host = "192.168.204.61";
	it('request host', function(done) {
		assert.equal(host, "192.168.204.61");
		done();
	});
	it('/noticelist?pagenum=1&pagesize=1', function(done) {
		var options = {
			hostname: '192.168.204.61',
			port: 80,
			path: '/noticelist?pagenum=1&pagesize=1',
			method: 'GET',
			headers: {
				"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				"Accept-Encoding": "gzip,deflate,sdch", //gzip,deflate,sdch
				"Accept-Language": "zh-CN,zh;q=0.8",
				"Host": "192.168.202.204",
				"Connection": "keep-alive",
				"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36",
				"Cookie": "cuid=%257B%2522userid%2522%253A%25222%2522%252C%2522username%2522%253A%2522karon%2522%257D; tk=cfd4895ade147d4d645832d7d27b370237645d05; PHPSESSID=600012519342696a67a7c1fdd2b50dfa; c_servicetype=1"
			}
		};
		var request = http.request(options, function(res) {
			var size = 0,
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
						buff = chunks[new Buffer("请求失败")];
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
						if (!error) {
							done();
						} else {
							done(error);
						}
						buff.length = 0;
						buff = null;
						request = null;
					});
				} else {
					assert.equal(JSON.parse(buff.toString()).status, 200);
					done();
					buff.length = 0;
					buff = null;
					request = null;
				}
			});
			res.on('error', function(error) {
				if (error) {
					done(error);
				}
				request = null;
			});
		});
		request.once("error", function(error) {
			done(error);
		});
		request.end();
	});
});