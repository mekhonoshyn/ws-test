/**
 * created by mekhonoshyn on 12-Nov-14.
 */

var _hash = require('../external-utils/server/hash'),
    _defaults = require('./defaults/dnd');

module.exports = {
    fields: [
        'red_x',
        'red_y',
        'blue_x',
        'blue_y'
    ].map(function (fieldName) {
        return {
            name: fieldName,
            key: _hash(),
            initialValue: _defaults[fieldName]
        };
    })
};
