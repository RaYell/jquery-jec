/*jslint indent: 4, maxlen: 120 */
/*global describe, it, window, $*/
describe('Disable', function () {
    'use strict';
    var assert = window.assert,
        init = window.init;

    describe('JEC', function () {
        it('should properly disable editable functionality', function () {
            init();
            var elem = $('#test').jec();
            elem.jecOff();
            assert.lengthOf(elem.children('option'), 3);
            assert.notEqual(elem.data('jecId'), undefined);
        });
    });

    describe('JEC (init with JS)', function () {
        it('should properly disable editable functionality', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']);
            elem.jecOff();
            assert.lengthOf(elem.children('option'), 3);
            assert.notEqual(elem.data('jecId'), undefined);
        });
    });
});

describe('Enable', function () {
    'use strict';
    var assert = window.assert,
        init = window.init;

    describe('JEC', function () {
        it('should properly enable editable functionality', function () {
            init();
            var elem = $('#test').jec();
            elem.jecOff();
            elem.jecOn();
            assert.lengthOf(elem.children('.jecEditableOption'), 1);
            assert.lengthOf(elem.children(':not(.jecEditableOption)'), 3);
            assert.notEqual(elem.data('jecId'), undefined);
        });
    });

    describe('JEC (init with JS)', function () {
        it('should properly enable editable functionality', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']);
            elem.jecOff();
            elem.jecOn();
            assert.lengthOf(elem.children('.jecEditableOption'), 1);
            assert.lengthOf(elem.children(':not(.jecEditableOption)'), 3);
            assert.notEqual(elem.data('jecId'), undefined);
        });
    });
});

describe('Kill', function () {
    'use strict';
    var assert = window.assert,
        init = window.init;

    describe('JEC', function () {
        it('should properly kill editable functionality', function () {
            init();
            var elem = $('#test').jec();
            elem.jecKill();
            assert.lengthOf(elem.children('option'), 3);
            assert.equal(elem.data('jecId'), undefined);
        });
    });

    describe('JEC (init with JS)', function () {
        it('should properly kill editable functionality', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']);
            elem.jecKill();
            assert.lengthOf(elem.children('option'), 3);
            assert.equal(elem.data('jecId'), undefined);
        });
    });
});

describe('Other', function () {
    'use strict';
    var assert = window.assert,
        init = window.init;

    it('should remove classes when destroyed', function () {
        init();
        var elem = $('#test').jec({
            classes: ['myClass1', 'myClass2']
        });
        elem.jecKill();
        assert.equal(elem.attr('class'), '');
    });

    it('should remove styles when destroyed', function () {
        init();
        var elem = $('#test').jec({
            styles: {
                opacity: 0.5
            }
        });
        elem.jecKill();
        assert.equal(elem.css('opacity'), 1);
    });

    it('should properly handle key codes', function () {
        init();
        var elem = $('#test').jec(),
            list = ['keydown', 'keypress', 'keyup'];

        $.each(list, function () {
            var e = $.Event(this, {
                charCode: 72
            });
            elem.trigger(e);
        });
        assert.equal(elem.children('.jecEditableOption').text(), 'H');
        assert.equal(elem.children('.jecEditableOption').val(), 'H');
    });
});