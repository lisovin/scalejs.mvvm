/*global define,document*/
/*jslint nomen: true*/
define([
    'knockout',
    'knockout.mapping',
    'scalejs!core',
    './classBindingProvider',
    './htmlTemplateSource',
    './selectable'
], function (
    ko,
    mapping,
    core,
    createClassBindingProvider,
    htmlTemplateSource,
    selectable
) {
    'use strict';

    var merge = core.object.merge,
        toArray = core.array.toArray,
        curry = core.functional.curry,
        classBindingProvider = createClassBindingProvider({
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

    function registerBindings(newBindings) {
        classBindingProvider.registerBindings(newBindings);
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

    function renderable(templateId, viewmodel) {
        return merge(viewmodel, {template: templateId});
    }

    function init() {
        var body = document.getElementsByTagName('body')[0];

        body.innerHTML = '<!-- ko class: scalejs-shell --><!-- /ko -->';
        registerBindings({
            'scalejs-shell': function (context) {
                return {
                    render: context.$data
                };
            }
        });

        ko.applyBindings(root);
    }

    return {
        core: {
            mvvm: {
                toJson: toJson,
                registerBindings: registerBindings,
                registerTemplates: registerTemplates
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
                renderable: curry(renderable),
                selectable: selectable,
                root: root
            }
        },
        init: init
    };
});
