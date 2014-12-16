/**
 * created by mekhonoshyn on 11/17/14.
 */

function _WS4Cli(socket, options) {
    'use strict';

    var _handlers = {
            unknown: function _defaultHandler(data) {
                _print('run default message handler (', JSON.stringify(data), ')');
            }
        },
        _queue = [];

    _define(socket, 'send', function _send(data) {
        if (this.readyState === 1) {
//            _print('socket is sending message: ', JSON.stringify(data));

            WebSocket.prototype.send.call(this, JSON.stringify(data));
        } else {
            _print('socket queue length: ', _queue.push(data));
        }
    });

    _define(socket, 'addHandler', _define.bind(null, _handlers));

    _define(socket, 'onOpen'.toLowerCase(), function _onOpen() {
        _print('socket opened: ', JSON.stringify('/* put some important data here */'));

        if (_queue.length) {
            var _lQueue = _queue.slice();

            _queue.length = 0;

            _lQueue.forEach(function _forEach(qItem) {
                socket.send(qItem);
            });
        }
    });

    _define(socket, 'onClose'.toLowerCase(), function _onClose() {
        _print('socket closed: ', JSON.stringify('/* put some important data here */'));
    });

    _define(socket, 'onError'.toLowerCase(), function _onError() {
        _print('error occurred: ', JSON.stringify('/* put some important data here */'));
    });

    _define(socket, 'onMessage'.toLowerCase(), function _onMessage(event) {
        var _message = JSON.parse(event.data);

//        _print('socket received message: ', JSON.stringify(_message));

        if (_handlers[_message.type]) {
            _handlers[_message.type].call(socket, _message.data)
        } else {
            _handlers.unknown.call(socket, _message);
        }
    });

    if (options.makeBindable) {
        (function () {
            var _callbacks = {},
                _send = function (type, data) {
                    socket.send({
                        type: type,
                        data: data
                    });
                };

            _define(socket, 'getModel', function _getModel(name, callback) {
                var _callBackKey = _hash();

                _callbacks[_callBackKey] = callback;

                _send('model:structure', {
                    name: name,
                    callbackKey: _callBackKey
                });
            });

            var _bi = new _EventTarget,
                _setAndNotify = {};

            _BindingLayer(socket, _bi);

            socket.addHandler('binding', function _bindingHandler(data) {
                _setAndNotify[data.bindKey](data.bindValue);
            });

            socket.addHandler('model:structure', function _modelStructureHandler(modelData) {
                var _fields = modelData.def.fields;

                if (!_fields.length) {
                    _print('empty model; "model:structure" request rejected');

                    return;
                }

                var _mapping = {};

                _fields.forEach(function _forEach(fieldDef) {
                    var _key = fieldDef.key,
                        _value;

                    _setAndNotify[_key] = function (value) {
                        _value = value;

                        _bi.dispatchEvent({
                            type: _key
                        });
                    };

                    _define(_bi, _key, function _getter() {
                        return _value;
                    }, function (value) {
                        _value = value;

                        _send('binding', {
                            bindKey: _key,
                            bindValue: value
                        });
                    }, true);

                    _print('bindable property "', _key, '" created');

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
                    modelMayWrite: true,
                    defaultValues: true,
                    isSource: true
                });

                _callbacks.extract(modelData.callbackKey)(_BindingLayer.model(modelData.name));

                _send('model:data', modelData.name);
            });
        }());
    }
}