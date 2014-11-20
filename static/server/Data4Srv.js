/**
 * created by mekhonoshyn on 11/14/14.
 */

var _log = require('../general/log'),
    _hash = require('../general/hash'),
    _define = require('../general/define');

function _Data(fieldsDef) {
    'use strict';

    _define(this, '$binds', {});

    fieldsDef && fieldsDef.length && fieldsDef.forEach(function _forEach(fieldDef) {
        var _name = fieldDef.name,
            _value = fieldDef.value,
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
                if (listener.key !== _key) {
                    listener.target[listener.property] = listener.rConverter ? listener.rConverter(_value) : _value;
                }
            });
        });
    }, this);
}

_define(_Data.prototype, 'bind', function _bind(target, property, fieldName, events, rConverter, wConverter) {
    var _listeners = this.$binds[fieldName],
        _key = _hash();

    _log('binding listeners for key', _key);

    _listeners.push({
        key: _key,
        target: target,
        property: property,
        removers: events && ((events.isArray && events.length) ? events : [ events ] ).map(function _map(event) {
            var _value = [ 0, _key ],
                _handler = (wConverter ? function () {
                    _value[0] = wConverter(target[property]);

                    this[fieldName] = _value;
                } : function () {
                    _value[0] = target[property];

                    this[fieldName] = _value;
                }).bind(this);

            target.addEventListener(event, _handler);

            return target.removeEventListener.bind(target, event, _handler);
        }, this),
        rConverter: rConverter
    });

    target[property] = rConverter ? rConverter(this[fieldName]) : this[fieldName];

    return function _unbind() {
        _log('unbinding listeners for key', _key);

        var _index = _listeners.length;

        for (var i = 0; i < _index; i++) {
            if (_listeners[i].key === _key) {
                _index = i;

                break;
            }
        }

        var listener = _listeners.splice(_index, 1)[0];

        listener && listener.removers && listener.removers.forEach(function _forEach(remover) {
            remover();
        });
    };
});

module.exports = _Data;