/**
 * Created by mekhonoshyn on 16-Dec-14.
 */

var _hash = require('../external-utils/server/hash');

module.exports = {
    fields: [
        {
            name: 'time',
            key: _hash(),
            initialValue: ''
        }
    ]
};