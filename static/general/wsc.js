/**
 * Created by Sergii_Mekhonoshyn on 19-Nov-14.
 */

function _WSC(address, models) {
    var socket = new WebSocket(address);

    _WS4Cli(socket);

    _WSB4Cli(socket);

    return socket;
}