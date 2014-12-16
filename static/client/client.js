/**
 * created by mekhonoshyn on 11/10/14.
 */

'use strict';

var socket = _WSC('ws://localhost:8082');

//socket.getModel('date-time', function _callback(modelDT) {
//    modelDT.bind(document.querySelector('#server_time'), 'textContent', 'time', null, true);
//});

socket.getModel('time-only', function _callback(modelTO) {
    modelTO.bind(document.querySelector('#server_time'), 'textContent', 'time', null, true);
});

socket.getModel('dnd', _onModelLoad);

function _onModelLoad(modelDnD) {
    modelDnD.bind(document.querySelector('#input_red_x'), 'value', 'red_x', 'change', true);
    modelDnD.bind(document.querySelector('#input_red_y'), 'value', 'red_y', 'change', true);
    modelDnD.bind(document.querySelector('#input_blue_x'), 'value', 'blue_x', 'change', true);
    modelDnD.bind(document.querySelector('#input_blue_y'), 'value', 'blue_y', 'change', true);

    red_interface = _DnDFactory({
        tTgt: document.querySelector('#rect_red'),
        binding: red_binding = _define(new _EventTarget, 'event', 'red_moved'),
        interface: true
    });

    modelDnD.bind(red_binding, 'x', 'red_x', red_binding.event, true, null, parseInt, false);
    modelDnD.bind(red_binding, 'y', 'red_y', red_binding.event, true, null, parseInt, false);

    blue_interface = _DnDFactory({
        tTgt: document.querySelector('#rect_blue'),
        binding: blue_binding = _define(new _EventTarget, 'event', 'blue_moved'),
        interface: true
    });

    modelDnD.bind(blue_binding, 'x', 'blue_x', blue_binding.event, true, null, parseInt, false);
    modelDnD.bind(blue_binding, 'y', 'blue_y', blue_binding.event, true, null, parseInt, false);

    document.querySelector('.to-top').addEventListener('click', function _() {
        red_interface.y = 0;
    });

    document.querySelector('.to-right').addEventListener('click', function _() {
        red_interface.x = document.body.clientWidth - 200;
    });

    document.querySelector('.to-bottom').addEventListener('click', function _() {
        red_interface.y = document.body.clientHeight - 200;
    });

    document.querySelector('.to-left').addEventListener('click', function _() {
        red_interface.x = 0;
    });
}

var red_binding,
    blue_binding,
    red_interface,
    blue_interface;