(typeof _define === 'undefined') && (_define = require('./define'));

function _EventTarget() {
    'use strict';

    _define(this, '$types', {});
}

_define(_EventTarget.prototype, 'addEventListener', function _addEventListener(type, listener) {
        var array = this.$types[type];

        if (!array) {
            _define(this.$types, type, array = []);
        }

        if (!~array.indexOf(listener)) {
            array.push(listener);
        }
    }
);

_define(_EventTarget.prototype, 'removeEventListener', function _removeEventListener(type, listener) {
        var array = this.$types[type];

        if (!array) {
            return;
        }

        var li = array.indexOf(listener);

        if (~li) {
            array.splice(li, 1);

            if (!array.length) {
                delete this.$types[type];
            }
        }
    }
);

_define(_EventTarget.prototype, 'dispatchEvent', function dispatchEvent(event) {
        var array = this.$types[event.type];

        if (!array) {
            return;
        }

        for (var i = 0, l = array.length; i < l; i++) {
            array[i].call(this, event);
        }
    }
);

(typeof module !== 'undefined') && (module.exports = _EventTarget);