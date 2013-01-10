/// <reference path="../Scripts/require.js"/>
/// <reference path="../Scripts/jasmine.js"/>

/*global requirejs*/
requirejs({
    paths: {
        'scalejs' : '../Scripts/scalejs-0.1.1',
		'knockout' : '../Scripts/knockout-2.2.0.debug',
		'knockout.mapping' : '../Scripts/knockout.mapping-latest.debug',
		'knockout-classBindingProvider' : '../Scripts/knockout-classBindingProvider'
    }
}, ['../test/all.tests']);
