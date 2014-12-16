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

    fieldsDef && fieldsDef.length

        && _define(_model, '$fields', [])

        && fieldsDef.forEach(function _forEach(fieldDef, index) {
            _define(_model.$fields, index, fieldDef.name);

            var _name = fieldDef.name,
                _value = (options && options.defaultValues && fieldDef.value !== null && fieldDef.value !== undefined) ? (new (fieldDef.value.constructor)).valueOf() : fieldDef.value,
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
                    listener.key !== _key && listener.writeData();
                });
            });
        });
}

_define(_DataModel.prototype, 'invalidate', function _invalidate(bindingInterface, fieldNames) {
    var _model = this;

    ((fieldNames && fieldNames.length) ? fieldNames : _model.$fields).forEach(function _forEach(fieldName) {
        _model.$binds[fieldName].forEach(function _forEach(listener) {
            listener.bi === bindingInterface && listener.writeData();
        });
    });
});

_define(_DataModel.prototype, 'bind', function _bind(bindingInterface, biPropName, modelFieldName, modelMayReadOn, modelMayWrite, readConverter, writeConverter, isSource) {
    var _model = this,
        _key = _hash(),
        _listeners = _model.$binds[modelFieldName],
        _writeData = !!modelMayWrite && (writeConverter ? function () {
            bindingInterface[biPropName] = writeConverter(_model[modelFieldName]);
        } : function () {
            bindingInterface[biPropName] = _model[modelFieldName];
        }),
        _removeEventListenerFns = !!modelMayReadOn && ((modelMayReadOn.isArray && modelMayReadOn.length) ? modelMayReadOn : [ modelMayReadOn ] ).map(function _map(event) {
            var _value = [ 0, _key ],
                _handler = readConverter ? function () {
                    _value[0] = readConverter(bindingInterface[biPropName]);

                    _model[modelFieldName] = _value;
                } : function () {
                    _value[0] = bindingInterface[biPropName];

                    _model[modelFieldName] = _value;
                };

            bindingInterface.addEventListener(event, _handler);

            return function _removeEventListener() {
                bindingInterface.removeEventListener(event, _handler);
            };
        });

    _writeData && _listeners.push({
        key: _key,
        bi: bindingInterface,
        writeData: _writeData
    });

    _print('add listener for field "', modelFieldName, ':', _key, '" on property "', biPropName, '"');

    isSource || (_writeData && _writeData());

    return _removeEventListenerFns ? (_writeData ? function () {
        _print('remove listener for field "', modelFieldName, ':', _key, '" on property "', biPropName, '"');

        _listeners.splice(_listeners.find('key', _key, true), 1);

        _removeEventListenerFns.forEach(function _forEach(removeListener) {
            removeListener();
        });
    } : function () {
        _print('remove listener for field "', modelFieldName, ':', _key, '" on property "', biPropName, '"');

        _removeEventListenerFns.forEach(function _forEach(removeListener) {
            removeListener();
        });
    }) : (_writeData && function () {
        _print('remove listener for field "', modelFieldName, ':', _key, '" on property "', biPropName, '"');

        _listeners.splice(_listeners.find('key', _key, true), 1);
    });
});

(typeof module !== 'undefined') && (module.exports = _DataModel);