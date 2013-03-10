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
            var value = unwrap(valueAccessor()),
                data;

            /*jslint unparam:true*/
            function templateName(item, ctx) {
                var index = ctx.$index(),
                    el = value[index];

                return el.template;
            }
            /*jslint unparam:false*/

            if (is(value, 'array')) {
                data = value.map(function (item) {
                    return item.data;
                });

                return {
                    name: templateName,
                    foreach: data
                };
            }

            if (is(value, 'string')) {
                return {
                    text: value
                };
            }

            if (has(value, 'template')) {
                return {
                    name: value.template,
                    data: value.data
                };
            }

            // trick: since value.data is undefined, foreach won't actually call templateName
            // but knockout is happy since `name` is there
            return {
                name: templateName,
                foreach: undefined
            };
        };
    }

    function init() {
        return { 'controlsDescendantBindings' : true };
    }

    /*jslint unparam: true*/
    function update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = unwrap(valueAccessor()),
            result;

        result = ko.bindingHandlers.template.update(
            element,
            wrapValueAccessor(valueAccessor),
            allBindingsAccessor,
            viewModel,
            bindingContext
        );

        if (is(value, 'afterRender', 'function')) {
            value.afterRender(element);
        }

        return result;
    }
    /*jslint unparam: false*/

    return {
        init: init,
        update: update
    };
});
