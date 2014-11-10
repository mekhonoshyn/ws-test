/**
 * created by mekhonoshyn on 11/10/14.
 */

var data = new _Data;

data.addField('description');

var nested = data.nested = new _Data;
nested.addField(0);

var label1 = document.body.appendChild(document.createElement('label'));
document.body.appendChild(document.createElement('br'));
var label2 = document.body.appendChild(document.createElement('label'));
document.body.appendChild(document.createElement('br'));
var label3 = document.body.appendChild(document.createElement('label'));
document.body.appendChild(document.createElement('br'));
var input1 = document.body.appendChild(document.createElement('input'));
document.body.appendChild(document.createElement('br'));
var input2 = document.body.appendChild(document.createElement('input'));

data.bind('textContent', label1, 'description_label1', 'description');
nested.bind('textContent', label2, 'description_label2', 0);
data.bind('textContent', label3, 'description_label3', 'description');
data.bind('value', input1, 'description_input1', 'description', [ 'input' ]);
nested.bind('value', input2, 'description_input2', 0, [ 'input', 'change' ]);


var model = {
    entries: [
        new _Data([
            {
                name: 'name',
                value: 'initial name'
            },
            'description'
        ]),
        new _Data([
            'name',
            'description'
        ]),
        new _Data([
            'name',
            'description'
        ])
    ]
};

var table = document.createElement('table');

var head = table.createTHead();
var rowH = head.insertRow();
var cell0H = rowH.insertCell();
cell0H.textContent = 'name';
var cell1H = rowH.insertCell();
cell1H.textContent = 'description';

var row0 = table.insertRow();
var cell00 = row0.insertCell();
model.entries[0].bind('textContent', cell00, 'name_label_row0', 'name');
var cell10 = row0.insertCell();
model.entries[0].bind('textContent', cell10, 'description_label_row0', 'description');

var row1 = table.insertRow();
var cell01 = row1.insertCell();
var cell11 = row1.insertCell();

var row2 = table.insertRow();
var cell02 = row2.insertCell();
var cell12 = row2.insertCell();

document.body.appendChild(document.createElement('br'));
document.body.appendChild(table);