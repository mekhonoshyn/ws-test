/**
 * created by mekhonoshyn on 11/17/14.
 */

var WebSocket = require('ws');

var _WS4Srv = require('../server/WS4Srv');
var _WSB4Srv = require('../server/WSB4Srv');
var _hash = require('./hash');

module.exports = function _WSS(port, models) {
    var WSServer = new WebSocket.Server({
        port: port
    });

    WSServer.on('connection', function (client) {
        client.id = _hash();

        _WS4Srv(client);

        _WSB4Srv(client, models);
    });
};