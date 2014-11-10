/**
 * created by mekhonoshyn on 11/10/14.
 */

function _define(context, property, getter, setter) {
    var definition = {};

    if (setter) {
        definition.get = getter;
        definition.set = setter;
    } else {
        definition.value = getter;
    }

    Object.defineProperty(context, property, definition);
}

_define(Array.prototype, 'isArray', true);