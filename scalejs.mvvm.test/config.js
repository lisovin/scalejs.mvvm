var require = {
    "baseUrl":  ".",
    "paths":  {
        "bindings":  "Scripts/scalejs.mvvm.bindings",
        "es5-shim":  "Scripts/es5-shim",
        "jasmine":  "Scripts/jasmine",
        "jasmine-html":  "Scripts/jasmine-html",
        "json2":  "Scripts/json2",
        "knockout":  "Scripts/knockout-3.0.0.debug",
        "knockout.mapping":  "Scripts/knockout.mapping-latest",
        "scalejs":  "Scripts/scalejs-0.2.7.1",
        "scalejs.functional":  "Scripts/scalejs.functional-0.2.10",
        "scalejs.mvvm":  "Scripts/scalejs.mvvm",
        "text":  "Scripts/text",
        "views":  "Scripts/scalejs.mvvm.views"
    },
    "scalejs":  {
        "extensions":  [
            "scalejs.functional",
            "scalejs.mvvm"
        ]
    },
    "shim":  {
        "jasmine":  {
            "exports":  "jasmine"
        },
        "jasmine-html":  {
            "deps":  [
                "jasmine"
            ]
        }
    }
};
