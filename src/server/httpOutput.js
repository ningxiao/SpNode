"use strict";
/*********************************************************************************
 * httpOutput.js
 *
 * http服务模块
 *
 * @version 0.01
 * @author nxiao <363305175@qq.com>
 * @license {@link https://github.com/ningxiao}
 *********************************************************************************/
const fs = require('fs');
const zlib = require("zlib");
const path = require('path');
const config = require('../config/main');

function httpfail(response, status, headers, stream, body, zlibs) {
    status = status || 200;
    if (body) {
        headers = {
            'Content-Length': body.length,
            'Content-Type': 'text/html;charset=utf-8;'
        }
    }
    if (headers) {
        let map = {
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "type,Range"
        }
        for (var key in map) {
            if (!(key in headers)) {
                headers[key] = map[key];
            }
        };
    }
    response.writeHead(status, headers);
    if (stream) {
        if (zlibs) {
            stream.pipe(zlibs).pipe(response);
            return;
        }
        stream.pipe(response);
    } else {
        body && response.write(body);
        response.end();
    }
}
/**
 * Example of the method &apos;split&apos; with regular expression.
 *
 * Input: bytes=100-200
 * Output: [null, 100, 200, null]
 *
 * Input: bytes=-200
 * Output: [null, null, 200, null]
 * @param  {[type]} range       [description]
 * @param  {[type]} totalLength [description]
 * @return {[type]}             [description]
 */
function readRangeHeader(range, totalLength) {
    if (range == null || range.length == 0) {
        return null;
    }
    let array = range.split(/bytes=([0-9]*)-([0-9]*)/);
    let start = parseInt(array[1]);
    let end = parseInt(array[2]);
    let result = {
        Start: isNaN(start) ? 0 : start,
        End: isNaN(end) ? (totalLength - 1) : end
    };
    if (!isNaN(start) && isNaN(end)) {
        result.Start = start;
        result.End = totalLength - 1;
    }
    if (isNaN(start) && !isNaN(end)) {
        result.Start = totalLength - end;
        result.End = totalLength - 1;
    }
    return result;
};


function httpOutput(filepath, request, response) {
    response.setHeader("Server", "nxiao/V5");
    if (request.method != "GET") {
        httpfail(response, null, null, null, config.resmap["405"]);
        return null;
    }
    fs.stat(filepath, function(err, stats) {
        let head, zlibs, size = stats.size;
        if (err) {
            httpfail(response, null, null, null, config.resmap["404"]);
            return;
        }
        let extname = path.extname(filepath).slice(1);
        let contenttype = config.mimemap[extname] || "text/plain;charset=utf-8";
        if (request.headers["type"]) {
            httpfail(response, 200, null, null, new Buffer(`{"status":"200","size":${size}}`));
            return;
        }
        let range = readRangeHeader(request.headers["range"], size);
        if (range) {
            let start = range.Start;
            let end = range.End;
            if (start >= size || end >= size) {
                head = {
                    'Content-Range': `bytes * /${size}`
                };
                httpfail(response, 416, headers);
            } else {
                head = {
                    'Content-Range': `bytes ${start}-${end}/${size}`,
                    'Content-Length': start == end ? 0 : (end - start + 1),
                    'Content-Type': contenttype,
                    'Accept-Ranges': 'bytes',
                    'Cache-Control': 'no-cache'
                };
                httpfail(response, 206, head, fs.createReadStream(filepath, {
                    'start': start,
                    'end': end
                }));
            }
            return;
        }
        let encoding = request.headers['accept-encoding'] || "";
        head = {
            'Content-Type': contenttype
        };
        if (extname.match(config.iszip) && encoding) {
            if (encoding.match(/\bgzip\b/)) {
                zlibs = zlib.createGzip();
                head['Content-Encoding'] = 'gzip';
            } else if (encoding.match(/\bdeflate\b/)) {
                zlibs = zlib.createDeflate();
                head['Content-Encoding'] = 'deflate';
            }
        } else {
            head['Content-Length'] = size;
        }
        httpfail(response, 200, head, fs.createReadStream(filepath), null, zlibs);
    });
};
module.exports = httpOutput;