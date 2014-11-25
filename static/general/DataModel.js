/**
 * created by mekhonoshyn on 11/14/14.
 */

var _print = _print || require('./print'),
    _hash = _hash || require('./hash'),
    _define = _define || require('./define');

function _DataModel(fieldsDef, options) {
    'use strict';

    var _model = this;

    _define(_model, '$binds', {});

    fieldsDef && fieldsDef.length && fieldsDef.forEach(function _forEach(fieldDef) {
        var _name = fieldDef.name,
            _value = (options && options.defaultValues) ? (new (fieldDef.value.constructor)).valueOf() : fieldDef.value,
            _listeners = [];

        _define(this.$binds, _name, _listeners);

        _define(this, _name, function _getValue() {
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
                (listener.key !== _key) && listener.writeData();
            });
        });
    }, _model);
}

_define(_DataModel.prototype, 'bind', function _bind(target, propName, fieldName, modelMayReadOn, modelMayWrite, readConverter, writeConverter, isSource) {
    var _model = this,
        _key = _hash(),
        _listeners = _model.$binds[fieldName],
        _writeData = !!modelMayWrite ? (writeConverter ? function () {
            target[propName] = writeConverter(_model[fieldName]);
        } : function () {
            target[propName] = _model[fieldName];
        }) : null,
        _removeEventListenerFns = !!modelMayReadOn && ((modelMayReadOn.isArray && modelMayReadOn.length) ? modelMayReadOn : [ modelMayReadOn ] ).map(function _map(event) {
            var _value = [ 0, _key ],
                _handler = readConverter ? function () {
                    _value[0] = readConverter(target[propName]);

                    _model[fieldName] = _value;
                } : function () {
                    _value[0] = target[propName];

                    _model[fieldName] = _value;
                };

            target.addEventListener(event, _handler);

            return function _removeEventListener() {
                target.removeEventListener(event, _handler);
            };
        }),
        _index = _writeData && _listeners.push({
            key: _key,
            writeData: _writeData
        });

    _print('add listener for field "', fieldName, ':', _key, '" on property "', propName, '"');

    isSource || (_writeData && _writeData());

    return _removeEventListenerFns ? (_writeData ? function () {
        _print('remove listener for field "', fieldName, ':', _key, '" on property "', propName, '"');

        _listeners.splice(_index, 1);

        _removeEventListenerFns.forEach(function _forEach(removeListener) {
            removeListener();
        });
    } : function () {
        _print('remove listener for field "', fieldName, ':', _key, '" on property "', propName, '"');

        _removeEventListenerFns.forEach(function _forEach(removeListener) {
            removeListener();
        });
    }) : (_writeData && function () {
        _print('remove listener for field "', fieldName, ':', _key, '" on property "', propName, '"');

        _listeners.splice(_index, 1);
    });
});

(typeof module !== 'undefined') && (module.exports = _DataModel);