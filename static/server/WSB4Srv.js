/**
 * created by mekhonoshyn on 11/17/14.
 */

var _define = require('../general/define'),
    _EventTarget = require('../general/EventTarget'),
    _Data4Srv = require('./Data4Srv');

function _WSB4Srv(client, models) {
    'use strict';

    function _addField(model, key, name) {
        var _value,
            _msgData = {
                bindKey: null,
                bindValue: null
            },
            _msg = {
                type: 'binding',
                data: _msgData
            };

        _define(_binds, key, function _getValue() {
            return _value;
        }, function _setValue(value) {
            _value = value;

            _msgData.bindKey = key;
            _msgData.bindValue = value;

            _denySending || client.send(_msg);
        });

        return model.bind(_binds, key, name, key);
    }

    function _attach(modelFieldsDef, modelInstance) {
        modelFieldsDef.forEach(function _forEach(fieldDef) {
            _unbinds.push(_addField(modelInstance, fieldDef.key, fieldDef.name));
        });
    }

    var _binds = new _EventTarget,
        _unbinds = [],
        _denySending = false;

    client.addHandler('binding', function _bindingHandler(data) {
        _denySending = true;

        _binds[data.bindKey] = data.bindValue;

        _denySending = false;

        _binds.dispatchEvent({
            type: data.bindKey
        });
    });

    client.addHandler('model:structure', function _modelStructureHandler(data) {
        var _name = data.name,
            _definition = require('../../models/' + _name),
            _model = models[_name] || (models[_name] = new _Data4Srv(_definition.fields));

        this.send({
            type: 'model:structure',
            data: {
                name: _name,
                definition: _definition
            }
        });

        _attach(_definition.fields, _model);
    });

    client.on('close', function _detachAll() {
        _unbinds.forEach(function _forEach(unbind) {
            unbind();
        });

        _unbinds.length = 0;
    });

    return client;
}

module.exports = _WSB4Srv;