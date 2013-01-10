/*global define,describe,expect,it*/
/*jslint sloppy: true*/
/// <reference path="../Scripts/jasmine.js"/>
define(['../js/scalejs.mvvm'], function (extension) {
    describe('scalejs.mvvm extension', function () {
        it('is defined', function () {
            expect(extension).toBeDefined();
        });
    });
});