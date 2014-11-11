/**
 * created by mekhonoshyn on 11/10/14.
 */

var socket = new WebSocket("ws://localhost:8082");

//debugger;

socket.onopen = function _onOpen() {
    _log('socket opened', arguments);
};

socket.onclose = function _onOpen() {
    _log('socket closed', arguments);
};

socket.onerror = function _onOpen() {
    _log('error occurred', arguments);
};

socket.onmessage = function _onOpen(event) {
    var data = JSON.parse(event.data);

    (handlers[data.type] || handlers.default)(data);
};

_define(socket, '$binds', new _EventTarget);

//socket.$binds.addEventListener('binding', function _onBindingUpdate(event) {
//    console.log(event);
//});

var handlers = {
    binding: function _bindingHandler(data) {
        _log('received binding update:', data);

//        socket.$binds[data.bindKey] = data.bindValue;

//        socket.$binds.test = data.bindValue;

        socket.$binds[data.bindKey] = data.bindValue;

        socket.$binds.dispatchEvent(data);
    },
    default: function _defaultHandler(data) {
        _log('default socket onMessage handler for data:', data);
    }
};

var model = new _Data;
var state = new _Data;

model.addField({
    name: 'inputValue',
    value: 'initial value'
});

model.addField({
    name: 'labelText',
    value: 'allow editing'
});

state.addField({
    name: 'editMode',
    value: false
});

var input = document.createElement('input');
var checkbox = document.createElement('input');
checkbox.type = 'checkbox';
var label = document.createElement('label');

state.bind('disabled', input, 'input.disabled', 'editMode', false, _not);
model.bind('value', input, 'input.value', 'inputValue', [ 'input' ]);
state.bind('checked', checkbox, 'checkbox.checked', 'editMode', [ 'change' ]);
model.bind('textContent', label, 'label.textContent', 'labelText');
model.bind('test', socket.$binds, 'socket.$binds.test', 'labelText', [ 'binding' ]);

document.body.appendChild(input);
document.body.appendChild(checkbox);
document.body.appendChild(label);