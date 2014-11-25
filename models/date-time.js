/**
 * created by mekhonoshyn on 11/20/14.
 */

var _hash = require('../static/general/hash');

module.exports = {
    bindRoot: true,
    fields: [
        'year',
        'month',
        'day',
        'hour',
        'minute',
        'second'
    ].map(function (fieldName) {
        return {
            name: fieldName,
            key: _hash()
        };
    })
};