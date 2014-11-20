/**
 * created by mekhonoshyn on 11/12/14.
 */

function _pad(len, val) {
    'use strict';

    return ('00000000' + val).slice(-len);
}

(typeof module !== 'undefined') && (module.exports = _pad);