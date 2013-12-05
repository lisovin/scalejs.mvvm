/*global define*/
/*jslint unparam:true*/
define(function () {
    'use strict';

    return {
        load: function (name, req, onLoad, config) {
            if (name.indexOf('.html', name.length - 5) === -1) {
                name = name + '.html';
            }

            req(['text!' + name, 'scalejs!core', 'scalejs.mvvm'], function (view, core) {
                if (!config.isBuild) {
                    core.mvvm.registerTemplates(view);
                }
                onLoad(view);
            });
        }
    };
});