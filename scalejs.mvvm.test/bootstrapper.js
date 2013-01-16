/*global require*/
/// <reference path="Scripts/require.js"/>
/// <reference path="Scripts/jasmine.js"/>
require({
    "paths":  {
        "knockout":  "Scripts/knockout-2.2.1",
        "knockout-classBindingProvider":  "Scripts/knockout-classBindingProvider.min",
        "knockout.mapping":  "Scripts/knockout.mapping-latest",
        "scalejs":  "Scripts/scalejs-0.1.11",
        "scalejs.mvvm":  "Scripts/scalejs.mvvm-0.1.1",
        "text":  "Scripts/text"
    },
    "scalejs":  {
        "extensions":  [
            "scalejs.mvvm"
        ]
    }
}, [
    'scalejs!application',
    'tests/all.tests'
]);
