/**
 * created by mekhonoshyn on 11/12/14.
 */

var hash = require('../hash');

module.exports = {
    "bindRoot": true,
    "fields": [
        {
            "key": hash(),
            "name": "red_x",
            "value": 100
        },
        {
            "key": hash(),
            "name": "red_y",
            "value": 200
        },
        {
            "key": hash(),
            "name": "blue_x",
            "value": 300
        },
        {
            "key": hash(),
            "name": "blue_y",
            "value": 400
        }
    ]
};
