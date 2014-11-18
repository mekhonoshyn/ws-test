/**
 * Created by Sergii_Mekhonoshyn on 18-Nov-14.
 */

function _binder(context, fn) {
    var _slice = Array.prototype.slice,
        _args = _slice.call(arguments, 2);

    return function () {
        return fn.apply(context, _args.concat(_slice.call(arguments)));
    }
}

(typeof module !== 'undefined') && (module.exports = _binder);