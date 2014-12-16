/**
 * created by mekhonoshyn on 11/17/14.
 */

var _define = _define || require('./define');

_define(Array.prototype, 'find', function (testKey, testValue, returnIndex) {
    var _i,
        _len = this.length,
        _obj;

    if (_len) {
        for (_i = 0; _i < _len; _i++) {
            _obj = this[_i];

            if (_obj[testKey] === testValue) {
                return returnIndex ? _i : _obj;
            }
        }
    }

    return returnIndex ? -1 : null;
});

_define(Array.prototype, 'isArray', true);

_define(Object.prototype, 'extract', function _getAndDelete(key) {
    var _result = this[key];

    delete this[key];

    return _result;
});