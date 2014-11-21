/**
 * created by mekhonoshyn on 11/14/14.
 */

function _defineRO(context, property, getter, configurable) {
    'use strict';

    return Object.defineProperty(context, property, {
        get: getter,
        configurable: !!configurable
    });
}

(typeof module !== 'undefined') && (module.exports = _defineRO);