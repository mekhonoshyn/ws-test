/**
 * created by mekhonoshyn on 11/10/14.
 */


(typeof module !== 'undefined') && (module.exports = _Data);

function _Data(fields) {
    _define(this, '$binds', {});

    fields && fields.length && fields.forEach(function _forEach(fieldDef) {
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

//_define(_Data.prototype, 'attach', function _attach(socket) {
////    fields.forEach(function _forEach(fieldDef) {
////        socket.addField(this, fieldDef.key, fieldDef.name);
////    }, this);
//});

//bind 'property' property of 'target' target to field 'fieldName' and update field value on happening events 'events'
_define(_Data.prototype, 'bind', function _bind(target, property, fieldName, events, rConverter, wConverter) {
    var _listeners = this.$binds[fieldName],
        _key = _hash();

    _listeners.push({
        key: _key,
        target: target,
        property: property,
        events: events && ((events.isArray && events.length) ? events : [ events ] ).map(function _map(event) {
            var _handler = function () {
                this[fieldName] = [ wConverter ? wConverter(target[property]) : target[property], _key ];
            }.bind(this);

            target.addEventListener(event, _handler);

            return {
                event: event,
                handler: _handler
            };
        }, this),
        rConverter: rConverter
    });

    target.isSocket || (target[property] = rConverter ? rConverter(this[fieldName]) : this[fieldName]);

    return function _unbind() {
        var _index = _listeners.length;

        for (var i = 0; i < _index; i++) {
            if (_listeners[i].key === _key) {
                _index = i;

                break;
            }
        }

        var listener = _listeners.splice(_index, 1)[0];

        listener && listener.events && listener.events.length && listener.events.forEach(function _forEach(event) {
            listener.target.removeEventListener(event.event, event.handler);
        });
    };
});