var socket = new WebSocket("ws://localhost:8082");
var subscribeElem = document.querySelector('#subscribe');

document.forms.publish.onsubmit = function () {
    socket.send(this.message.value);
//    return false;
};

socket.onmessage = function (event) {
    showMessage(event.data);
};

function showMessage(message) {
    subscribeElem.appendChild(document.createElement('div')).appendChild(document.createTextNode(message));
}
