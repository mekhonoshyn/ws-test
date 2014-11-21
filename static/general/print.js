/**
 * created by mekhonoshyn on 11/21/14.
 */

function _print() {
    console.log(Array.prototype.join.call(arguments, ''));
}

(typeof module !== 'undefined') && (module.exports = _print);