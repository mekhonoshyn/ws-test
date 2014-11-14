//var http = require('http');
//var nodeStatic = require('node-static');
//var nsServer = new nodeStatic.Server('.');
var webSocket = require('ws');
var wsServer = new webSocket.Server({
    port: 8082
});
var hash = require('./hash');

//http.createServer(function (req, res) {
//    nsServer.serve(req, res);
//}).listen(8081);

wsServer.on('connection', function (ws) {
    var id = hash();

    _log('connection opened:', id);

    ws.on('message', function (rawData) {
        _handle(ws, JSON.parse(rawData));
    });

    ws.on('close', function () {
        _log('connection closed:', id);
    });
});

var _log = console.log.bind(console);

function _handle(ws, data) {
    if (handlers[data.type]) {
        handlers[data.type](ws, data.data);
    } else {
        handlers.unknown(ws, data);
    }
}

var handlers = {
    request: function _requestHandler(ws, data) {
        _log('received request:', data);

        _handle(ws, data);
    },
    model: function _modelHandler(ws, data) {
        _log('requested model structure:', data);

        ws.send(JSON.stringify({
            type: 'response',
            data: {
                type: 'model',
                data: {
                    name: data.name,
                    definition: require('./models/' + data.name)
                }
            }
        }));
    },
    binding: function _bindingHandler(ws, data) {
        _log('received binding update:', data);
    },
    unknown: function _defaultHandler(ws, data) {
        _log('default socket onMessage handler for data:', data);
    }
};

_log('server is listening ports 8081, 8082');