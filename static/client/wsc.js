/**
 * Created by mekhonoshyn on 19-Nov-14.
 */

function _WSC(address) {
    var socket = new WebSocket(address);

    _WS4Cli(socket, {
        makeBindable: true
    });

    return socket;
}