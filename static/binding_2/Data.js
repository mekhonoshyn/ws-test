/**
 * created by mekhonoshyn on 11/10/14.
 */

function _Data(fields) {
    fields && fields.forEach(this.addField, this);
}

_define(_Data.prototype, 'addField', function _addField(fieldDef) {
    if (!this.$binds) {
        _define(this, '$binds', {});
    }

    var _isPlain = typeof fieldDef !== 'object',
        _value = _isPlain ? '' : (fieldDef.value === undefined ? '' : fieldDef.value),
        _listeners = [];

    _define(this.$binds, _isPlain ? fieldDef : fieldDef.name, _listeners);

    _define(this, _isPlain ? fieldDef : fieldDef.name, function _get() {
        return _value;
    }, function _set(input) {
        var _key;

        if (input.isArray) {
            _value = input[0];
            _key = input[1];
        } else {
            _value = input;
        }

        _listeners.forEach(function _forEach(listener) {
            if (listener.key !== _key) {
                listener.target[listener.property] = listener.rConverter ? listener.rConverter(_value) : _value;
            }
        });
    });
});

//bind 'property' property of 'target' target as 'key' key to field 'fieldName' and update field value on happening events 'eventNames'
_define(_Data.prototype, 'bind', function _bind(property, target, key, fieldName, eventNames, rConverter, wConverter) {
    this.$binds[fieldName].push({
        key: key,
        target: target,
        property: property,
        events: eventNames && eventNames.map(function _map(event) {
            var _handler = function () {
                this[fieldName] = [ wConverter ? wConverter(target[property]) : target[property], key ];
            }.bind(this);

            target.addEventListener(event, _handler);

            return {
                event: event,
                handler: _handler
            };
        }, this),
        rConverter: rConverter
    });

    target[property] = rConverter ? rConverter(this[fieldName]) : this[fieldName];
});

// unbind 'key' key from field 'fieldName'
_define(_Data.prototype, 'unbind', function _unbind(key, fieldName) {
    var _bind = this.$binds[fieldName],
        _index = _bind.length;

    for (var i = 0; i < _index; i++) {
        if (_bind[i].key === key) {
            _index = i;

            break;
        }
    }

    var listener = _bind.splice(_index, 1)[0];

    listener && listener.events && listener.events.forEach(function _forEach(event) {
        listener.target.removeEventListener(event.event, event.handler);
    });
});