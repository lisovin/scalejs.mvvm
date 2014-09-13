require.config({
    paths: {
        boot: "../lib/jasmine/boot",
        "jasmine-html": "../lib/jasmine/jasmine-html",
        jasmine: "../lib/jasmine/jasmine",
        'scalejs.mvvm': '../build/scalejs.mvvm'
    },
    shim: {
        jasmine: {
            exports: "window.jasmineRequire"
        },
        "jasmine-html": {
            deps: [
                "jasmine"
            ],
            exports: "window.jasmineRequire"
        },
        boot: {
            deps: [
                "jasmine",
                "jasmine-html"
            ],
            exports: "window.jasmineRequire"
        }
    },
    scalejs: {
        extensions: [
            "scalejs.mvvm"
        ]
    }
});

require(['boot'], function () {
    require (['./scalejs.mvvm.test'], function () {
        window.onload();
    });
});
