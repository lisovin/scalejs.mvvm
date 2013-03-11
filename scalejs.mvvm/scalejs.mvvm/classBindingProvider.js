//knockout-classBindingProvider v0.4.0 | (c) 2012 Ryan Niemeyer | http://www.opensource.org/licenses/mit-license
// modified by Peter Lisovin:
// - requirejs-ified
// - added a `log` option
// - added a log warning if binding handler isn't found)
/*global define*/
define(['knockout'], function (ko) {
    'use strict';
    //a bindingProvider that uses something different than data-bind attributes
    //  bindings - an object that contains the binding classes
    //  options - is an object that can include "attribute", "virtualAttribute", bindingRouter, and "fallback" options
    return function classBindingProvider(options) {
        var existingProvider = new ko.bindingProvider(),
            bindings = {},
            bindingRouter,
            attribute,
            virtualAttribute;

        //returns a binding class, given the class name and the bindings object
        function defaultBindingRouter(className) {
            var classPath, bindingObject;

            //if the class name matches a property directly, then return it
            if (bindings[className]) {
                return bindings[className];
            }

            //search for sub-properites that might contain the bindings
            classPath = className.split(".");
            bindingObject = classPath.reduce(function (bindingObject, cp) { return bindingObject[cp]; }, bindings);

            return bindingObject;
        }

        function registerBindings(newBindings) {
            //allow bindings to be registered after instantiation
	        ko.utils.extend(bindings, newBindings);
        }

        function nodeHasBindings(node) {
            //determine if an element has any bindings
            var result, value;

            if (node.nodeType === 1) {
                result = node.getAttribute(attribute);
            } else if (node.nodeType === 8) {
                value = (node.nodeValue || node.text || '').toString();
                result = value.indexOf(virtualAttribute) > -1;
            }

            if (!result && options.fallback) {
                result = existingProvider.nodeHasBindings(node);
            }


            return result;
        }

        function getBindings(node, bindingContext) {
            //return the bindings given a node and the bindingContext
            var bindingAccessor,
                binding,
                bindingName,
                result = {},
                value,
                index,
                classes = "";

            if (node.nodeType === 1) {
                classes = node.getAttribute(attribute);
            } else if (node.nodeType === 8) {
                value = (node.nodeValue || node.text || '').toString();
                index = value.indexOf(virtualAttribute);

                if (index > -1) {
                    classes = value.substring(index + virtualAttribute.length);
                }
            }

            if (classes) {
                classes = classes
                    .replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "")
                    .replace(/(\s|\u00A0){2,}/g, " ")
                    .split(' ');
                //evaluate each class, build a single object to return
                classes.forEach(function (cp) {
                    bindingAccessor = bindingRouter(cp);
                    if (bindingAccessor) {
                        binding = typeof bindingAccessor === "function"
                            ? bindingAccessor.call(bindingContext.$data, bindingContext, classes)
                            : bindingAccessor;
                        ko.utils.extend(result, binding);
                    }
                });
            } else if (options.fallback) {
                result = existingProvider.getBindings(node, bindingContext);
            }

            //inspect the returned bindings
            for (bindingName in result) {
                if (result.hasOwnProperty(bindingName) &&
                        bindingName !== "_ko_property_writers" &&
                            !ko.bindingHandlers[bindingName]) {
                    if (options.log) {
                        if (binding) {
                            options.log('Unknown binding handler "' + bindingName + '" found in',
                                        node,
                                        'defined in data-class "' + classes + '" as',
                                        binding,
                                        'Make sure that binding handler\'s name spelled correctly ' +
                                        'and that it\'s properly registered. ' +
                                        'The binding will be ignored.');
                        } else {
                            options.log('Unknown binding handler "' + bindingName + '" in',
                                        node,
                                        'Make sure that it\'s name spelled correctly and that it\'s ' +
                                        'properly registered. ' +
                                        'The binding will be ignored.');
                        }
                    }
                }
            }

            return result;
        }

        options = options || {};
        attribute = options.attribute || "data-class";
        virtualAttribute = "ko " + (options.virtualAttribute || "class") + ":";
        bindingRouter = options.bindingRouter || defaultBindingRouter;

        return {
            registerBindings: registerBindings,
            getBindings: getBindings,
            nodeHasBindings: nodeHasBindings,
            bindingRouter: bindingRouter
        };
    };
});