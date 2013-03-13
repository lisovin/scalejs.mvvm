/*global define*/
define([
    'scalejs!core',
    'knockout',
    './scalejs.mvvm/mvvm',
    './scalejs.bindings/change',
    './scalejs.bindings/render',
    './scalejs.bindings/transitionable'
], function (
    core,
    ko,
    mvvm,
    changeBinding,
    renderBinding,
    transitionableBinding
) {
    'use strict';

    ko.bindingHandlers.change = changeBinding;
    ko.bindingHandlers.render = renderBinding;
    ko.bindingHandlers.transitionable = transitionableBinding;

    ko.virtualElements.allowedBindings.change = true;
    ko.virtualElements.allowedBindings.render = true;
    ko.virtualElements.allowedBindings.transitionable = true;

    mvvm.init();

    core.registerExtension(mvvm);
});

