/**
 * created by mekhonoshyn on 11/17/14.
 */

var WebSocket = require('ws'),
    _define = require('../general/define'),
    _log = require('../general/log'),
    _print = require('../general/print'),
    _EventTarget = require('../general/EventTarget'),
    _BindingLayer = require('../general/BindingLayer'),
    _path = require('path');

_define(WebSocket.prototype, 'send', (function () {
    var _send = WebSocket.prototype.send;

    return function (data) {
        if (this.readyState !== 1) {
            return;
        }

        _send.call(this, JSON.stringify(data));
    }
}()));

function _WS4Srv(client, options) {
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

    _define(client, 'addHandler', _define.bind(null, _handlers));

    client.on('close', function () {
        _log('connection closed:', client.id);
    });

    if (options.makeBindable) {
        (function () {
            var __bi = new _EventTarget,
                __denySending = false,
                __send = function _send(type, data) {
                    client.send({
                        type: type,
                        data: data
                    });
                };

            _BindingLayer(client, __bi);

            client.addHandler('binding', function _bindingHandler(data) {
                __denySending = true;

                __bi[data.bindKey] = data.bindValue;

                __denySending = false;

                __bi.dispatchEvent({
                    type: data.bindKey
                });
            });

            client.addHandler('model:structure', function _modelStructureHandler(modelData) {
                var _mapping = {};

                (modelData.def || (modelData.def = require(_path.join(__dirname, '..', '..', 'models', modelData.name)))).fields.forEach(function _forEach(fieldDef) {
                    var _key = fieldDef.key,
                        _value;

                    _define(__bi, _key, function _getter() {
                        return _value;
                    }, function _setter(value) {
                        _value = value;

                        __denySending || __send('binding', {
                            bindKey: _key,
                            bindValue: value
                        });
                    }, true);

                    _mapping[fieldDef.name] = {
                        propName: _key,
                        modelMayReadOn: _key
                    };
                });

                this.bindModel(options.models, modelData, _mapping, {
                    removeOnUnbind: true,
                    modelMayWrite: true
                });

                __send('model:structure', modelData);
            });

            client.on('close', client.unbindAllModels);
        }());
    }
}

module.exports = _WS4Srv;