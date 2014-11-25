/**
 * created by mekhonoshyn on 11/21/14.
 */

function _print() {
    'use strict';

    console.log(Array.prototype.join.call(Array.prototype.map.call(arguments, String), ''));
}

(typeof module !== 'undefined') && (module.exports = _print);