/**
 * created by mekhonoshyn on 11/17/14.
 */

function _WSB4Cli(socket) {
    'use strict';

    var _callbacks = {};

    _define(WebSocket.prototype, 'getModel', (function _getModelWrapper() {
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
        }
    })());

    _define(socket, '$binds', _define(new _EventTarget, 'isSocket', true));

    _define(socket, 'addField', function _addField(model, key, name) {
        var _value,
            _msgData = {
                bindKey: null,
                bindValue: null
            },
            _msg = {
                type: 'binding',
                data: _msgData
            };

        _define(this.$binds, key, function _getValue() {
            return _value;
        }, function _setValue(value) {
            _value = value;

            _msgData.bindKey = key;
            _msgData.bindValue = value;

            this.denySending || this.send(_msg);
        }.bind(this));

        return model.bind(this.$binds, key, name, key);
    });

    socket.addHandler('model:structure', function _modelStructureHandler(data) {
        _log('received model structure response:', data);

        models[data.name] = new _Data(data.definition.fields, this);

        var _callback = _callbacks[data.callbackKey];

        delete _callbacks[data.callbackKey];

        _callback();
    });

    socket.addHandler('binding', function _bindingHandler(data) {
        this.denySending = true;

        this.$binds[data.bindKey] = data.bindValue;

        this.denySending = false;

        this.$binds.dispatchEvent({
            type: data.bindKey
        });
    });
}