/*global define*/
/// <reference path="../Scripts/_references.js" />
define([
    'scalejs!core',
    'knockout',
    'scalejs.functional'
], function (
    core,
    ko
) {
    /// <param name="ko" value="window.ko" />
    'use strict';

    var is = core.type.is,
        has = core.object.has,
        unwrap = ko.utils.unwrapObservable,
        complete = core.functional.builders.complete,
        $DO = core.functional.builder.$DO,
        oldElement,
        oldBinding,
        context;


    function init() {
        return { 'controlsDescendantBindings' : true };
    }

    /*jslint unparam: true*/
    function update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = unwrap(valueAccessor()),
            inTransition,
            outTransition,
            bindingAccessor,
            binding,
            result;

        if (!value) {
            return;
        }

        if (is(value.dataClass, 'string')) {
            // if dataClass is specified then get the binding from the bindingRouter
            bindingAccessor = ko.bindingProvider.instance.bindingRouter(value.dataClass);
            if (!bindingAccessor) {
                throw new Error('Don\'t know how to render binding "' + value.dataClass +
                                '" - no such binding registered. ' +
                                'Either register the bindng or correct its name.');
            }

            if (bindingAccessor) {
                binding = is(bindingAccessor, 'function')
                        ? bindingAccessor.call(value.viewmodel || viewModel, bindingContext)
                        : bindingAccessor;
            }

        } else {
            // otherwise whole object is the binding
            binding = is(value, 'function') ? value.call(viewModel, bindingContext) : value;
        }

        if (has(oldBinding) && has(oldBinding.transitions, 'outTransitions')) {
            outTransition = complete.apply(null,
                oldBinding.transitions.outTransitions.map(function (t) { return $DO(t); }));
            context = {
                getElement: function () {
                    return oldElement;
                }
            };

            outTransition.call(context, function () {
                result = ko.applyBindingsToNode(element, binding, viewModel);
            });
        } else {
            result = ko.applyBindingsToNode(element, binding, viewModel);
        }

        if (has(binding, 'transitions')) {
            if (has(binding.transitions, 'inTransitions')) {
                inTransition = complete.apply(null, binding.transitions.inTransitions.map(function (t) { return $DO(t); }));
                context = {
                    getElement: function () {
                        return element;
                    }
                };

                setTimeout(function () {
                    inTransition.call(context);
                }, 0);
            }
            oldBinding = binding;
            oldElement = element;
        } else {
            oldBinding = undefined;
            oldElement = undefined;
        }

        if (is(binding, 'afterRender', 'function')) {
            binding.afterRender(element);
        }

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
