/*global define*/
define([
    'knockout',
    'scalejs!core'
], function (
    ko,
    core
) {
    'use strict';

    var is = core.type.is,
        has = core.object.has,
        unwrap = ko.utils.unwrapObservable;


    function wrapValueAccessor(valueAccessor) {
        return function () {
            var value = valueAccessor(),
                renderable = unwrap(value);

            function templateName(item) {
                return item.template;
            }

            if (is(renderable, 'array') || !has(renderable)) {
                return {
                    name: templateName,
                    foreach: renderable
                };
            }

            return {
                name: renderable.template,
                data: renderable
            };
        };
    }

    function init() {
        return { 'controlsDescendantBindings' : true };
    }

    /*jslint unparam: true*/
    function update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers.template.update(
            element,
            wrapValueAccessor(valueAccessor),
            allBindingsAccessor,
            viewModel,
            bindingContext
        );
    }
    /*jslint unparam: false*/

    return {
        init: init,
        update: update
    };
});
