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
                name: 'dnd'
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
        _log('received model structure:', data);

        models[data.name] = _assemblyModel(data.definition);

        _onModelLoad();
    },
    binding: function _bindingHandler(data) {
        _log('received binding update:', data);

        socket.$binds[data.bindKey] = data.bindValue;

        socket.$binds.dispatchEvent(data);
    },
    unknown: function _defaultHandler(data) {
        _log('default socket onMessage handler for data:', data);
    }
};

function _assemblyModel(definition) {
    var root;

    if (definition.bindRoot) {
        root = new _Data(definition.fields);
    }

    return root;
}

function _socketField(key) {
    var _value;

    return {
        get: function _get() {
            return _value;
        },
        set: function _set(value) {
            (socket.readyState === 1) && socket.send({
                type: 'binding',
                data: {
                    bindKey: key,
                    bindValue: _value = value
                }
            });
        }
    };
}

function _addSocketBinding(model, fieldName) {
    var _key = model.$keys[fieldName],
        _field = _socketField(_key);

    _define(socket.$binds, _key, _field.get, _field.set);

    model.bind(socket.$binds, _key, fieldName, 'binding');
}

var models = {};

function _onModelLoad() {
    models.dnd.bind(document.querySelector('#input_red_x'), 'value', 'red_x', 'change', false, parseInt);
    models.dnd.bind(document.querySelector('#input_red_y'), 'value', 'red_y', 'change', false, parseInt);
    models.dnd.bind(document.querySelector('#input_blue_x'), 'value', 'blue_x', 'change', false, parseInt);
    models.dnd.bind(document.querySelector('#input_blue_y'), 'value', 'blue_y', 'change', false, parseInt);

    _addSocketBinding(models.dnd, 'red_x');
    _addSocketBinding(models.dnd, 'red_y');
    _addSocketBinding(models.dnd, 'blue_x');
    _addSocketBinding(models.dnd, 'blue_y');

    red_interface = _DnDFactory({
        tTgt: document.querySelector('#rect_red'),
        binding: red_binding = _define(new _EventTarget, 'event', 'red_moved')
    });

    models.dnd.bind(red_binding, 'x', 'red_x', red_binding.event);
    models.dnd.bind(red_binding, 'y', 'red_y', red_binding.event);

    blue_interface = _DnDFactory({
        tTgt: document.querySelector('#rect_blue'),
        binding: blue_binding = _define(new _EventTarget, 'event', 'blue_moved')
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

//1000	609	851	120