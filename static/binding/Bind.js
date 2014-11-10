/**
 * created by mekhonoshyn on 11/10/14.
 */

function _Bind(listeners) {
    _define(this, '$listeners', listeners);
}

_define(_Bind.prototype, 'watch', function _watch(identifier, target, property, events) {
    this.$listeners.push({
        identifier: identifier,
        target: target,
        property: property,
        events: events
    });
});

_define(_Bind.prototype, 'unwatch', function _unwatch(identifier) {
    var index = this.$listeners.length;

    for (var i = 0; i < index; i++) {
        if (this.$listeners[i].identifier === identifier) {
            index = i;
            
            break;
        }
    }
    
    return this.$listeners.splice(index, 1)[0];
});