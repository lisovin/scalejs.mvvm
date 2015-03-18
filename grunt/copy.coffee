module.exports =
    release:
        expand: true
        flatten: true
        src: ['build/scalejs.mvvm.js', 'build/scalejs.mvvm.min.js']
        dest: 'dist'
        filter: 'isFile'
