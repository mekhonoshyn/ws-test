/**
 * created by mekhonoshyn on 11/12/14.
 */

var hash = require('../static/general/hash');

module.exports = {
    bindRoot: true,
    fields: [
        {
            name: 'red_x',
            value: 100
        },
        {
            name: 'red_y',
            value: 200
        },
        {
            name: 'blue_x',
            value: 300
        },
        {
            name: 'blue_y',
            value: 400
        }
    ].map(function (field) {
        field.key = hash();
            
        return field;
    })
};
