/**
 * created by mekhonoshyn on 11/10/14.
 */

function _Data(fields) {
    _define(this, '$binds', {});

    fields && fields.forEach(this.addField, this);
}

_define(_Data.prototype, 'addField', function _addField(fieldDef) {
    var _isPlain = typeof fieldDef === 'string' || typeof fieldDef === 'number',
        _value = _isPlain ? '' : (fieldDef.value || ''),
        _listeners = [];

    _define(this.$binds, _isPlain ? fieldDef : fieldDef.name, new _Bind(_listeners));

    _define(this, _isPlain ? fieldDef : fieldDef.name, function _get() {
        return _value;
    }, function _set(input) {
        var _identifier;

        if (input.isArray) {
            _value = input[0];
            _identifier = input[1];
        } else {
            _value = input;
        }

        _listeners.forEach(function _forEach(listener) {
            if (listener.identifier !== _identifier) {
                listener.target[listener.property] = _value;
            }
        });
    });
});

//bind 'property' property of 'target' target as 'identifier' key to field 'fieldName' and update field value on happening events 'eventNames'
_define(_Data.prototype, 'bind', function _bind(property, target, identifier, fieldName, eventNames) {
    if (!this.$binds[fieldName]) {
        return;
    }

    this.$binds[fieldName].watch(identifier, target, property, eventNames && eventNames.map(function _map(event) {
        var _handler = function () {
            this[fieldName] = [ target[property], identifier ];
        }.bind(this);

        target.addEventListener(event, _handler);

        return {
            event: event,
            handler: _handler
        };
    }, this));

    target[property] = this[fieldName];
});

// unbind 'identifier' key from field 'fieldName'
_define(_Data.prototype, 'unbind', function _unbind(identifier, fieldName) {
    if (!this.$binds[fieldName]) {
        return;
    }

    var listener = this.$binds[fieldName].unwatch(identifier);

    listener && listener.events && listener.events.forEach(function _forEach(event) {
        listener.target.removeEventListener(event.event, event.handler);
    });
});