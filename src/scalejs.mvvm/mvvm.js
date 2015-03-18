/*global define,document*/
/*jslint nomen: true*/
define([
    'knockout',
    'knockout.mapping',
    'scalejs!core',
    'scalejs.mvvm/classBindingProvider',
    './htmlTemplateSource',
    './selectableArray',
    './ko.utils'
], function (
    ko,
    mapping,
    core,
    ClassBindingProvider,
    htmlTemplateSource,
    selectableArray,
    koUtils
) {
    'use strict';

    var merge = core.object.merge,
        toArray = core.array.toArray,
        classBindingProvider = new ClassBindingProvider({}, {
            log: core.log.warn,
            fallback: true
        }),
        root = ko.observable();

    ko.bindingProvider.instance = classBindingProvider;

    function observable(initialValue) {
        return ko.observable(initialValue);
    }

    function observableArray(initialValue) {
        return ko.observableArray(initialValue);
    }

    function computed(func) {
        return ko.computed(func);
    }

    function toJson(viewModel) {
        // Extracts underlying value from observables
        return mapping.toJSON(viewModel);
    }

    function toObject(viewModel) {
        return JSON.parse(toJson(viewModel));
    }

    function registerBindings() {
        toArray(arguments).forEach(classBindingProvider.registerBindings.bind(classBindingProvider));
    }

    function toViewModel(data, viewModel, mappings) {
        var knockoutStyleMappings = Object.keys(mappings).reduce(function (o, k) {
            return merge(o, {
                k: k,
                create: function (options) { return mappings[k](options.data); }
            });
        }, {});

        return mapping.fromJS(data, knockoutStyleMappings, viewModel);
    }

    function registerTemplates() {
        toArray(arguments).forEach(htmlTemplateSource.registerTemplates);
    }

    function dataBinding(name, data) {
        var binding = {};

        binding[name] = data;

        return binding;
    }

    function template(name, data) {
        return dataBinding('template', {
            name: name,
            data: data
        });
    }

    function dataClass(name, data) {
        return {
            dataClass: name,
            viewmodel: data
        };
    }

    function getElement(name) {
        return document.getElementsByTagName(name)[0];
    }

    function init(config) {
        var body,
            opening_comment = document.createComment(' ko class: scalejs-shell '),
            closing_comment = document.createComment(' /ko ');

        // Set the node to the parent element of the currently running script
        body = document.getElementsByTagName('script');
        body = body[body.length - 1].parentElement;
            Array.prototype.slice.call(document.getElementsByTagName("script")).forEach(function (el) {
                if ((el.getAttribute('data-main') || '').indexOf("app/app") != -1) {
                    body = el.parentElement
                }
            });

        if (body === getElement('html') || body === getElement('head')) {
            body = getElement('body');
        }

        if (body && !config.doNotRender) {
            body.appendChild(opening_comment);
            body.appendChild(closing_comment);

            registerBindings({
                'scalejs-shell': function (context) {
                    return {
                        render: context.$data.root
                    };
                }
            });

            ko.applyBindings({ root: root }, body);
        }
    }

    return {
        core: {
            mvvm: {
                toJson: toJson,
                registerBindings: registerBindings,
                registerTemplates: registerTemplates,
                dataClass: dataClass,
                template: template,
                dataBinding: dataBinding,
                selectableArray: selectableArray,
                ko: {
                    utils: koUtils
                }
            }
        },
        sandbox: {
            mvvm: {
                observable: observable,
                observableArray: observableArray,
                computed: computed,
                registerBindings: registerBindings,
                registerTemplates: registerTemplates,
                toJson: toJson,
                toViewModel: toViewModel,
                toObject: toObject,
                dataClass: dataClass,
                template: template,
                dataBinding: dataBinding,
                selectableArray: selectableArray,
                root: root
            }
        },
        init: init
    };
});
