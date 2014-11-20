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

_log(process.hrtime());

_log('server is listening ports 8081, 8082');


//var time,
//    diff,
//    noop = function () {},
//    hrtime = process.hrtime,
//    i = 1e6,
//    k = 0;
//
//time = process.hrtime();
////setTimeout(noop, 100);    : 1.65
////process.hrtime();         : 0.9
////process.hrtime(time);         : 1.14
//
//while (i--) {
////    k++;
//    hrtime(time);
//}
//
//diff = process.hrtime(time);
//
//_log((diff[0] * 1e9 + diff[1]) * 1e-9);

//function _tick(fn, delay) {
//    setTimeout(function () {
//        fn();
//
//        _tick(fn, delay);
//    }, delay);
//}
//
//var time = process.hrtime(),
//    diff;
//
//_tick(function () {
//    diff = process.hrtime(time);
//
////    _log((diff[0] * 1e9 + diff[1]) * 1e-6);
//    _log(diff[0] + diff[1] * 1e-9);
//}, 100);



var NanoTimer = require('nanotimer');

var timer = new NanoTimer();

var time = process.hrtime(),
    diff,
    __log = function () {
        diff = process.hrtime(time);

        time = process.hrtime();

        console.log(Math.abs(diff[1] * 1e-6));
    };

timer.setInterval(__log, [], '1s');
