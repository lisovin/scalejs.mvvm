/*global define,describe,expect,it*/
/*jslint sloppy: true*/
/// <reference path="../Scripts/jasmine.js"/>
define([
    'scalejs!core',
    'knockout',
    'scalejs!application'
], function (core, ko) {
    var sandbox = core.buildSandbox('selectable.test'),
        is = core.type.is,
        has = core.object.has,
        observable = ko.observable,
        observableArray = ko.observableArray,
        isObservable = ko.isObservable;

    describe('`selectable`', function () {
        var selectable = sandbox.mvvm.selectable;

        it('is defined', function () {
            expect(selectable).toBeDefined();
        });

        it('when argument is array returns an array', function () {
            var s = selectable([{}, {}]);
            expect(is(s, 'array')).toBeTruthy();
            expect(s.length).toBe(2);
            expect(s.selectedItem).toBeDefined();
            expect(s.some(function (i) { return !has(i, 'isSelected'); })).toBeFalsy();
        });

        it('when argument is observable array returns an observable array', function () {
            var s = selectable(observableArray([{}, {}]));
            expect(isObservable(s)).toBeTruthy();
            expect(s().length).toBe(2);
            expect(s.selectedItem).toBeDefined();
            expect(s().some(function (i) { return !has(i, 'isSelected'); })).toBeFalsy();
        });

        it('when an item\'s isSelected is set to true selectedItem becomes the item', function () {
            var items = [{
                    isItemSelected: observable()            
                }, {
                    isItemSelected: observable()
                }],
                s = selectable(items, {
                    isSelectedPath: 'isItemSelected'
                }),
                onSelectedItem = jasmine.createSpy();

            s.selectedItem.subscribe(onSelectedItem);

            items[0].isItemSelected(true);
            expect(onSelectedItem).toHaveBeenCalledWith(items[0]);

            items[1].isItemSelected(true);
            expect(onSelectedItem).toHaveBeenCalledWith(items[1]);
        });

        it('when selected item\'s isSelected is set to false selectedItem becomes `undefined`', function () {
            var items = [{
                    isItemSelected: observable()            
                }, {
                    isItemSelected: observable()
                }],
                s = selectable(items, {
                    isSelectedPath: 'isItemSelected'
                }),
                onSelectedItem = jasmine.createSpy();

            s.selectedItem.subscribe(onSelectedItem);

            items[0].isItemSelected(true);
            expect(onSelectedItem).toHaveBeenCalledWith(items[0]);

            items[0].isItemSelected(false);
            expect(onSelectedItem).toHaveBeenCalledWith(undefined);
            expect(items[0].isSelected()).toBeFalsy();
        });

        it('when another item\'s isSelected is set to true selectedItem\'s isSelected becomes false', function () {
            var items = [{
                    isItemSelected: observable()            
                }, {
                    isItemSelected: observable()
                }],
                s = selectable(items, {
                    isSelectedPath: 'isItemSelected'
                }),
                onSelectedItem = jasmine.createSpy();

            s.selectedItem.subscribe(onSelectedItem);

            items[0].isItemSelected(true);
            expect(onSelectedItem).toHaveBeenCalledWith(items[0]);

            items[1].isItemSelected(true);
            expect(onSelectedItem).toHaveBeenCalledWith(items[1]);
            expect(items[0].isSelected()).toBeFalsy();
            expect(items[0].isItemSelected()).toBeFalsy();
        });

        it('when isSelected is not observable throws an exception', function () {
            var items = [{
                    isSelected: false            
                }, {
                    isSelected: true
                }];
            expect(function () { selectable(items); }).toThrow();
        });

        it('when isSelectedPath specifies non-existant property throws an exception', function () {
            var items = [{
                    isItemSelected: false            
                }, {
                    isItemSelected: true
                }];
            expect(function () { selectable(items, { isSelectedPath: 'foobar' }); }).toThrow();
        });
    });
});