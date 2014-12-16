/**
 * created by mekhonoshyn on 11/17/14.
 */

var WebSocket = require('ws'),

    _define = require('../general/define'),
    _print = require('../general/print'),
    _hash = require('../general/hash'),

    _EventTarget = require('../general/EventTarget'),
    _BindingLayer = require('../general/BindingLayer');

_define(WebSocket.prototype, 'send', (function () {
    var _send = WebSocket.prototype.send;

    return function (data) {
        if (this.readyState === 1) {
//            _print('socket is sending message: ', JSON.stringify(data));

            _send.call(this, JSON.stringify(data));
        }
    };
}()));

function _WS4Srv(client, options) {
    'use strict';

    var _id = _hash();

    _print('connection opened: ', _id);

    var _handlers = {
        unknown: function _defaultHandler(data) {
            _print('run default message handler (', data, ')');
        }
    };

    client.on('message', function (rawData) {
        var _message = JSON.parse(rawData);

//        _print('client [id:', _id, '] received message: ', JSON.stringify(_message));

        if (_handlers[_message.type]) {
            _handlers[_message.type].call(client, _message.data);
        } else {
            _handlers.unknown.call(client, _message);
        }
    });

    _define(client, 'addHandler', _define.bind(null, _handlers));

    client.on('close', function () {
        _print('connection closed: ', _id);
    });

    if (options.makeBindable) {
        (function () {
            var _bi = new _EventTarget,
                _setAndNotify = {},
                _send = function (type, data) {
                    client.send({
                        type: type,
                        data: data
                    });
                };

            _BindingLayer(client, _bi);

            client.addHandler('binding', function _bindingHandler(data) {
                _setAndNotify[data.bindKey](data.bindValue);
            });

            client.addHandler('model:structure', function _modelStructureHandler(modelData) {
                var _fields = (modelData.def || (modelData.def = require('../../models/' + modelData.name))).fields;

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
                    defaultValues: false,
                    isSource: true
                });

                _send('model:structure', modelData);
            });

            client.addHandler('model:data', function _modelDataHandler(modelName) {
                this.invalidateModel(modelName);
            });

            client.on('close', client.unbindAllModels);
        }());
    }
}

module.exports = _WS4Srv;