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

    return {
        inc: __ss.inc,
        val: function _val() {
            return 0;
        },
        out: function _out() {
            return [__DD.out(), '.', __MM.out(), '.', __YY.out(), ' ', __hh.out(), ':', __mm.out(), ':', __ss.out()].join('');
        }
    };
}

module.exports = function (models, initials) {
    var dtObject = _DateTime(initials);

    _prepare4Binding(dtObject, models);

    return dtObject;
};

var _log = require('./log'),
    _hash = require('./hash'),
    _define = require('./define'),
    _EventTarget = require('./EventTarget'),
    _Data4Srv = require('../server/Data4Srv');

function _prepare4Binding(object, models) {
    'use strict';

    var _id = object.id || (object.id = _hash());

    object.attachModel = function _attachModel(data) {
        var _name = data.name;

        data.definition = require('../../models/' + _name);

        var _fields = data.definition.fields,
            _model = models[_name] ||
                _log('model "', _name, '" added to list of shared models') ||
                (models[_name] = {
                    detachFns: {},
                    instance: new _Data4Srv(_fields)
                });

        _models[_name] = _model;

        var removeFieldFns = _fields.map(function _map(fieldDef) {
            return _addField(_model.instance, fieldDef.key, fieldDef.name);
        });

        _model.detachFns[_id] = (function _detachClientWrapper(fieldsLength) {
            return function _detachClient() {
                while (fieldsLength--) {
                    removeFieldFns.splice(0, 1)[0]();
                }
            }
        })(_fields.length);

        _log('object "', _id, '" attached to model "', _name, '"');
    };

    function _addField(model, key, name) {
//        var _value;
//
//        _define(_binds, key, function _getValue() {
//            return _value;
//        }, function _setValue(value) {
//            _value = value;
//        }, true);

        var unbindFn = model.bind(_binds, key, name, key);

        _log('field "', name, ':', key, '" added to object "', _id, '" bindings');

        return function() {
            unbindFn();

            delete _binds[key];

            _log('field "', name, ':', key, '" removed from object "', _id, '" bindings');
        };
    }

    var _models = {},
        _binds = new _EventTarget/*,
        _denySending = false*/;

//    object.addHandler('binding', function _bindingHandler(data) {
//        _denySending = true;
//
//        _binds[data.bindKey] = data.bindValue;
//
//        _denySending = false;
//
//        _binds.dispatchEvent({
//            type: data.bindKey
//        });
//    });

    function _detachModel(name) {
        var _detachFns = _models[name].detachFns;

        _detachFns[_id]();

        delete _detachFns[_id];

        delete _models[name];

        _log('object "', _id, '" detached from model "', name, '"');

        if (!_detachFns.length) {
            delete models[name];

            _log('model "', name, '" destroyed as unclaimed');
        }
    }

    function _detachAllModels() {
        Object.keys(_models).forEach(_detachModel);
    }

    object.detachModel = _detachModel;
    object.detachAllModel = _detachAllModels;
}
