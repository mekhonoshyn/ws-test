/**
 * created by mekhonoshyn on 11/10/14.
 */

(typeof _define === 'undefined') && (_define = require('../../define'));
(typeof WebSocket === 'undefined') && (WebSocket = require('ws'));

_define(Array.prototype, 'isArray', true);

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

        if (this.readyState === 1 && !this.denySending) {
            _msg.data.bindKey = key;
            _msg.data.bindValue = value;

            this.send(_msg);
        }
    }.bind(this));

    model.bind(this.$binds, key, name, 'binding:' + key);
});