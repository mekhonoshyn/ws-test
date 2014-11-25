/**
 * created by mekhonoshyn on 11/17/14.
 */

function _WS4Cli(socket, options) {
    'use strict';

    var _handlers = {
            unknown: function _defaultHandler(data) {
                _print('run default message handler (', data, ')');
            }
        },
        _queue = [];

    _define(socket, 'send', function _send(data) {
        if (this.readyState === 1) {
            WebSocket.prototype.send.call(this, JSON.stringify(data));
        } else {
            _print('socket queue length: ', _queue.push(data));
        }
    });

    _define(socket, 'addHandler', _define.bind(null, _handlers));

    _define(socket, 'onOpen'.toLowerCase(), function _onOpen(event) {
        _print('socket opened: ', event);

        if (_queue.length) {
            var _lQueue = _queue.slice();

            _queue.length = 0;

            _lQueue.forEach(socket.send.bind(socket));
        }
    });

    _define(socket, 'onClose'.toLowerCase(), function _onClose() {
        _print('socket closed: ', arguments);
    });

    _define(socket, 'onError'.toLowerCase(), function _onError() {
        _print('error occurred: ', arguments);
    });

    _define(socket, 'onMessage'.toLowerCase(), function _onMessage(event) {
        var _message = JSON.parse(event.data);

        _print('socket received message: ', _message);

        if (_handlers[_message.type]) {
            _handlers[_message.type].call(socket, _message.data)
        } else {
            _handlers.unknown.call(socket, _message);
        }
    });

    if (options.makeBindable) {
        (function () {
            var _callbacks = {};

            _define(socket, 'getModel', (function _getModelWrapper() {
                var _msgData = {
                        name: null,
                        callbackKey: null
                    },
                    _msg = {
                        type: 'model:structure',
                        data: _msgData
                    };

                return function _getModel(name, callback) {
                    var _callBackKey = _hash();

                    _callbacks[_callBackKey] = callback;

                    _msgData.name = name;
                    _msgData.callbackKey = _callBackKey;

                    this.send(_msg);
                };
            }()));

            var _bi = new _EventTarget,
                _setAndNotify = {},
                _send = function (type, data) {
                    socket.send({
                        type: type,
                        data: data
                    });
                };

            _BindingLayer(socket, _bi);

            socket.addHandler('binding', function _bindingHandler(data) {
                _setAndNotify[data.bindKey](data.bindValue);
            });

            socket.addHandler('model:structure', function _modelStructureHandler(modelData) {
                var _mapping = {};

                modelData.def.fields.forEach(function _forEach(fieldDef) {
                    var _key = fieldDef.key,
                        _value,
                        _event = {
                            type: _key
                        },
                        _data = {
                            bindKey: _key,
                            bindValue: null
                        };

                    _setAndNotify[_key] = function (value) {
                        _value = value;

                        _bi.dispatchEvent(_event);
                    };

                    _define(_bi, _key, function _getter() {
                        return _value;
                    }, function (value) {
                        _value = value;

                        _data.bindValue = value;

                        _send('binding', _data);
                    }, true);

                    _mapping[fieldDef.name] = {
                        propName: _key,
                        modelMayReadOn: _key
                    };
                });

                this.bindModel(modelData, _mapping, {
                    doOnUnbind: function _onUnbind(propName) {
                        delete _bi[propName];

                        delete _setAndNotify[propName];

                        _print('bindable property "', propName, '" removed');
                    },
                    modelMayWrite: true
                });
            });
        }())
    }
}