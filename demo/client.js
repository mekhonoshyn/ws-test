/**
 * created by mekhonoshyn on 10-Nov-14.
 */

var socket = _WSCli('ws://localhost:8082', true);

var red_binding,
    blue_binding,
    red_interface,
    blue_interface;

var localIOUnbindFn,
    serverTimeUnbindFn,
    dndUnbindFn;

//_ModelMgr.verbose(false);

socket.requireModel('dnd', 'CLIENT2CLIENT', _onDnDModelLoad);

socket.requireModel('time-only', 'SERVER2CLIENT', _onTimeOnlyModelLoad);

(function () {
    _ModelMgr.factory({
        name: 'local-io',
        def: {
            fields: [
                {
                    name: 'custom-field',
                    key: _hash(),
                    initialValue: document.querySelector('#local-input').value
                }
            ]
        }
    });

    var _unbindFns = new Array(4);

    _unbindFns[0] = _ModelMgr.bindToField('value', document.querySelector('#local-input'), 'custom-field', 'local-io', {
        modelMayReadOn: 'input'
    });

    for (var i = 0; i < 3; i++) {
        _unbindFns[i + 1] = _ModelMgr.bindToField('textContent', document.querySelector('#local-output-' + i), 'custom-field', 'local-io', {
            modelMayWrite: true,
            writeInitial: true
        });
    }

    localIOUnbindFn = function () {
        for (var i = 0; i < 4; i++) {
            _unbindFns[i]();
        }
    };
}());

socket.requireModel('time-only', 'SERVER2CLIENT', _onTimeOnlyModelLoad2);

function _onTimeOnlyModelLoad(socketUnbindModelFn) {
    _print('_onTimeOnlyModelLoad');

    var _labelUnbindModelFn = _ModelMgr.bindToField('textContent', document.querySelector('#server_time'), 'time', 'time-only', {
        modelMayWrite: true
    });

    serverTimeUnbindFn = function () {
        socketUnbindModelFn();

        _labelUnbindModelFn();
    };
}

function _onTimeOnlyModelLoad2(/*socketUnbindModelFn*/) {
    _print('_onTimeOnlyModelLoad2');

    _print('NB: you may run these functions to unbind corresponding functionality: localIOUnbindFn, serverTimeUnbindFn, dndUnbindFn')
}

function _onDnDModelLoad(socketUnbindModelFn) {
    var _unbindFns = new Array(8);

    _unbindFns[0] = _ModelMgr.bindToField('value', document.querySelector('#input_red_x'), 'red_x', 'dnd', {
        modelMayReadOn: 'change',
        modelMayWrite: true
    });

    _unbindFns[1] = _ModelMgr.bindToField('value', document.querySelector('#input_red_y'), 'red_y', 'dnd', {
        modelMayReadOn: 'change',
        modelMayWrite: true
    });

    _unbindFns[2] = _ModelMgr.bindToField('value', document.querySelector('#input_blue_x'), 'blue_x', 'dnd', {
        modelMayReadOn: 'change',
        modelMayWrite: true
    });

    _unbindFns[3] = _ModelMgr.bindToField('value', document.querySelector('#input_blue_y'), 'blue_y', 'dnd', {
        modelMayReadOn: 'change',
        modelMayWrite: true
    });

    red_interface = _DnDFactory({
        tTgt: document.querySelector('#rect_red'),
        binding: red_binding = _define(new _EventTarget, 'event', 'red_moved'),
        interface: true
    });

    _unbindFns[4] = _ModelMgr.bindToField('x', red_binding, 'red_x', 'dnd', {
        modelMayReadOn: red_binding.event,
        modelMayWrite: true,
        writeConverter: parseInt
    });

    _unbindFns[5] = _ModelMgr.bindToField('y', red_binding, 'red_y', 'dnd', {
        modelMayReadOn: red_binding.event,
        modelMayWrite: true,
        writeConverter: parseInt
    });

    blue_interface = _DnDFactory({
        tTgt: document.querySelector('#rect_blue'),
        binding: blue_binding = _define(new _EventTarget, 'event', 'blue_moved'),
        interface: true
    });

    _unbindFns[6] = _ModelMgr.bindToField('x', blue_binding, 'blue_x', 'dnd', {
        modelMayReadOn: blue_binding.event,
        modelMayWrite: true,
        writeConverter: parseInt
    });

    _unbindFns[7] = _ModelMgr.bindToField('y', blue_binding, 'blue_y', 'dnd', {
        modelMayReadOn: blue_binding.event,
        modelMayWrite: true,
        writeConverter: parseInt
    });

    dndUnbindFn = function () {
        for (var i = 0; i < 8; i++) {
            _unbindFns[i]();
        }

        socketUnbindModelFn();
    };

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