/*global define*/
/*jslint unparam:true*/
define(function () {
    'use strict';

    return {
        load: function (name, req, onLoad, config) {
            req([name, 'scalejs!core', 'scalejs.mvvm'], function (bindings, core) {
                if (!config.isBuild) {
                    core.mvvm.registerBindings(bindings);
                }
                onLoad();
            });
        },
        write: function (pluginName, moduleName, write, config) {
            write.asModule(pluginName + "!" + moduleName,
                            "define(['" + moduleName + "', 'scalejs!core', 'scalejs.mvvm'], function (bindings, core) { " +
                                " core.mvvm.registerBindings(bindings); " +
                            "});\n");
        }
    };
});