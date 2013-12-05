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
                onLoad(bindings);
            });
        }
    };
});