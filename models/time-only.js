/**
 * Created by mekhonoshyn on 16-Dec-14.
 */

var _hash = require('../static/general/hash');

module.exports = {
    bindRoot: true,
    fields: [
        'time'
    ].map(function (fieldName) {
            return {
                name: fieldName,
                key: _hash()
            };
        })
};