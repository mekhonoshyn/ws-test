//var http = require('http');
//var nodeStatic = require('node-static');
//var nsServer = new nodeStatic.Server('.');

var _log = require('./static/general/log');

var models = {};

//http.createServer(function (req, res) {
//    nsServer.serve(req, res);
//}).listen(8081);

require('./static/general/setup');
require('./static/general/wss')(8082, models);

_log('server is listening ports 8081, 8082');