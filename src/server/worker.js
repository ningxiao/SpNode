const http = require('http');
const net = require('net');
const config = require('../config');
const CtlRouter = require('../control');
const router = new CtlRouter();
const client = net.createConnection(process.argv[3], '127.0.0.1').once('connect', () => {
    console.log('[worker]', 'tcp agent connect');
}).once('close', (data) => {
    console.log('[worker]', 'tcp agent close');
}).once('error', (er) => {
    console.log('[worker]', 'tcp agent error');
});
const agent = {
    dispatchEvent:(head) => {
        return new Promise((resolve, reject) => {
            let callback = (er) => {
                resolve({
                    head: "AgentError",
                    body: {
                        code:500,
                        text:"Agent代理请求异常"
                    }
                });
            };
            client.once('data', (data) => {
                client.removeListener('error', callback);
                resolve(JSON.parse(data));
            });
            client.once('error', callback);
            client.write(JSON.stringify(head));
        });
    }
};
const server = http.createServer((request, response) => {
    router.proxy(request, response,agent);
});
server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.on('error', function (error) {
    if (error.code == 'EADDRINUSE') {
        console.log('服务端口被占用');
    }
});
server.listen(config.port);
process.on('exit', (err) => {
    console.log('[worker]', "业务进程退出");
});
process.on('message', (msg) => {
    switch (msg.head) {
        case "close":
            client && client.end();
            break;
        case 'upAction':
            router.upstruts(msg.body);
            break;
        default:
            break;
    };
});
process.on('uncaughtException', (err) => {
    client && client.end();
    console.log('[worker]', err.toString());
});
/**
 * 
 */
process.on('disconnect', () => {
    client && client.end();
});