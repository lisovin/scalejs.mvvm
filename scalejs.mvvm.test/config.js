var require = {
    "baseUrl":  ".",
    "paths":  {
        "es5-shim":  "Scripts/es5-shim",
        "jasmine":  "Scripts/jasmine",
        "jasmine-html":  "Scripts/jasmine-html",
        "json2":  "Scripts/json2",
        "knockout":  "Scripts/knockout-2.2.1",
        "knockout.mapping":  "Scripts/knockout.mapping-latest",
        "scalejs":  "Scripts/scalejs-0.2.7.1",
        "scalejs.mvvm":  "Scripts/scalejs.mvvm-0.2.3.10",
        "text":  "Scripts/text"
    },
    "scalejs":  {
        "extensions":  [
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
