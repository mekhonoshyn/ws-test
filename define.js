/**
 * created by mekhonoshyn on 11/14/14.
 */

function _define(context, property, getter, setter) {
    var definition = {};

    if (setter) {
        definition.get = getter;
        definition.set = setter;
    } else {
        definition.value = getter;
    }

    return Object.defineProperty(context, property, definition);
}

(typeof module !== 'undefined') && (module.exports = _define);
