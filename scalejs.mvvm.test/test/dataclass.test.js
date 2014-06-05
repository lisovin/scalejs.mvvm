/*global define,describe,expect,it*/
/*jslint sloppy: true*/
/// <reference path="../Scripts/jasmine.js"/>
//Author: Jeremy Micah Bassi
define([
    'scalejs!core',
    'scalejs!application',
    './dataclasstestBindings',
    'knockout'
], function (
    core,
    app,
    testBindings,
    ko
) {
    function init() {
        var sandbox = core.buildSandbox('dataclass.test'),
            observable = sandbox.mvvm.observable,
            registerBindings = sandbox.mvvm.registerBindings,
            mvvm = core.mvvm;
            renderable = observable();

        //register the binding
        registerBindings(testBindings);

        //create the viewmodel
        var vm = {
            username: 'kilo',
            password: 'banana',
            height: '400px',
            width: '50px',
            col: 'blue'
        };

        //create the 'testbed' on the DOM
        var templateNode = document.createElement('div');
        templateNode.innerHTML = "<div id='test__div' data-bind='render: renderable'></div>";
        templateNode.style.visibility = 'hidden';
        templateNode.style.position = 'absolute';
        document.body.appendChild(templateNode);

        //assign the dataclass and viewmodel to the renderable using dataClass function
        renderable(sandbox.mvvm.dataClass('foo', vm));

        //apply bindings to the html elems
        ko.applyBindings({ renderable: renderable }, templateNode);
    }
    

    describe('When the render binding is called on an observable with the results of the dataclass function', function () {

        beforeEach(function () {
            init();
        });

        it('correctly applies all the bindings of the dataclass', function () {
            expect(document.getElementById('test__div').innerHTML).toBe('kilo banana');
            expect(document.getElementById('test__div').style.height).toBe('400px');
            expect(document.getElementById('test__div').style.width).toBe('50px');
            expect(document.getElementById('test__div').style.backgroundColor).toBe('blue');
        });
    });

});