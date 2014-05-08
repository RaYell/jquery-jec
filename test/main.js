/*jslint indent: 4, maxlen: 120 */
/*global mocha, require, window*/
require.config({
    paths: {
        chai: '../node_modules/chai/chai',
        jquery: '../node_modules/jquery/dist/jquery.min',
        jec: '../src/jquery-jec'
    },
    shim: {
        'mocha-init': [
            'jquery'
        ],
        jec: [
            'jquery'
        ],
        'tests-core': [
            'mocha-init',
            'jec'
        ],
        'tests-init-js': [
            'mocha-init',
            'jec'
        ],
        'tests-value': [
            'mocha-init',
            'jec'
        ],
        'tests-pref': [
            'mocha-init',
            'jec'
        ],
        'tests-other': [
            'mocha-init',
            'jec'
        ]
    }
});

require(['chai'], function (chai) {
    'use strict';
    window.assert = chai.assert;
    mocha.setup('bdd');

    require(['tests-core', 'tests-init-js', 'tests-value', 'tests-pref', 'tests-other'], function () {
        mocha.run();
    });
});