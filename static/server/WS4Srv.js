/**
 * created by mekhonoshyn on 11/17/14.
 */

var WebSocket = require('ws'),
    _define = require('../general/define'),
    _log = require('../general/log');

function _WS4Srv(client) {
    'use strict';

    _log('connection opened:', client.id);

    function _handle(data) {
        _handlers[data.type] ? _handlers[data.type].call(client, data.data) : _handlers.unknown.call(client, data);
    }

    var _handlers = {
        unknown: function _defaultHandler(data) {
            _log('run default message handler (', data, ')');
        }
    };

    client.on('message', function (rawData) {
        _handle(JSON.parse(rawData));
    });

    _define(client, 'send', function _send(data) {
        if (this.readyState !== 1) {
            return;
        }

        WebSocket.prototype.send.call(this, JSON.stringify(data));
    });

    _define(client, 'addHandler', _define.bind(null, _handlers));

    client.on('close', function () {
        _log('connection closed:', client.id);
    });
}

module.exports = _WS4Srv;