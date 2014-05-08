/*jslint indent: 4, maxlen: 120 */
/*global describe, it, window, $*/
describe('Retrieving value', function () {
    'use strict';
    var assert = window.assert;

    describe('JEC', function () {
        it('should retrieve the editable value', function () {
            var elem = $('#test').jec(),
                val = 'v1';
            elem.children('.jecEditableOption').text(val).val(val);
            assert.equal(elem.jecValue(), val);
        });
    });

    describe('JEC (init with JS)', function () {
        it('should retrieve the editable value', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']),
                val = 'v1';
            elem.children('.jecEditableOption').text(val).val(val);
            assert.equal(elem.jecValue(), val);
        });
    });
});

describe('Setting value', function () {
    'use strict';
    var assert = window.assert;

    describe('JEC', function () {
        it('should set the editable value', function () {
            var elem = $('#test').jec(),
                val = 'v1';
            elem.jecValue(val);
            assert.equal(elem.children('.jecEditableOption').text(), val);
            assert.equal(elem.children('.jecEditableOption').val(), val);
        });
    });

    describe('JEC (init with JS)', function () {
        it('should set the editable value given as string', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']),
                val = 'v1';
            elem.jecValue(val);
            assert.equal(elem.children('.jecEditableOption').text(), val);
            assert.equal(elem.children('.jecEditableOption').val(), val);
        });
        it('should set the editable value given as int', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']),
                val = 1;
            elem.jecValue(val);
            assert.equal(elem.children('.jecEditableOption').text(), val);
            assert.equal(elem.children('.jecEditableOption').val(), val);
        });
        it('should set the editable value given as float', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']),
                val = 1.2;
            elem.jecValue(val);
            assert.equal(elem.children('.jecEditableOption').text(), val);
            assert.equal(elem.children('.jecEditableOption').val(), val);
        });
        it('should fail to set the editable value given as undefined', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']);
            elem.jecValue(undefined);
            assert.equal(elem.children('.jecEditableOption').text(), '');
            assert.equal(elem.children('.jecEditableOption').val(), '');
        });
        it('should fail to set the editable value given as null', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']);
            elem.jecValue(null);
            assert.equal(elem.children('.jecEditableOption').text(), '');
            assert.equal(elem.children('.jecEditableOption').val(), '');
        });
        it('should fail to set the editable value given as boolean', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']);
            elem.jecValue(true);
            assert.equal(elem.children('.jecEditableOption').text(), '');
            assert.equal(elem.children('.jecEditableOption').val(), '');
        });
        it('should fail to set the editable value given as object', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']);
            elem.jecValue({});
            assert.equal(elem.children('.jecEditableOption').text(), '');
            assert.equal(elem.children('.jecEditableOption').val(), '');
        });
        it('should fail to set the editable value given as array', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']);
            elem.jecValue([]);
            assert.equal(elem.children('.jecEditableOption').text(), '');
            assert.equal(elem.children('.jecEditableOption').val(), '');
        });
        it('should fail to set the editable value given as function', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']);
            elem.jecValue(function () {
                return 'v1';
            });
            assert.equal(elem.children('.jecEditableOption').text(), '');
            assert.equal(elem.children('.jecEditableOption').val(), '');
        });
    });
});