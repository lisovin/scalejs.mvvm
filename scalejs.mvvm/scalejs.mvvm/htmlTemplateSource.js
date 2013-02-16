/*global define,document*/
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
            data: {}
        };

	function registerTemplates(templatesHtml) {
		// iterate through all templates (e.g. children of root in templatesHtml)
		// for every child get its templateId and templateHtml 
		// and add it to 'templates'			
		var div = document.createElement('div');
		div.innerHTML = templatesHtml;
		toArray(div.childNodes).forEach(function (childNode) {
			if (childNode.nodeType === 1 && has(childNode, 'id')) {
				templates[childNode.id] = childNode.innerHTML;
			}
		});
	}

	function makeTemplateSource(templateId) {
		function data(key, value) {
            if (!has(templates.data, templateId)) {
                templates.data[templateId] = {};
            }

            // if called with only key then return the associated value
			if (arguments.length === 1) {
				return templates.data[templateId][key];
			}

			// if called with key and value then store the value
			templates.data[templateId][key] = value;
		}

		function text(value) {
			// if no value return the template content since that's what KO wants
			if (arguments.length === 0) {
				return templates[templateId];
			}

            throw new Error('An attempt to override template "' + templateId + '" with content "' + value + '" ' +
                            'Template overriding is not supported.');
		}

		return {
			data: data,
			text: text
		};
	}

    templateEngine.makeTemplateSource = makeTemplateSource;

    ko.setTemplateEngine(templateEngine);

    return {
		registerTemplates: registerTemplates
	};
});
