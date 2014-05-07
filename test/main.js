/*global mocha, require, window*/
require.config({
    paths: {
        chai: '../node_modules/chai/chai',
        jquery: '../node_modules/jquery/dist/jquery.min',
        jec: '../src/jquery-jec'
    }
});

require(['chai'], function (chai) {
    window.assert = chai.assert;
    mocha.setup('bdd');

    require(['jquery'], function () {
        require(['jec'], function () {
            require(['tests.js'], function () {
                mocha.run();
            });
        });
    });
});