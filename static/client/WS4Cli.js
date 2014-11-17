/**
 * created by mekhonoshyn on 11/17/14.
 */

function _WS4Cli(address) {
    'use strict';

    function _handle(data) {
        _handlers[data.type] ? _handlers[data.type].call(_socket, data.data) : _handlers.unknown.call(_socket, data);
    }

    var _socket = new WebSocket(address),
        _handlers = {
            unknown: function _defaultHandler(data) {
                _log('run default message handler (', data, ')');
            }
        },
        _queue = [];

    _define(_socket, 'send', function _send(data) {
        this.readyState === 1 ? WebSocket.prototype.send.call(this, JSON.stringify(data)) : _log('socket queue length:' ,_queue.push(data));
    });

    _define(_socket, 'addHandler', function _addHandler(name, handler) {
        _define(_handlers, name, handler);
    });

    _define(_socket, 'onOpen'.toLowerCase(), function _onOpen(event) {
        _log('socket opened:', event);

        if (_queue.length) {
            var _lQueue = _queue.slice();

            _queue.length = 0;

            _lQueue.forEach(socket.send.bind(socket));
        }
    });

    _define(_socket, 'onClose'.toLowerCase(), function _onClose() {
        _log('socket closed', arguments);
    });

    _define(_socket, 'onError'.toLowerCase(), function _onError() {
        _log('error occurred', arguments);
    });

    _define(_socket, 'onMessage'.toLowerCase(), function _onMessage(event) {
        var _message = JSON.parse(event.data);

//        _log('received message:', _message);

        _handle(_message);
    });

    return _socket;
}