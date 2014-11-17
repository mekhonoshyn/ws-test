/**
 * created by mekhonoshyn on 11/12/14.
 */

function _hash() {
    'use strict';

    return parseInt(String(Math.random()).slice(2)).toString(16).toUpperCase();
}

(typeof module !== 'undefined') && (module.exports = _hash);