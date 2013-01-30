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

    var has = core.object.has,
        iter = core.array.iter,
        classBindingProvider = new ClassBindingProvider();

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
        var knockoutStyleMappings = core.linq.enumerable
                .from(mappings)
                .select(function (kv) {
                    return {
                        Key: kv.Key,
                        create: function (options) { return kv.Value(options.data); }
                    };
                })
                .toObject();

        return mapping.fromJS(data, knockoutStyleMappings, viewModel);
    }

    function resolveNamespace(path, namespaces) {
        var slash = path.lastIndexOf('/'),
            namespace,
            control;

        if (slash < 0) {
            return has(namespaces, '') ? namespaces[''] + '/' + path : path;
        }

        namespace = path.substring(0, slash);
        control = path.substring(slash + 1);

        if (has(namespaces, namespace)) {
            namespace = namespaces[namespace];
        }

        return namespace + '/' + control;
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


    function buildSandbox(sandbox) {
        var $ = core.dom.$;

        function createView(options) {
            var dataContext = options.dataContext || { },
                templates = options.templates || [],
                bindings = options.bindings || [],
                moduleBindings = { },
                moduleId = sandbox.getModuleId(),
                moduleClass = moduleId,
                moduleBaseClass = 'scalejs-module-' + moduleId,
                templateId = moduleId + '_template',
                defaultTemplateHtml = '<div id="' + templateId + '_template"></div>',
                moduleTemplate = $('#' + templateId),
                box;

            // append template to document body if it doesn't exist yet
            if (!has(moduleTemplate)) {
                iter(templates, appendTemplate);

                // if module template still doesn't exist in DOM then create default one
                moduleTemplate = $('#' + templateId);
                if (!has(moduleTemplate)) {
                    appendTemplate(defaultTemplateHtml);
                }
            }
            // append module instance div
            box = sandbox.getBox();
            box.setAttribute('class', moduleClass);
            box.setAttribute('data-class', moduleBaseClass + ' ' + moduleClass);
            //sandbox.dom.appendHtml('<div data-class="' + moduleBaseClass + ' ' + moduleClass + '"></div>');
            // register module binding
            moduleBindings[moduleBaseClass] =
                function () {
                    return {
                        template: {
                            name: templateId
                        }
                    };
                };
            registerBindings(moduleBindings);
            // register additional module bindings 
            iter(bindings, function (bindingsOrFactory) {
                var bindingsInstance;

                if (core.type.is(bindingsOrFactory, 'function')) {
                    bindingsInstance = bindingsOrFactory(sandbox);
                } else {
                    bindingsInstance = bindingsOrFactory;
                }

                registerBindings(bindingsInstance);
            });

            // apply bindings
            ko.applyBindings(dataContext, box);
        }

        sandbox.mvvm = {
            createView: createView,
            observable: observable,
            observableArray: observableArray,
            computed: computed,
            registerBindings: registerBindings,
            //addCustomBinding: addCustomBinding,
            //unwrapObservable: unwrapObservable,
            toJson: toJson,
            toViewModel: toViewModel
        };
    }

    return {
        toJson: toJson,
        resolveNamespace: resolveNamespace,
        buildSandbox: buildSandbox,
        registerBindings: registerBindings,
        appendTemplate: appendTemplate
    };
});
