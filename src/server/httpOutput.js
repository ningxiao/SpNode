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
const axios = require('axios');
const config = require('../config/main');

function httpfail(response, status, headers, stream, body, zlibs) {
    status = status || 200;
    if (body) {
        if (headers) {
            headers['Content-Length'] = Buffer.byteLength(body);
        } else {
            headers = {
                'Content-Length': Buffer.byteLength(body),
                'Content-Type': 'text/html;charset=utf-8;'
            };
        };
    };
    response.writeHead(status, headers);
    if (stream) {
        if (zlibs) {
            stream.pipe(zlibs).pipe(response);
            return;
        };
        stream.pipe(response);
    } else {
        body && response.write(body);
        response.end();
    };
};
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
    };
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
    };
    if (isNaN(start) && !isNaN(end)) {
        result.Start = totalLength - end;
        result.End = totalLength - 1;
    };
    return result;
};

function ssioutput(rootpath, request, response, status, headers, filepath) {
    fs.readFile(filepath, 'utf-8', function(err, data) {
        if (err) {
            httpfail(response, null, null, null, config.resmap["404"]);
        } else {
            let url = data.match(/file=\"(.*?)\"/);
            if (url) {
                url = `http://${request.headers.host}${url[1]}`;
                axios.get(url, {
                    headers: {
                        cookie: 'BAOFENGID=f51cb095-0c43-4964-f2f9-e100a8d146c0-1495703919015; cid=149570391912199j781zhzvzp; UM_distinctid=15c3eed84bd71-0428fa5f55d855-4e47052e-13c680-15c3eed84bf73b; lastloginname=pangjincai; uid=2fe617c270a2bfdb643ae16624612e98ccf55246; Hm_lvt_034253c5988f5d0fef5c2eaeff95573c=1496227931,1496230159,1496281650,1496300228; bfuid=13123352490181888; bfuname=pangjincai; bf_user_name=pangjincai; bfcsid=cf6ddd5d9023e7b9; SSOStatus=1498903458; st=DE8vF6D_5CNJ0yNN4q5THjKdrfpQC7AZcL7cB8QgFpOsWYncluoFQecC8r1KrkuOiHZMsCE4ze0aPVmHxWFrSg_Q2seHQxW_BQC2v0FT9A4cf6ddd5d9023e7b913cf; loginToken=SNWWWglrKY7QIhlnunUHejYi9bcFpVmVvYfK36WGbKf1YzgG64xl5k-RA2V8TMfz4TqKu4y9_kvm4fTtj8o5SixOuPqPtPCv4dTlMFGq36M92dc81b4aa9ce084b2a2; bfsid=92dc81b4aa9ce084; bfmbind=1; updateinforandomstr=00d5e7f0467c79a071301f865da6c3fb; fid=1191; sid=1496642899503; bfCollects=; Hm_lvt_42fae14cbdb27e5616a621fbc30fcb0e=1496624870,1496631819,1496639648,1496642900; Hm_lpvt_42fae14cbdb27e5616a621fbc30fcb0e=1496644963'
                    }
                }).then((res) => {
                    if (res.status == 200) {
                        data = data.replace(/\<\!\-\-\#(.*?)\-\-\>/ig, res.data);
                    };
                    httpfail(response, status, headers, null, data, null);
                });
            } else {
                httpfail(response, status, headers, null, data, null);
            };
        };
    });
};

function httpOutput(rootpath, filepath, request, response) {
    response.setHeader("Server", "nxiao/V5");
    if (request.method != "GET") {
        httpfail(response, null, null, null, config.resmap["405"]);
        return null;
    };
    fs.stat(filepath, (err, stats) => {
        let head, zlibs, size = stats.size;
        if (err || stats.isDirectory()) { //文件异常或者是一个目录
            httpfail(response, null, null, null, config.resmap["404"]);
            return;
        };
        let extname = path.extname(filepath).slice(1);
        let contenttype = config.mimemap[extname] || "text/plain;charset=utf-8";
        if (request.headers["type"]) {
            httpfail(response, 200, null, null, `{"status":"200","size":${size}}`);
            return;
        };
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
            };
            return;
        };
        let encoding = request.headers['accept-encoding'] || "";
        head = {
            'Content-Type': contenttype
        };
        if (config.ssi && filepath.indexOf(".html") != -1) {
            ssioutput(rootpath, request, response, 200, head, filepath);
        } else {
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
            };
            httpfail(response, 200, head, fs.createReadStream(filepath), null, zlibs);
        };

    });
};
module.exports = httpOutput;