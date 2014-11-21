/**
 * created by mekhonoshyn on 11/21/14.
 */

var _print = require('./print'),
    _hash = require('./hash'),
    _define = require('./define'),
    _EventTarget = require('./EventTarget'),
    _Data4Srv = require('../server/Data4Srv'),
    _path = require('path');

function _bindingLayer(object, bindingInterface, models) {
    'use strict';

    var _id = object.id || _hash(),
        _boundModels = {};

    function _bindModelField(model, modelField, options, isSource) {
        var _unbindFn = model.bind(bindingInterface, options.propName, modelField, options.modelMayReadOn, options.modelMayWrite, options.readConverter, options.writeConverter, isSource);

        _print('object [id:', _id, '] property "', options.propName, '" bound to model field "', modelField, '"');

        return function _onUnbind() {
            _unbindFn();

            options.removeOnUnbind && (delete bindingInterface[options.propName]);

            _print('object`s [id:', _id, '] property "', options.propName, '" unbound from model field "', modelField, '"');
        };
    }

    /**
     *
     * @param data - {
     *                  modelName: {String}
     *               }
     * @param mapping - {
     *                      %MODEL_FIELD_NAME%: {
     *                                              propName: {String},         //object property name to bind model field on
     *                                              modelMayReadOn: {Array},    //events on which model will read object`s data
     *                                              modelMayWrite: {Boolean},   //allow model to write data on update
     *                                              readConverter: {Function},  //function applied to convert data while transferring from object to model
     *                                              writeConverter: {Function}, //function applied to convert data while transferring from model to object
     *                                              removeOnUnbind: {Boolean}   //remove object property from object on unbinding model field
     *                                          }
     *                  }
     * @param options - {
     *                      isSource: true/false    //indicates should model write data during binding process
     *                  }
     * @private
     */

    function _bindModel(data, mapping, options) {
        var _modelName = data.modelName,
            _modelDef = require(_path.join(__dirname, '..', '..', 'models', _modelName)),
            _modelFields = _modelDef.fields,
            _modelObject = models[_modelName] || _print('model "', _modelName, '" added to list of shared models') || (models[_modelName] = {
                unbindFns: {},
                instance: new _Data4Srv(_modelFields)
            }),
            _mapping;

        if (typeof mapping === 'object') {
            _mapping = mapping;
        } else {
            _mapping = {};

            _modelFields.forEach(function _forEach(fieldDef) {
                _mapping[fieldDef.name] = {
                    propName: fieldDef[mapping]
                };
            });
        }

        Object.keys(_mapping).forEach(function _forEach(mappingKey) {
            var _mappingItem = _mapping[mappingKey];

            _mappingItem.propName = (_mappingItem.propName === undefined) ? mappingKey : _mappingItem.propName;

            [
                'modelMayReadOn',
                'modelMayWrite',
                'readConverter',
                'writeConverter',
                'removeOnUnbind'
            ].forEach(function _forEach(optionKey) {
                    _mappingItem[optionKey] = (_mappingItem[optionKey] === undefined) ? options[optionKey] : _mappingItem[optionKey];
                });
        });

        _boundModels[_modelName] = _modelObject;

        var _unbindModelFieldFns = _modelFields.map(function _map(fieldDef) {
            var _fieldMapping = _mapping[fieldDef.name];

            return _bindModelField(
                _modelObject.instance,
                fieldDef.name,
                _fieldMapping,
                options.isSource
            );
        });

        _modelObject.unbindFns[_id] = function _unbindObject() {
            var _unbindModelFieldFn;

            while (_unbindModelFieldFn = _unbindModelFieldFns.pop()) {
                _unbindModelFieldFn();
            }
        };

        _print('object [id:', _id, '] bound to model "', _modelName, '"');
    }

    function _unbindModel(modelName) {
        var _unbindFns = _boundModels[modelName].unbindFns;

        _unbindFns[_id]();

        delete _unbindFns[_id];

        delete _boundModels[modelName];

        _print('object "', _id, '" detached from model "', modelName, '"');

        if (!_unbindFns.length) {
            delete models[modelName];

            _print('model "', modelName, '" destroyed as unclaimed');
        }
    }

    function _unbindAllModels() {
        Object.keys(_boundModels).forEach(_unbindModel);
    }

    object.bindModel = _bindModel;
    object.unbindModel = _unbindModel;
    object.unbindAllModels = _unbindAllModels;
}

module.exports = _bindingLayer;