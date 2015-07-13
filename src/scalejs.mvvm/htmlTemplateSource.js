/*global define,document,WinJS*/
define([
    'knockout',
    'scalejs!core'
], function (
    ko,
    core
) {
    'use strict';

    var toArray = core.array.toArray,
        has = core.object.has,
        templateEngine = new ko.nativeTemplateEngine(),
        templates = {
            data: { }
        };

    function registerTemplates ( templatesHtml ) {
        // iterate through all templates (e.g. children of root in templatesHtml)
        // for every child get its templateId and templateHtml
        // and add it to 'templates'
        var div = document.createElement('div');

        if (typeof WinJS !== 'undefined') {
            WinJS.Utilities.setInnerHTMLUnsafe(div, templatesHtml);
        } else {
            div.innerHTML = templatesHtml;
        }

        toArray(div.childNodes).forEach(function ( childNode ) {
            if (childNode.nodeType === 1 && has(childNode, 'id')) {
                templates[childNode.id] = childNode.innerHTML;
            }
        });
    }

    function makeTemplateSource ( template ) {

        if ( template instanceof Element ) {
            return {
                nodes: ko.templateSources.domElement.prototype
                    .nodes.bind({ domElement: template })
            };
        }

        return {
            data: function ( key, value ) {
                if (!has(templates.data, template)) {
                    templates.data[template] = { };
                }

                // if called with only key then return the associated value
                if (arguments.length === 1) {
                    return templates.data[template][key];
                }

                // if called with key and value then store the value
                templates.data[template][key] = value;
            },
            text: function ( value ) {
                // if no value return the template content
                // since that's what KO wants
                if (arguments.length === 0) {
                    return templates[template];
                }

                throw new Error('An attempt to override template "' +
                                template + '" with content "' + value + '" ' +
                                'Template overriding is not supported.');
            }
        };
    }

    templateEngine.makeTemplateSource = makeTemplateSource;

    ko.setTemplateEngine(templateEngine);

    return {
        registerTemplates: registerTemplates
    };
});
