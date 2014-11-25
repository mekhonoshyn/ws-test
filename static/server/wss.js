/**
 * created by mekhonoshyn on 11/17/14.
 */

var WebSocket = require('ws'),
    _WS4Srv = require('./WS4Srv');

module.exports = function _WSS(port) {
    var WSServer = new WebSocket.Server({
        port: port
    });

    WSServer.on('connection', function (client) {
        _WS4Srv(client, {
            makeBindable: true
        });
    });
};