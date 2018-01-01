const fs = require('fs');
const net = require('net');
const crypto = require('crypto');
const seesion = require('./seesion');
const chokidar = require('chokidar');
const PORT = process.argv[3] || 8080;
const env = process.env.NX_SERVER_ENV;
/**
 * 是否监听文件修改然后派发重启工作进程
 * @param  {String} path 监听路径
 * @param  {String} name 监听文件名称
 */
const watch = (path, name) => {
    let type, ready = false;
    let upWatch = (path) => {
        if (ready) {
            type = 'agent-worker-update';
            if (path.indexOf("struts.js") != -1) {
                type = 'agent-worker-action';
            };
            process.send({
                head: type,
                body: {
                    msg: '业务进程更新'
                }
            });
        }
    }
    chokidar.watch(path).on('add', upWatch).on('addDir', upWatch).on('change', upWatch).on('unlink', upWatch).on('unlinkDir', upWatch).on('ready', () => {
        ready = true;
    });
};
const route = {
    session:(body,socket)=>{
        socket.write(JSON.stringify(seesion(body.key,body.value)));
    }
}
/**
 * 开启tcp服务
 * @param  {socket} 
 */
const server = net.createServer((socket) => {
    socket.on('data', (data) => { //将传回的数据md5然后二进制
        let msg =JSON.parse(data);
        if(msg.head in route){
            route[msg.head](msg.body,socket);
        }
    });
    socket.once('close', function (data) {
        this.removeAllListeners();
        console.log('[agent] ', "close:", socket.remoteAddress + ' ' + socket.remotePort);
    });
    socket.once('error', function (err) {
        this.removeAllListeners();
        console.log('[agent] ', "error:", err.toString());
    });
});
server.on('close', () => {
    console.log('[agent] ', "server:", "close");
});
server.on('error', (err) => {
    console.log('[agent] ', "server:", err.toString());
});
server.listen(PORT, '0.0.0.0', () => {
    if (env == "local") { //开发环境开启自动重启
        watch(process.cwd(), ".js");
    };
    process.send({
        head: 'agent-init-success',
        body: {
            pid: process.pid,
            msg: `开启TCP-->127.0.0.1:${PORT}`
        }
    });
});
process.on('message', (msg) => {
    switch (msg.head) {
        case "reloadend":
            break;
        default:
            break;
    };
    console.log('[agent] ', msg);
});