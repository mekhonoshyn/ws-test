//var http = require('http');
//var nodeStatic = require('node-static');
//var nsServer = new nodeStatic.Server('.');

var _print = require('./static/general/print');

//http.createServer(function (req, res) {
//    nsServer.serve(req, res);
//}).listen(8081);

require('./static/general/setup');
require('./static/server/wss')(8082);

_print('server is listening ports 8081, 8082');

var worldDateTime = require('./static/server/DateTime')([
    {
        YY: 2014,
        MM: 12,
        DD: 31,
        hh: 23,
        mm: 59,
        ss: 55
    },
    {
        YY: 2014,
        MM: 11,
        DD: 20,
        hh: 15,
        mm: 48,
        ss: 45
    },
    null,
    (function () {
        var dt = new Date();
        return {
            YY: dt.getFullYear(),
            MM: dt.getMonth() + 1,
            DD: dt.getDate(),
            hh: dt.getHours(),
            mm: dt.getMinutes(),
            ss: dt.getSeconds()
        };
    }())
][3], {
    makeBindable: true
});

worldDateTime.bindModel({
    name: 'date-time'
}, (function (mapping) {
    [ 'year', 'month', 'day', 'hour', 'minute', 'second' ].forEach(function _forEach(propName) {
        mapping[propName] = {
            propName: propName,
            modelMayReadOn: 'changed:' + propName
        }
    });
    return mapping;
}({})), {
    isSource: true,
    modelMayWrite: false,
    readConverter: null,
    writeConverter: null,
    doOnUnbind: null
});

worldDateTime.unbindAllModels();

worldDateTime.bindModel({
    name: 'date-time'
}, (function (mapping) {
    [ 'year', 'month', 'day', 'hour', 'minute', 'second' ].forEach(function _forEach(propName) {
        mapping[propName] = {
            propName: propName,
            modelMayReadOn: [ propName + '-changed' ]
        }
    });
    return mapping;
}({})), {
    isSource: true
});

var NanoTimer = require('nanotimer');

var timer = new NanoTimer();

timer.setInterval(function _() {
    worldDateTime.inc();

//    _print(worldDateTime.out());
}, [], '1s');