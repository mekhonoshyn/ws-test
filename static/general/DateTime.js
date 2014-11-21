/**
 * created by mekhonoshyn on 11/20/14.
 */

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

        if (_initialValue === undefined || _initialValue < _minValue || _initialValue > _maxValue()) {
            _val(_minValue);
        } else {
            _val(_initialValue);
        }
    })();

    return _this;
}

function _DateTime(now) {
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
        initialValue: now && now.YY,
        length: 4,
        onChange: function _onChange(__YY) {
            _DD_by_MM[2] = __YY.val() % 4 ? 28 : 29;
        }
    });

    var __MM = _DTItem({
        upperLevel: __YY,
        minValue: 1,
        maxValue: 12,
        initialValue: now && now.MM
    });

    var __DD = _DTItem({
        upperLevel: __MM,
        minValue: 1,
        maxValue: function _maxValue() {
            return _DD_by_MM[__MM.val()];
        },
        initialValue: now && now.DD
    });

    var __hh = _DTItem({
        upperLevel: __DD,
        minValue: 0,
        maxValue: 23,
        initialValue: now && now.hh
    });

    var __mm = _DTItem({
        upperLevel: __hh,
        minValue: 0,
        maxValue: 59,
        initialValue: now && now.mm
    });

    var __ss = _DTItem({
        upperLevel: __mm,
        minValue: 0,
        maxValue: 59,
        initialValue: now && now.ss
    });

    var __bi = new _EventTarget;

    _defineRO(__bi, 'year', __YY.val);
    _defineRO(__bi, 'month', __MM.val);
    _defineRO(__bi, 'day', __DD.val);
    _defineRO(__bi, 'hour', __hh.val);
    _defineRO(__bi, 'minute', __mm.val);
    _defineRO(__bi, 'second', __ss.val);

    return {
        inc: __ss.inc,
        val: function _val() {
            return 0;
        },
        out: function _out() {
            return [__DD.out(), '.', __MM.out(), '.', __YY.out(), ' ', __hh.out(), ':', __mm.out(), ':', __ss.out()].join('');
        },
        bi: __bi
    };
}

var _defineRO = require('./defineRO'),
    _bindingLayer = require('./bindingLayer');
    _EventTarget = require('./EventTarget');

module.exports = function (models, initials) {
    var dtObject = _DateTime(initials);

    _bindingLayer(dtObject, dtObject.bi, models);

    return dtObject;
};