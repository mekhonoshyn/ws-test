/**
 * created by mekhonoshyn on 11/10/14.
 */

function _define(context, property, getter, setter, enumerable) {
    var definition = {};

    if (setter) {
        definition.get = getter;
        definition.set = setter;
    } else {
        definition.value = getter;
    }

    if (enumerable) {
        definition.enumerable = !!enumerable;
    }

    return Object.defineProperty(context, property, definition);
}

//function _defineOwn() {
//    var args = Array.prototype.slice.call(arguments);
//
//    args.length = 4;
//
//    _define.apply(null, args.concat(true));
//}

_define(Array.prototype, 'isArray', true);

//function _not(value) {
//    return !value;
//}

var _log = console.log.bind(console);

(function _overrideSend() {
    var _originalSend = WebSocket.prototype.send;

    _define(WebSocket.prototype, 'send', function _send(data) {
        _originalSend.call(this, JSON.stringify(data));
    });
})();

_define(WebSocket.prototype, 'addField', function _addField(model, key, name) {
    var _value,
        _msg = {
            type: 'binding',
            data: {
                bindKey: null,
                bindValue: null
            }
        };

    _define(this.$binds, key, function _getValue() {
        return _value;
    }, function _setValue(value) {
        _value = value;

        if (this.readyState === 1) {
            _msg.data.bindKey = key;
            _msg.data.bindValue = value;

            this.send(_msg);
        }
    }.bind(this));

    model.bind(this.$binds, key, name, 'binding');
});

//_define(Object.prototype, 'extendBy', function _extendBy(src) {
//    Object.keys(src).forEach(function _forEach(key) {
//        this[key] || (this[key] = src[key]);
//    }, this);
//});
//
//_define(Object.prototype, 'mixWith', function _mixWith(src) {
//    this.extendBy(src.prototype);
//
//    src.call(this);
//});