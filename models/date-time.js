/**
 * created by mekhonoshyn on 20-Nov-14.
 */

var _hash = require('../external-utils/server/hash');

module.exports = {
    fields: [
        {
            name: 'time',
            initialValue: ''
        },
        'year',
        'month',
        'day',
        'hour',
        'minute',
        'second'
    ].map(function (field) {
        var _field;

        if (typeof field === 'string') {
            _field = {
                name: field,
                initialValue: 0
            };
        } else {
            _field = field;
        }

        _field.key = _hash();

        return _field;
    })
};