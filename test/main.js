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
        ]
    }
});

require(['chai'], function (chai) {
    'use strict';
    window.assert = chai.assert;
    mocha.setup('bdd');

    require(['init', 'jec'], function (init) {
        window.init = init.reset;
        require(['core.js', 'init-js.js', 'value.js', 'pref.js', 'other.js'], function () {
            mocha.run();
        });
    });
});