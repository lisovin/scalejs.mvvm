/*global define,document*/
define([
    'knockout',
    'knockout.mapping',
    'knockout-classBindingProvider',
    'scalejs!core'
], function (
    ko,
    mapping,
    ClassBindingProvider,
    core
) {
    'use strict';

    var //has = core.object.has,
        iter = core.array.iter,
        merge = core.object.merge,
        classBindingProvider = new ClassBindingProvider(),
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

    function appendTemplate(html) {
        var head = document.getElementsByTagName('head')[0],
            div = document.createElement('div'),
            templateHtml,
            script;

        div.innerHTML = html;

        iter(div.childNodes, function (childNode) {
            if (childNode.nodeType === 1) {
                templateHtml = childNode.innerHTML;
                script = document.createElement('script');
                script.type = 'text/html';
                script.id = childNode.id;
                script.innerHTML = templateHtml;
                head.appendChild(script);
            }
        });

        div.innerHTML = '';
    }

    function registerTemplates() {
        iter(arguments, appendTemplate);
    }

    function renderable(templateId, viewmodel) {
        return merge(viewmodel, {template: templateId});
    }

    function init() {
        var body = document.getElementsByTagName('body')[0];

        body.innerHTML = '<!-- ko class: scalejs-shell --><!-- /ko -->';
        registerBindings({
            'scalejs-shell': function () {
                return {
                    render: this
                };
            }
        });

        ko.applyBindings(root);
    }

    init();

    return {
        core: {
            mvvm: {
                toJson: toJson,
                registerBindings: registerBindings,
                registerTemplates: registerTemplates,
                appendTemplate: appendTemplate
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
                renderable: renderable,
                root: root
            }
        }
    };
});
