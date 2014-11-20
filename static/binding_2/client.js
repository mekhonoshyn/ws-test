/**
 * created by mekhonoshyn on 11/10/14.
 */

'use strict';

var models = {};

var socket = _WSC('ws://localhost:8082', models);

socket.getModel('dnd', _onModelLoad);

function _onModelLoad() {
    models.dnd.bind(document.querySelector('#input_red_x'), 'value', 'red_x', 'change', false, parseInt);
    models.dnd.bind(document.querySelector('#input_red_y'), 'value', 'red_y', 'change', false, parseInt);
    models.dnd.bind(document.querySelector('#input_blue_x'), 'value', 'blue_x', 'change', false, parseInt);
    models.dnd.bind(document.querySelector('#input_blue_y'), 'value', 'blue_y', 'change', false, parseInt);

    red_interface = _DnDFactory({
        tTgt: document.querySelector('#rect_red'),
        binding: red_binding = _define(new _EventTarget, 'event', 'red_moved'),
        interface: true
    });

    models.dnd.bind(red_binding, 'x', 'red_x', red_binding.event);
    models.dnd.bind(red_binding, 'y', 'red_y', red_binding.event);

    blue_interface = _DnDFactory({
        tTgt: document.querySelector('#rect_blue'),
        binding: blue_binding = _define(new _EventTarget, 'event', 'blue_moved'),
        interface: true
    });

    models.dnd.bind(blue_binding, 'x', 'blue_x', blue_binding.event);
    models.dnd.bind(blue_binding, 'y', 'blue_y', blue_binding.event);

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