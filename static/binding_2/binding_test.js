/**
 * created by mekhonoshyn on 11/10/14.
 */

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

document.body.appendChild(input);
document.body.appendChild(checkbox);
document.body.appendChild(label);