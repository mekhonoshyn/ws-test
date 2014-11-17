/**
 * created by mekhonoshyn on 11/10/14.
 */

var socket = new WebSocket("ws://localhost:8082");

socket.onopen = function _onOpen(event) {
    _log('socket opened:', event);

    socket.send({
        type: 'request',
        data: {
            type: 'model',
            data: {
                type: 'structure',
                data: {
                    name: 'dnd'
                }
            }
        }
    });
};

socket.onclose = function _onOpen() {
    _log('socket closed', arguments);
};

socket.onerror = function _onOpen() {
    _log('error occurred', arguments);
};

socket.onmessage = function _onMessage(event) {
    _handle(JSON.parse(event.data));
};

_define(socket, '$binds', new _EventTarget);
_define(socket.$binds, 'isSocket', true);

function _handle(data) {
    if (handlers[data.type]) {
        handlers[data.type](data.data);
    } else {
        handlers.unknown(data);
    }
}

var handlers = {
    response: function _responseHandler(data) {
        _log('received response:', data);

        _handle(data);
    },
    model: function _modelHandler(data) {
        _log('received model response:', data);

        handlers['model:' + data.type](data.data);
    },
    'model:structure': function _modelStructureHandler(data) {
        _log('received model structure response:', data);

        models[data.name] = _assemblyModel(data.definition);

        _onModelLoad();
    },
    'model:data': function _modelDataHandler(data) {
        _log('received model data response:', data);
    },
    binding: function _bindingHandler(data) {
        socket.denySending = true;

        socket.$binds[data.bindKey] = data.bindValue;

        socket.denySending = false;

        socket.$binds.dispatchEvent({
            type: 'binding:' + data.bindKey
        });
    },
    unknown: function _defaultHandler(data) {
        _log('default socket onMessage handler for data:', data);
    }
};

function _assemblyModel(definition) {
    var root;

    if (definition.bindRoot) {
        root = new _Data(definition.fields, socket);
    }

    return root;
}

var models = {};

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