/*global define,describe,expect,it,jasmine,waits*/
/*jslint sloppy: true*/
/// <reference path="../Scripts/jasmine.js"/>
define([
    'scalejs!core',
    'knockout',
    'scalejs!application'
], function (core, ko) {
    var sandbox = core.buildSandbox('selectableArray.test'),
        is = core.type.is,
        has = core.object.has,
        observable = ko.observable,
        observableArray = ko.observableArray,
        isObservable = ko.isObservable;

    describe('`selectableArray`', function () {
        var selectableArray = sandbox.mvvm.selectableArray;

        it('is defined', function () {
            expect(selectableArray).toBeDefined();
        });

        it('when argument is array returns an array', function () {
            var s = selectableArray([{}, {}]);
            expect(is(s, 'array')).toBeTruthy();
            expect(s.length).toBe(2);
            expect(s.selectedItem).toBeDefined();
            expect(s.some(function (i) { return !has(i, 'isSelected'); })).toBeFalsy();
        });

        it('when argument is observable array returns an observable array', function () {
            var s = selectableArray(observableArray([{}, {}]));
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
                s = selectableArray(items, {
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
                s = selectableArray(items, {
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
                s = selectableArray(items, {
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

        it('when selectedItem is set to undefined all items isSelected is false', function () {
            var items = [{
                    isItemSelected: observable()
                }, {
                    isItemSelected: observable()
                }],
                s = selectableArray(items, {
                    isSelectedPath: 'isItemSelected'
                });

            items[0].isItemSelected(true);
            expect(s.selectedItem()).toEqual(items[0]);

            s.selectedItem(undefined);
            expect(items[0].isItemSelected()).toBeFalsy();
            expect(items[1].isItemSelected()).toBeFalsy();
        });

        it('when selectionPolicy is `deselect` selected item becomes deselected', function () {
            var items = [{
                    isItemSelected: observable()
                }, {
                    isItemSelected: observable()
                }],
                s = selectableArray(items, {
                    isSelectedPath: 'isItemSelected',
                    selectionPolicy: 'deselect'
                }),
                onSelectedItem = jasmine.createSpy('onSelectedItem'),
                onIsSelected = jasmine.createSpy('onIsSelected');

            items[0].isItemSelected.subscribe(onIsSelected);
            s.selectedItem.subscribe(onSelectedItem);

            items[0].isItemSelected(true);

            expect(onSelectedItem).toHaveBeenCalledWith(items[0]);
            expect(onIsSelected).toHaveBeenCalledWith(true);

            waits(50);

            runs(function () {
                expect(s.selectedItem()).not.toBeDefined();
                expect(items[0].isItemSelected()).toBeFalsy();
            });
        });

        it('when isSelected is not observable throws an exception', function () {
            var items = [{
                    isSelected: false
                }, {
                    isSelected: true
                }];
            expect(function () { selectableArray(items); }).toThrow();
        });

        it('when isSelectedPath specifies non-existant property throws an exception', function () {
            var items = [{
                    isItemSelected: false
                }, {
                    isItemSelected: true
                }];
            expect(function () { selectableArray(items, { isSelectedPath: 'foobar' }); }).toThrow();
        });
    });
});