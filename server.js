var http = require('http');
//var fs = require('fs');
var fileServer = new (require('node-static')).Server('.');

//var wsServer = new (new require('ws')).Server({
//    port: 8082
//});
//
//var clients = {};
//
//wsServer.on('connection', function (ws) {
//    var id = Math.random();
//
//    clients[id] = ws;
//
//    console.log("новое соединение " + id);
//
//    ws.on('message', function (message) {
//        console.log('получено сообщение ' + message);
//
//        for (var key in clients) {
//            clients[key].send(message);
//        }
//    });
//
//    ws.on('close', function () {
//        console.log('соединение закрыто ' + id);
//
//        delete clients[id];
//    });
//});

http.createServer(function (req, res) {
    fileServer.serve(req, res);
}).listen(8081);

console.log("Сервер запущен на портах 8081, 8082");