/**
 * created by mekhonoshyn on 11/20/14.
 */

var _defineRO = require('../general/defineRO'),
    _BindingLayer = require('../general/BindingLayer'),
    _EventTarget = require('../general/EventTarget');

function _DTItem(config) {
    function _val(value) {
        if (value !== undefined) {
            _value = value;

            config.onChange && config.onChange(_this);
        }

        return _value;
    }

    function _out() {
        return ('00000000' + _value).slice(-(config.length || 2));
    }

    function _inc() {
        if (_value === _maxValue()) {
            _val(_minValue);

            config.upperLevel && config.upperLevel.inc();
        } else {
            _val(_value + 1);
        }
    }

    var _maxValue = typeof config.maxValue === 'function' ? config.maxValue : function () {
            return config.maxValue;
        },
        _minValue = config.minValue,
        _value,
        _this = {
            inc: _inc,
            val: _val,
            out: _out
        };

    (function () {
        var _initialValue = config.initialValue;

        if (typeof _initialValue !== 'number' || _initialValue < _minValue || _initialValue > _maxValue()) {
            _val(_minValue);
        } else {
            _val(_initialValue);
        }
    }());

    return _this;
}

function _DateTime(current, options) {
    var _DD_by_MM = (function (array) {
        var result = {};
        array.forEach(function (value, index) {
            result[index + 1] = value;
        });
        return result;
    })([ 31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]);

    var __YY = _DTItem({
        minValue: 1,
        maxValue: Infinity,
        initialValue: current && current.YY,
        length: 4,
        onChange: function _onChange(__YY) {
            _DD_by_MM[2] = __YY.val() % 4 ? 28 : 29;
        }
    });

    var __MM = _DTItem({
        upperLevel: __YY,
        minValue: 1,
        maxValue: 12,
        initialValue: current && current.MM
    });

    var __DD = _DTItem({
        upperLevel: __MM,
        minValue: 1,
        maxValue: function _maxValue() {
            return _DD_by_MM[__MM.val()];
        },
        initialValue: current && current.DD
    });

    var __hh = _DTItem({
        upperLevel: __DD,
        minValue: 0,
        maxValue: 23,
        initialValue: current && current.hh
    });

    var __mm = _DTItem({
        upperLevel: __hh,
        minValue: 0,
        maxValue: 59,
        initialValue: current && current.mm
    });

    var __ss = _DTItem({
        upperLevel: __mm,
        minValue: 0,
        maxValue: 59,
        initialValue: current && current.ss
    });

    if (options.makeBindable) {
        (function () {
            var __bi = new _EventTarget;

            _defineRO(__bi, 'year', __YY.val);
            _defineRO(__bi, 'month', __MM.val);
            _defineRO(__bi, 'day', __DD.val);
            _defineRO(__bi, 'hour', __hh.val);
            _defineRO(__bi, 'minute', __mm.val);
            _defineRO(__bi, 'second', __ss.val);

            _BindingLayer(this, __bi);
        }.call(this));
    }

    this.inc = __ss.inc;
    this.out = function _out() {
        return [__DD.out(), '.', __MM.out(), '.', __YY.out(), ' ', __hh.out(), ':', __mm.out(), ':', __ss.out()].join('');
    };
}

module.exports = function (current, options) {
    return new _DateTime(current, options);
};