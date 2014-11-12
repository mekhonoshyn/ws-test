/**
 * created by mekhonoshyn on 11/12/14.
 */

var hash = require('../hash');

module.exports = {
    "bindRoot": true,
    "key": hash(),
    "fields": [
        {
            "name": "red_x",
            "value": 100
        },
        {
            "name": "red_y",
            "value": 100
        },
        {
            "name": "blue_x",
            "value": 300
        },
        {
            "name": "blue_y",
            "value": 300
        }
    ]
};
