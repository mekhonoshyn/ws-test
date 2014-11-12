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

var models = {};

function _onModelLoad() {
    var input_red_x = document.querySelector('#input_red_x');
    var input_red_y = document.querySelector('#input_red_y');
    var input_blue_x = document.querySelector('#input_blue_x');
    var input_blue_y = document.querySelector('#input_blue_y');

    models.dnd.bind('value', input_red_x, 'input_red_x.value', 'red_x', [ 'change' ]);
    models.dnd.bind('value', input_red_y, 'input_red_y.value', 'red_y', [ 'change' ]);
    models.dnd.bind('value', input_blue_x, 'input_blue_x.value', 'blue_x', [ 'change' ]);
    models.dnd.bind('value', input_blue_y, 'input_blue_y.value', 'blue_y', [ 'change' ]);

//    models.model.bind('test', socket.$binds, 'socket.$binds.test', 'labelText', [ 'binding' ]);

    red_transform = _DnDFactory({
        tTgt: document.querySelector('#rect_red'),
        onDrop: function _onDrop() {
            red_transform.dispatchEvent({
                type: 'new_xy'
            });
        }
    });

    red_transform.mixWith(_EventTarget);

    models.dnd.bind('x', red_transform, 'red_transform.x', 'red_x', [ 'new_xy' ]);
    models.dnd.bind('y', red_transform, 'red_transform.y', 'red_y', [ 'new_xy' ]);

    blue_transform = _DnDFactory({
        tTgt: document.querySelector('#rect_blue'),
        onDrop: function _onDrop() {
            blue_transform.dispatchEvent({
                type: 'new_xy'
            });
        }
    });

    blue_transform.mixWith(_EventTarget);

    models.dnd.bind('x', blue_transform, 'blue_transform.x', 'blue_x', [ 'new_xy' ]);
    models.dnd.bind('y', blue_transform, 'blue_transform.y', 'blue_y', [ 'new_xy' ]);
}

var red_transform,
    blue_transform;