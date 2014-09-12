/*global define,describe,expect,it*/
/*jslint sloppy: true*/
/// <reference path="../Scripts/jasmine.js"/>
define([
    'scalejs!core',
    'scalejs!application'
], function (core) {
    var mvvm = core.mvvm;

    describe('mvvm extension', function () {
        it('is defined', function () {
            expect(mvvm).toBeDefined();
        });
    });
});