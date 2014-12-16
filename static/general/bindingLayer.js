/**
 * created by mekhonoshyn on 11/21/14.
 */

var _print = _print || require('./print'),
    _hash = _hash || require('./hash'),
    _define = _define || require('./define'),

    _EventTarget = _EventTarget || require('./EventTarget'),
    _DataModel = _DataModel || require('./DataModel');

var _BindingLayer = (function _BindingLayerWrapper() {
    var _optionKeys = [
        'modelMayReadOn',
        'modelMayWrite',
        'readConverter',
        'writeConverter',
        'doOnUnbind'
    ];

    var _sharedModels = {};

    _BindingLayerWorker.model = function _model(modelName) {
        return _sharedModels[modelName].instance;
    };

    function _BindingLayerWorker(bindingTarget, bindingInterface) {
        'use strict';

        var _id = _hash(),
            _boundModels = {};

        function _bindModelField(model, modelField, options, isSource) {
            var _unbindFn = model.bind(bindingInterface, options.propName, modelField, options.modelMayReadOn, options.modelMayWrite, options.readConverter, options.writeConverter, isSource);

            _print('object`s [id:', _id, '] property "', options.propName, '" bound to model field "', modelField, '"');

            return _unbindFn ? (options.doOnUnbind ? function () {
                _unbindFn();

                options.doOnUnbind(options.propName);

                _print('object`s [id:', _id, '] property "', options.propName, '" unbound from model field "', modelField, '"');
            } : function () {
                _unbindFn();

                _print('object`s [id:', _id, '] property "', options.propName, '" unbound from model field "', modelField, '"');
            }) : (!!options.doOnUnbind && function () {
                options.doOnUnbind(options.propName);

                _print('object`s [id:', _id, '] property "', options.propName, '" unbound from model field "', modelField, '"');
            });
        }

        /**
         *
         * @param modelData - {
         *                      name - {String} //model name
         *                    }
         * @param mapping - {
         *                      %MODEL_FIELD_NAME%: {
         *                                              propName: {String},         //object property name to bind model field on
         *                                              modelMayReadOn: {Array},    //events on which model will read object`s data
         *                                              modelMayWrite: {Boolean},   //allow model to write data on update
         *                                              readConverter: {Function},  //function applied to convert data while transferring from object to model
         *                                              writeConverter: {Function}, //function applied to convert data while transferring from model to object
         *                                              doOnUnbind: {Function}      //onUnbind callback (accepts propName as a parameter)
         *                                          }
         *                  }
         * @param options - {
         *                      isSource: true/false    //indicates should model write data during binding process
         *                  }
         * @private
         */
        function _bindModel(modelData, mapping, options) {
            var _modelName = modelData.name,
                _modelFields = (modelData.def || (modelData.def = require('../../models/' + _modelName))).fields,
                _modelObject = _sharedModels[_modelName] || _print('model "', _modelName, '" added to list of shared models') || (_sharedModels[_modelName] = {
                    unbindFns: {},
                    instance: new _DataModel(_modelFields, {
                        defaultValues: options && options.defaultValues
                    })
                });

            Object.keys(mapping).forEach(function _forEach(mappingKey) {
                var _mappingItem = mapping[mappingKey];

                _mappingItem.propName || (_mappingItem.propName = mappingKey);

                _optionKeys.forEach(function _forEach(optionKey) {
                    if (_mappingItem[optionKey] === undefined) {
                        _mappingItem[optionKey] = options && options[optionKey];
                    }
                });
            });

            _boundModels[_modelName] = _modelObject;

            var _unbindModelFieldFns = _modelFields.map(function _map(fieldDef) {
                var _mapping = mapping[fieldDef.name];

                if (!_mapping) {
                    return;
                }

                if (!_mapping.modelMayWrite && !_mapping.modelMayReadOn) {
                    return;
                }

                return _bindModelField(_modelObject.instance, fieldDef.name, _mapping, options && options.isSource);
            }).filter(Boolean);

            _unbindModelFieldFns.length && (_modelObject.unbindFns[_id] = function _unbindObject() {
                var _unbindModelFieldFn;

                while (_unbindModelFieldFn = _unbindModelFieldFns.pop()) {
                    _unbindModelFieldFn();
                }
            });

            _print('object [id:', _id, '] bound to model "', _modelName, '" (current connections number: ', Object.keys(_modelObject.unbindFns).length, ')');
        }

        function _unbindModel(modelName) {
            var _unbindFns = _boundModels[modelName].unbindFns;

            _unbindFns[_id] && _unbindFns.extract(_id)();

            delete _boundModels[modelName];

            if (!Object.keys(_sharedModels[modelName].unbindFns).length) {
                _print('object [id:', _id, '] unbound from model "', modelName, '"');

                delete _sharedModels[modelName];

                _print('model "', modelName, '" destroyed as unclaimed');
            } else {
                _print('object [id:', _id, '] unbound from model "', modelName, '" (', Object.keys(_sharedModels[modelName].unbindFns).length, ' more left)');
            }
        }

        function _unbindAllModels() {
            Object.keys(_boundModels).forEach(_unbindModel);
        }

        function _invalidateModel(modelName, fieldNames) {
            _boundModels[modelName].instance.invalidate(bindingInterface, fieldNames);
        }

        bindingTarget.bindModel = _bindModel;
        bindingTarget.unbindModel = _unbindModel;
        bindingTarget.unbindAllModels = _unbindAllModels;
        bindingTarget.invalidateModel = _invalidateModel;
    }

    return _BindingLayerWorker;
}());

(typeof module !== 'undefined') && (module.exports = _BindingLayer);