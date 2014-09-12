module.exports = (grunt) ->
    path = require 'path'
    server:
        options:
            port: 8888
            keepalive: true
            debug: true
            base: [ 'test', '.']
