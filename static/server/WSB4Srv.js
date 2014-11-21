/**
 * created by mekhonoshyn on 11/17/14.
 */

var _print = require('../general/print'),
    _hash = require('../general/hash'),
    _define = require('../general/define'),
    _EventTarget = require('../general/EventTarget'),
    _Data4Srv = require('./Data4Srv');

function _WSB4Srv(client, models) {
    'use strict';

    var _id = client.id || (client.id = _hash());

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
        }, true);

        var unbindFn = model.bind(_binds, key, name, key);

        _print('field "', name, ':', key, '" added to client "', _id, '" bindings');

        return function() {
            unbindFn();

            delete _binds[key];

            _print('field "', name, ':', key, '" removed from client "', _id, '" bindings');
        };
    }

    var _models = {},
        _binds = new _EventTarget,
        _denySending = false;

    client.addHandler('binding', function _bindingHandler(data) {
        _denySending = true;

        _binds[data.bindKey] = data.bindValue;

        _denySending = false;

        _binds.dispatchEvent({
            type: data.bindKey
        });
    });

    function _modelStructureHandler(data) {
        var _name = data.name;

        data.definition = require('../../models/' + _name);

        var _fields = data.definition.fields,
            _model = models[_name] ||
                _print('model "', _name, '" added to list of shared models') ||
                (models[_name] = {
                    detachFns: {},
                    instance: new _Data4Srv(_fields)
                });

        _models[_name] = _model;

        var removeFieldFns = _fields.map(function _map(fieldDef) {
            return _addField(_model.instance, fieldDef.key, fieldDef.name);
        });

        _model.detachFns[_id] = (function _detachClientWrapper(fieldsLength) {
            return function _detachClient() {
                while (fieldsLength--) {
                    removeFieldFns.splice(0, 1)[0]();
                }
            }
        })(_fields.length);

        _print('client "', _id, '" attached to model "', _name, '"');
    }

    client.addHandler('model:structure', (function _modelStructureHandlerWrapper() {
        var _msg = {
                type: 'model:structure',
                data: null
            };

        return function _modelStructureHandlerIntWrapper(data) {
            _modelStructureHandler(data);

            _msg.data = data;

            this.send(_msg);
        };
    })());

    function _detachModel(name) {
        var _detachFns = _models[name].detachFns;

        _detachFns[_id]();

        delete _detachFns[_id];

        delete _models[name];

        _print('client "', _id, '" detached from model "', name, '"');

        if (!_detachFns.length) {
            delete models[name];

            _print('model "', name, '" destroyed as unclaimed');
        }
    }

    function _detachAllModels() {
        Object.keys(_models).forEach(_detachModel);
    }

    client.on('close', _detachAllModels);
}

module.exports = _WSB4Srv;