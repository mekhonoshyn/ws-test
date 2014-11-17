/**
 * created by mekhonoshyn on 11/17/14.
 */

function _WSB4Cli(socket) {
    'use strict';

    _define(socket, '$binds', _define(new _EventTarget, 'isSocket', true));

    _define(socket, 'addField', function _addField(model, key, name) {
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

            _msg.data.bindKey = key;
            _msg.data.bindValue = value;

            this.denySending || this.send(_msg);
        }.bind(this));

        return model.bind(this.$binds, key, name, key);
    });

    return socket;
}