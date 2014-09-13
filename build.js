var require = {
    paths: {
        scalejs: "../lib/scalejs/scalejs.min",
        boot: "../lib/jasmine/boot",
        "jasmine-html": "../lib/jasmine/jasmine-html",
        jasmine: "../lib/jasmine/jasmine",
        requirejs: "../lib/requirejs/require",
        knockout: "../lib/knockout/dist/knockout",
        "knockout.mapping": "../lib/knockout.mapping/knockout.mapping",
        "scalejs.functional": "empty:",
        'scalejs.mvvm': '../build/scalejs.mvvm'
    },
    shim: {
      'jasmine': {
        exports: 'window.jasmineRequire'
      },
      'jasmine-html': {
        deps: ['jasmine'],
        exports: 'window.jasmineRequire'
      },
      'boot': {
        deps: ['jasmine', 'jasmine-html'],
        exports: 'window.jasmineRequire'
      }
    },
    scalejs: {
        extensions: [
            'scalejs.mvvm'
        ]
    },
    packages: [

    ]
};
