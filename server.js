//var http = require('http');
//var nodeStatic = require('node-static');
//var nsServer = new nodeStatic.Server('.');
var WebSocket = require('ws');
var WSServer = new WebSocket.Server({
    port: 8082
});
var _hash = require('./hash');
var _log = require('./log');
var _define = require('./define');
var _Data = require('./static/tst/Data4Srv');
var _EventTarget = require('./static/binding_2/EventTarget');

//http.createServer(function (req, res) {
//    nsServer.serve(req, res);
//}).listen(8081);

(function _overrideSend() {
    var _originalSend = WebSocket.prototype.send;

    _define(WebSocket.prototype, 'send', function _send(data) {
        _originalSend.call(this, JSON.stringify(data));
    });
})();

_define(WebSocket.prototype, 'addField', function _addField(model, key, name) {
//    _log(arguments);

    var _value,
        _msg = {
            type: 'binding',
            data: {
                bindKey: null,
                bindValue: null
            }
        };

    _define(this.$binds, key, function _getValue() {
        return _value;
    }, function _setValue(value) {
        _value = value;

//        if (this.readyState === 1) {
//            _msg.data.bindKey = key;
//            _msg.data.bindValue = value;
//
//            this.send(_msg);
//        }
    }.bind(this));

    model.bind(this.$binds, key, name, 'binding');
});

WSServer.on('connection', function (client) {
    var _id = _hash();

//    _log(JSON.stringify(Object.keys(client.constructor.prototype)));
//    _log(JSON.stringify(client.constructor.name));

    _log('connection opened:', _id);

    client.on('message', function (rawData) {
        _handle(client, JSON.parse(rawData));
    });

    client.on('close', function () {
        _log('connection closed:', _id);

        Object.keys(models).forEach(function _forEach(modelName) {
            models[modelName].detachClient(client);
        });
    });
});

function _handle(client, data) {
    if (handlers[data.type]) {
        handlers[data.type](client, data.data);
    } else {
        handlers.unknown(client, data);
    }
}

function _assemblyModel(definition) {
    var root;

    if (definition.bindRoot) {
        root = new _Data(definition.fields);
    }

    return root;
}

var models = {};

var handlers = {
    request: function _requestHandler(client, data) {
        _log('received request:', data);

        _handle(client, data);
    },
    model: function _modelHandler(client, data) {
        _log('received model request:', data);

        handlers['model:' + data.type](client, data.data);
    },
    'model:structure': function _modelStructureHandler(client, data) {
        _log('received model structure request:', data);

        client.$binds || _define(client, '$binds', new _EventTarget);

        var _name = data.name,
            _definition = require('./models/' + _name);

        //assembly model if does not exist
        models[_name] || (models[_name] = _assemblyModel(_definition));

        //send model definition to client
        client.send({
            type: 'response',
            data: {
                type: 'model',
                data: {
                    type: 'structure',
                    data: {
                        name: _name,
                        definition: _definition
                    }
                }
            }
        });

        //attach client to model
        models[_name].attachClient(client);
    },
    'model:data': function _modelDataHandler(client, data) {
        _log('received model data request:', data);
    },
    binding: function _bindingHandler(client, data) {
        _log('received binding update:', data);

        client.$binds[data.bindKey] = data.bindValue;

        client.$binds.dispatchEvent({
            type: 'binding'
        });
    },
    unknown: function _defaultHandler(client, data) {
        _log('default socket onMessage handler for data:', data);
    }
};

_log('server is listening ports 8081, 8082');