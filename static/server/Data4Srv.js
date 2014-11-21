/**
 * created by mekhonoshyn on 11/14/14.
 */

var _print = require('../general/print'),
    _hash = require('../general/hash'),
    _define = require('../general/define');

function _Data(fieldsDef) {
    'use strict';

    var _model = this;

    _define(_model, '$binds', {});

    fieldsDef && fieldsDef.length && fieldsDef.forEach(function _forEach(fieldDef) {
        var _name = fieldDef.name,
            _value = fieldDef.value,
            _listeners = [];

        _define(_model.$binds, _name, _listeners);

        _define(_model, _name, function _getValue() {
            return _value;
        }, function _setValue(value) {
            var _key;

            if (value.isArray) {
                _value = value[0];
                _key = value[1];
            } else {
                _value = value;
            }

            _listeners.forEach(function _forEach(listener) {
                (listener.key !== _key) && listener.writeData && listener.writeData();
            });
        });
    });
}

_define(_Data.prototype, 'bind', function _bind(target, property, fieldName, modelMayReadOn, modelMayWrite, rConverter, wConverter, isSource) {
    var _model = this,
        _key = _hash(),
        _listeners = _model.$binds[fieldName],
        _writeData = modelMayWrite ? (wConverter ? function () {
            target[property] = wConverter(_model[fieldName]);
        } : function () {
            target[property] = _model[fieldName];
        }) : null,
        _removeListenerFns = modelMayReadOn && ((modelMayReadOn.isArray && modelMayReadOn.length) ? modelMayReadOn : [ modelMayReadOn ] ).map(function _map(event) {
            var _value = [ 0, _key ],
                _handler = rConverter ? function () {
                    _value[0] = rConverter(target[property]);

                    _model[fieldName] = _value;
                } : function () {
                    _value[0] = target[property];

                    _model[fieldName] = _value;
                };

            target.addEventListener(event, _handler);

            return target.removeEventListener.bind(target, event, _handler);
        }),
        _index = _listeners.push({
            key: _key,
            writeData: _writeData
        });

    _print('add listener for field "', fieldName, ':', _key, '" on property "', property, '"');

    isSource || (_writeData && _writeData());

    return _removeListenerFns ? function () {
        _print('remove listener for field "', fieldName, ':', _key, '" on property "', property, '"');

        _listeners.splice(_index, 1);

        _removeListenerFns.forEach(function _forEach(removeListener) {
            removeListener();
        });
    } : function () {
        _print('remove listener for field "', fieldName, ':', _key, '" on property "', property, '"');

        _listeners.splice(_index, 1);
    };
});

module.exports = _Data;