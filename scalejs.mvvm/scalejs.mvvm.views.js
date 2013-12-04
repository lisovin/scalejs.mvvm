/*global define*/
/*jslint unparam:true*/
define(function () {
    'use strict';

    return {
        load: function (name, req, onLoad, config) {
            req(['text!' + name + '.html', 'scalejs!core', 'scalejs.mvvm'], function (view, core) {
                if (!config.isBuild) {
                    core.mvvm.registerTemplates(view);
                }
                onLoad();
            });
        },
        write: function (pluginName, moduleName, write, config) {
            write.asModule(pluginName + "!" + moduleName,
                            "define(['text!" + moduleName + ".html', 'scalejs!core', 'scalejs.mvvm'], function (view, core) { " +
                                " core.mvvm.registerTemplates(view); " +
                            "});\n");
        }
    };
});