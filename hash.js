/**
 * created by mekhonoshyn on 11/12/14.
 */

module.exports = function _hash() {
    return parseInt(String(Math.random()).slice(2)).toString(16).toUpperCase();
};
