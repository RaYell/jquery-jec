/*jslint indent: 4, maxlen: 120 */
/*global mocha, require, window*/
require.config({
    paths: {
        chai: '../node_modules/chai/chai',
        jquery: '../node_modules/jquery/dist/jquery.min',
        jec: '../src/jquery-jec'
    },
    shim: {
        init: [
            'jquery'
        ],
        jec: [
            'jquery'
        ],
        core: [
            'init',
            'jec'
        ],
        'init-js': [
            'init',
            'jec'
        ],
        value: [
            'init',
            'jec'
        ],
        pref: [
            'init',
            'jec'
        ],
        other: [
            'init',
            'jec'
        ]
    }
});

require(['chai'], function (chai) {
    'use strict';
    window.assert = chai.assert;
    mocha.setup('bdd');

    require(['core', 'init-js', 'value', 'pref', 'other'], function () {
        mocha.run();
    });
});