var zlib = require('zlib');
var http = require('http');
var events = require('events');
class ProxyRequest extends events {
    /**
     * es6初始化构造函数
     * @return null
     */
    constructor() {
        super();
        this.request;
    };
    send(options) {
        let proxyhttp = http.request(options, (res) => {
            let size = 0;
            let chunks = [];
            res.on('data', (chunk) => {
                if (res.statusCode == 200) {
                    chunks.push(chunk);
                    size += chunk.length;
                };
            });
            res.once('end', () => {
                let chunk, buff, coding = res.headers['content-encoding'];
                this.request = res;
                switch (chunks.length) {
                    case 0:
                        this.emit("error", '返回数据为空');
                        break;
                    default:
                        buff = new Buffer(size);
                        for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
                            chunk = chunks[i];
                            chunk.copy(buff, pos);
                            pos += chunk.length;
                        };
                        chunk = null;
                        chunks = null;
                        break;
                };
                if (coding && coding.indexOf('gzip') != -1) {
                    zlib.gunzip(buff, (error, data) => {
                        let json = {
                            'type': 'error',
                            'data': '解压缩错误'
                        };
                        if (!error) {
                            json["type"] = 'end';
                            json["data"] = data;
                        };
                        buff = null;
                        coding = null;
                        this.emit(json["type"], json["data"]);
                    });
                } else {
                    this.emit("end", buff);
                };
            });
            res.once('error', (error) => {
                this.emit("error", '代理请求异常' + error.message);
            });
        });
        proxyhttp.setTimeout(2000, () => {
            this.emit("error", '代理请求超时');
        });
        proxyhttp.on('error', (e) => {
            this.emit("error", e.message);
        });
        proxyhttp.end();
    };
};
module.exports = ProxyRequest;