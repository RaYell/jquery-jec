/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true,
bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 50, indent: 4, 
maxlen: 100*/
/*global $, QUnit, String, expect, fireunit, module, ok, same, test*/
/*members Event, acceptedKeys, attr, bind, blinkingCursor, blinkingCursorInterval, children, 
classes, css, data, display, done, each, eq, filter, focus, focusOnNewOption, hasClass, hide, 
ignoredKeys, jECTimer, jec, jecKill, jecOff, jecOn, jecPref, jecValue, k1, k2, k3, k4, keyCode, 
length, log, max, maxLength, min, ok, opacity, opt1, opt2, opt3, optionClasses, optionStyles, 
position, remove, replace, styles, test, testDone, text, trigger, triggerChangeEvent, unbind, 
useExistingOptions, val*/
'use strict';
$(function () {

    if (typeof fireunit === 'object') {
        QUnit.log = fireunit.ok;
        QUnit.done = fireunit.testDone;
    }

    // hack for html validator (ol cannot be empty)
    $('li').remove();

    // disable timers in order not to hang up the browser
    $.jECTimer = null;

    var trim, key, reset;

    trim = function (str) {
        return str.replace(/(^\s+)|(\s+$)/, '');
    };

    key = function (elem, code) {
        var list = ['keydown', 'keypress', 'keyup'];
        $.each(list, function () {
            var event = $.Event(this);
            event.keyCode = code;
            elem.trigger(event);
        });
    };

    reset = function (elem) {
        elem.jecKill();
		elem.val('opt2');
        elem.children().andSelf().attr('class', '');
        elem.children().andSelf().attr('style', '');
    };

    module('init');
    test('Editable combobox initialization', function () {
        expect(1);

        $('#test').jec();
        ok($('#test:editable').length === 1, 'Create combobox without any preferences');
        reset($('#test'));
    });

    test('Keyboard', function () {
        expect(6);

        $('#test').jec();
        key($('#test'), 72);
        same($('#test').jecValue(), 'H', 'Type letter H');
        key($('#test'), 105);
        same($('#test').jecValue(), 'Hi', 'Type letter i');
        key($('#test'), 32);
        same($('#test').jecValue(), 'Hi ', 'Type space');
        key($('#test'), 33);
        same($('#test').jecValue(), 'Hi !', 'Type !');
        key($('#test'), 8);
        same($('#test').jecValue(), 'Hi ', 'Backspace');
        key($('#test'), 46);
        same($('#test').jecValue(), 'Hi', 'Delete');
        reset($('#test'));
    });

    test('Setting: position', function () {
        expect(13);

        $('#test').jec({ position: 0 });
        ok($('#test').children('option:first.jecEditableOption').length === 1,
            'Editable option on first position');
        reset($('#test'));

        $('#test').jec({ position: 1 });
        ok($('#test').children('option').eq(1).filter('.jecEditableOption').length === 1,
            'Editable option on second position');
        reset($('#test'));

        $('#test').jec({ position: 3 });
        ok($('#test').children('option:last').filter('.jecEditableOption').length === 1,
            'Editable option on last position');
        reset($('#test'));

        $('#test').jec({ position: 100 });
        ok($('#test').children('option:last').filter('.jecEditableOption').length === 1,
            'Editable option on last position (value greater then number of options)');
        reset($('#test'));

        $('#test').jec({ position: -1 });
        ok($('#test').children('option:first.jecEditableOption').length === 1,
            'Editable option on first position (negative int)');
        reset($('#test'));

        $('#test').jec({ position: 1.2 });
        ok($('#test').children('option:first.jecEditableOption').length === 1,
            'Editable option on first position (float)');
        reset($('#test'));

        $('#test').jec({ position: '1' });
        ok($('#test').children('option:first.jecEditableOption').length === 1,
            'Editable option on first position (string)');
        reset($('#test'));

        $('#test').jec({ position: true });
        ok($('#test').children('option:first.jecEditableOption').length === 1,
            'Editable option on first position (boolean)');
        reset($('#test'));

        $('#test').jec({ position: null });
        ok($('#test').children('option:first.jecEditableOption').length === 1,
            'Editable option on first position (null)');
        reset($('#test'));

        $('#test').jec({ position: undefined });
        ok($('#test').children('option:first.jecEditableOption').length === 1,
            'Editable option on first position (undefined)');
        reset($('#test'));

        $('#test').jec({ position: {} });
        ok($('#test').children('option:first.jecEditableOption').length === 1,
            'Editable option on first position (object)');
        reset($('#test'));

        $('#test').jec({ position: [] });
        ok($('#test').children('option:first.jecEditableOption').length === 1,
            'Editable option on first position (array)');
        reset($('#test'));

        $('#test').jec({ position: $ });
        ok($('#test').children('option:first.jecEditableOption').length === 1,
            'Editable option on first position (function)');
        reset($('#test'));
    });
    
    test('Setting: maxLength', function () {
        expect(10);

        $('#test').jec({ maxLength: 2 });
        key($('#test'), 72);
        key($('#test'), 72);
        key($('#test'), 72);
        same($('#test').jecValue().length, 2, 'Limiting max length');
        reset($('#test'));

        $('#test').jec({ maxLength: -1 });
        key($('#test'), 72);
        same($('#test').jecValue().length, 1, 'Negative max length');
        reset($('#test'));

        $('#test').jec({ maxLength: 0.1 });
        key($('#test'), 72);
        same($('#test').jecValue().length, 1, 'Malformed max length (float)');
        reset($('#test'));

        $('#test').jec({ maxLength: '0' });
        key($('#test'), 72);
        same($('#test').jecValue().length, 1, 'Malformed max length (string)');
        reset($('#test'));

        $('#test').jec({ maxLength: true });
        key($('#test'), 72);
        same($('#test').jecValue().length, 1, 'Malformed max length (bool)');
        reset($('#test'));

        $('#test').jec({ maxLength: null });
        key($('#test'), 72);
        same($('#test').jecValue().length, 1, 'Malformed max length (null)');
        reset($('#test'));

        $('#test').jec({ maxLength: undefined });
        key($('#test'), 72);
        same($('#test').jecValue().length, 1, 'Malformed max length (undefined)');
        reset($('#test'));

        $('#test').jec({ maxLength: {} });
        key($('#test'), 72);
        same($('#test').jecValue().length, 1, 'Malformed max length (object)');
        reset($('#test'));

        $('#test').jec({ maxLength: [] });
        key($('#test'), 72);
        same($('#test').jecValue().length, 1, 'Malformed max length (array)');
        reset($('#test'));

        $('#test').jec({ maxLength: $ });
        key($('#test'), 72);
        same($('#test').jecValue().length, 1, 'Malformed max length (function)');
        reset($('#test'));
    });

    test('Setting: classes', function () {
        expect(15);

        var c1 = 'class1', c2 = 'class2';

        $('#test').jec({ classes: '' });
        ok($('#test').attr('class') === '', 'No extra classes (string)');
        reset($('#test'));

        $('#test').jec({ classes: c1 });
        ok($('#test').hasClass(c1), 'One extra class (string)');
        reset($('#test'));

        $('#test').jec({ classes: c1 + ' ' + c2 });
        ok($('#test').hasClass(c1), 'Several extra classes  - checking c1 class (string)');
		ok($('#test').hasClass(c2), 'Several extra classes  - checking c2 class (string)');
        reset($('#test'));

        $('#test').jec({ classes: [] });
        ok($('#test').attr('class') === '', 'No extra classes (array)');
        reset($('#test'));

        $('#test').jec({ classes: [c1] });
        ok($('#test').hasClass(c1), 'One extra class (array)');
        reset($('#test'));

        $('#test').jec({ classes: [c1, c2] });
        ok($('#test').hasClass(c1), 'Several extra classes - checking c1 class (array)');
		ok($('#test').hasClass(c2), 'Several extra classes - checking c1 class (array)');
        reset($('#test'));

        $('#test').jec({ classes: 1 });
        ok($('#test').attr('class') === '', 'No extra classes (int)');
        reset($('#test'));

        $('#test').jec({ classes: 1.2 });
        ok($('#test').attr('class') === '', 'No extra classes (float)');
        reset($('#test'));

        $('#test').jec({ classes: true });
        ok($('#test').attr('class') === '', 'No extra classes (boolean)');
        reset($('#test'));

        $('#test').jec({ classes: null });
        ok($('#test').attr('class') === '', 'No extra classes (null)');
        reset($('#test'));

        $('#test').jec({ classes: undefined });
        ok($('#test').attr('class') === '', 'No extra classes (undefined)');
        reset($('#test'));

        $('#test').jec({ classes: {} });
        ok($('#test').attr('class') === '', 'No extra classes (object)');
        reset($('#test'));

        $('#test').jec({ classes: $ });
        ok($('#test').attr('class') === '', 'No extra classes (function)');
        reset($('#test'));
    });

    test('Setting: optionClasses', function () {
        expect(15);

        var c1 = 'c1', c2 = 'c2';

        $('#test').jec({ optionClasses: '' });
        ok(trim($('#test').children('option.jecEditableOption').attr('class')) ===
            'jecEditableOption', 'No extra classes (string)');
        reset($('#test'));

        $('#test').jec({ optionClasses: c1 });
        ok($('#test').children('option.jecEditableOption').hasClass(c1),
            'One extra class (string)');
        reset($('#test'));

        $('#test').jec({ optionClasses: c1 + ' ' + c2 });
        ok($('#test').children('option.jecEditableOption').hasClass(c1),
            'Several extra classes - checking c1 class(string)');
		ok($('#test').children('option.jecEditableOption').hasClass(c2),
            'Several extra classes - checking c2 class(string)');
        reset($('#test'));

        $('#test').jec({ optionClasses: [] });
        ok(trim($('#test').children('option.jecEditableOption').attr('class')) ===
            'jecEditableOption', 'No extra classes (array)');
        reset($('#test'));

        $('#test').jec({ optionClasses: [c1] });
        ok($('#test').children('option.jecEditableOption').hasClass(c1),
            'One extra class (array)');
        reset($('#test'));

        $('#test').jec({ optionClasses: [c1, c2] });
        ok($('#test').children('option.jecEditableOption').hasClass(c1),
             'Several extra classes - checking c1 class (array)');
		ok($('#test').children('option.jecEditableOption').hasClass(c2),
             'Several extra classes - checking c1 class (array)');
        reset($('#test'));

        $('#test').jec({ optionClasses: 1 });
        ok(trim($('#test').children('option.jecEditableOption').attr('class')) ===
            'jecEditableOption', 'No extra classes (int)');
        reset($('#test'));

        $('#test').jec({ optionClasses: 1.2 });
        ok(trim($('#test').children('option.jecEditableOption').attr('class')) ===
            'jecEditableOption', 'No extra classes (float)');
        reset($('#test'));

        $('#test').jec({ optionClasses: true });
        ok(trim($('#test').children('option.jecEditableOption').attr('class')) ===
            'jecEditableOption', 'No extra classes (boolean)');
        reset($('#test'));

        $('#test').jec({ optionClasses: null });
        ok(trim($('#test').children('option.jecEditableOption').attr('class')) ===
            'jecEditableOption', 'No extra classes (null)');
        reset($('#test'));

        $('#test').jec({ optionClasses: undefined });
        ok(trim($('#test').children('option.jecEditableOption').attr('class')) ===
            'jecEditableOption', 'No extra classes (undefined)');
        reset($('#test'));

        $('#test').jec({ optionClasses: {} });
        ok(trim($('#test').children('option.jecEditableOption').attr('class')) ===
            'jecEditableOption', 'No extra classes (object)');
        reset($('#test'));

        $('#test').jec({ optionClasses: $ });
        ok(trim($('#test').children('option.jecEditableOption').attr('class')) ===
            'jecEditableOption', 'No extra classes (function)');
        reset($('#test'));
    });

    test('Setting: styles', function () {
        expect(12);

        var s1 = 'opacity', v1 = '0.5', s2 = 'display', v2 = 'none', obj = {};

        $('#test').jec({ styles: obj });
        same($('#test').css(s1), '1', 'No extra styles');
        reset($('#test'));

        obj[s1] = v1;
        $('#test').jec({ styles: obj });
        same($('#test').css(s1), v1, 'Opacity changed');
        reset($('#test'));

        obj[s2] = v2;
        $('#test').jec({ styles: obj });
        same($('#test').css(s1), v1, 'Opacity and display changed, checking opacity');
        same($('#test').css(s2), v2, 'Opacity and display changed, checking display');
        reset($('#test'));

        $('#test').jec({ styles: 'width: 100px' });
        same($('#test').css(s1), '1', 'No extra styles (string)');
        reset($('#test'));

        $('#test').jec({ styles: 0 });
        same($('#test').css(s1), '1', 'No extra styles (int)');
        reset($('#test'));

        $('#test').jec({ styles: 0.5 });
        same($('#test').css(s1), '1', 'No extra styles (float)');
        reset($('#test'));

        $('#test').jec({ styles: true });
        same($('#test').css(s1), '1', 'No extra styles (boolean)');
        reset($('#test'));

        $('#test').jec({ styles: null });
        same($('#test').css(s1), '1', 'No extra styles (null)');
        reset($('#test'));

        $('#test').jec({ styles: undefined });
        same($('#test').css(s1), '1', 'No extra styles (undefined)');
        reset($('#test'));

        $('#test').jec({ styles: [] });
        same($('#test').css(s1), '1', 'No extra styles (array)');
        reset($('#test'));

        $('#test').jec({ styles: $ });
        same($('#test').css(s1), '1', 'No extra styles (function)');
        reset($('#test'));
    });

    test('Setting: optionStyles', function () {
        expect(12);

        var s1 = 'opacity', v1 = '0.5', s2 = 'display', v2 = 'none', obj = {};

        $('#test').jec({ optionStyles: obj });
        same($('#test option.jecEditableOption').css(s1), '1', 'No extra styles');
        reset($('#test'));

        obj[s1] = v1;
        $('#test').jec({ optionStyles: obj });
        same($('#test option.jecEditableOption').css(s1), v1, 'Opacity changed');
        reset($('#test'));

        obj[s2] = v2;
        $('#test').jec({ optionStyles: obj });
        same($('#test option.jecEditableOption').css(s1), v1,
            'Opacity and display changed, checking opacity');
        same($('#test option.jecEditableOption').css(s2), v2,
            'Opacity and display changed, checking display');
        reset($('#test'));

        $('#test').jec({ styles: 'width: 100px' });
        same($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (string)');
        reset($('#test'));

        $('#test').jec({ optionStyles: 0 });
        same($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (int)');
        reset($('#test'));

        $('#test').jec({ optionStyles: 0.5 });
        same($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (float)');
        reset($('#test'));

        $('#test').jec({ optionStyles: true });
        same($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (boolean)');
        reset($('#test'));

        $('#test').jec({ optionStyles: null });
        same($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (null)');
        reset($('#test'));

        $('#test').jec({ optionStyles: undefined });
        same($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (undefined)');
        reset($('#test'));

        $('#test').jec({ optionStyles: [] });
        same($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (array)');
        reset($('#test'));

        $('#test').jec({ optionStyles: $ });
        same($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (function)');
        reset($('#test'));
    });
   
    test('Setting: triggerChangeEvent', function () {
        expect(10);
        
        var val = null;
        
        function testHandler() {
            val = 1;
        }
        
        $('#test').bind('change', testHandler);
        
        $('#test').jec({ triggerChangeEvent: true });
        key($('#test'), 72);
        same(val, 1, 'Run change event handler');
        reset($('#test'));
        val = null;

        $('#test').jec({ triggerChangeEvent: false });
        key($('#test'), 72);
        same(val, null, 'Ignore change event handler');
        reset($('#test'));
        val = null;
        
        $('#test').jec({ triggerChangeEvent: '' });
        key($('#test'), 72);
        same(val, null, 'Ignore malformed parameter (string)');
        reset($('#test'));
        val = null;
        
        $('#test').jec({ triggerChangeEvent: 1 });
        key($('#test'), 72);
        same(val, null, 'Ignore malformed parameter (int)');
        reset($('#test'));
        val = null;
        
        $('#test').jec({ triggerChangeEvent: 1.2 });
        key($('#test'), 72);
        same(val, null, 'Ignore malformed parameter (float)');
        reset($('#test'));
        val = null;
        
        $('#test').jec({ triggerChangeEvent: undefined });
        key($('#test'), 72);
        same(val, null, 'Ignore malformed parameter (undefined)');
        reset($('#test'));
        val = null;
        
        $('#test').jec({ triggerChangeEvent: null });
        key($('#test'), 72);
        same(val, null, 'Ignore malformed parameter (null)');
        reset($('#test'));
        val = null;
        
        $('#test').jec({ triggerChangeEvent: {} });
        key($('#test'), 72);
        same(val, null, 'Ignore malformed parameter (object)');
        reset($('#test'));
        val = null;
        
        $('#test').jec({ triggerChangeEvent: [] });
        key($('#test'), 72);
        same(val, null, 'Ignore malformed parameter (array)');
        reset($('#test'));
        val = null;
        
        $('#test').jec({ triggerChangeEvent: $ });
        key($('#test'), 72);
        same(val, null, 'Ignore malformed parameter (function)');
        reset($('#test'));
        val = null;
        
        $('#test').unbind('change', testHandler);
    });

	test('Setting: focusOnNewOption', function () {
        expect(10);

		$('#test').jec({ focusOnNewOption: false });
        same($('#test').val(), 'opt2', 'Focus on second option (bool false)');
        reset($('#test'));

        $('#test').jec({ focusOnNewOption: true });
		same($('#test').val(), '', 'Focus on editable option (bool true)');
        reset($('#test'));

        $('#test').jec({ focusOnNewOption: '1' });
        same($('#test').val(), 'opt2', 'Focus on second option (string)');
        reset($('#test'));

        $('#test').jec({ focusOnNewOption: 1 });
        same($('#test').val(), 'opt2', 'Focus on second option (int)');
        reset($('#test'));

        $('#test').jec({ focusOnNewOption: 1.2 });
        same($('#test').val(), 'opt2', 'Focus on second option (float)');
        reset($('#test'));

        $('#test').jec({ focusOnNewOption: null });
        same($('#test').val(), 'opt2', 'Focus on second option (null)');
        reset($('#test'));

        $('#test').jec({ focusOnNewOption: undefined });
        same($('#test').val(), 'opt2', 'Focus on second option (undefined)');
        reset($('#test'));

        $('#test').jec({ focusOnNewOption: { focus: true} });
        same($('#test').val(), 'opt2', 'Focus on second option (object)');
        reset($('#test'));

        $('#test').jec({ focusOnNewOption: [true] });
        same($('#test').val(), 'opt2', 'Focus on second option (array)');
        reset($('#test'));
		
		$('#test').jec({ focusOnNewOption: $ });
        same($('#test').val(), 'opt2', 'Focus on second option (function)');
        reset($('#test'));
    });

    test('Setting: blinkingCursor', function () {
        // nothing to test here at the moment
        expect(0);
    });

    test('Setting: blinkingCursorInterval', function () {
        // nothing to test here at the moment
        expect(0);
    });

    test('Setting: useExistingOptions', function () {
        expect(3);

        $('#test').jec({ useExistingOptions: true });
        $('#test option:eq(1)').attr('selected', 'selected');
        $('#test').trigger('change');
        same($('#test').jecValue(), 'opt1', 'Select first option');
        $('#test option:eq(2)').attr('selected', 'selected');
        $('#test').trigger('change');
        same($('#test').jecValue(), 'opt2', 'Select second option');
        $('#test option:last').attr('selected', 'selected');
        $('#test').trigger('change');
        same($('#test').jecValue(), 'opt3', 'Select last option');
        reset($('#test'));
    });

    test('Setting: ignoredKeys', function () {
        expect(3);

        $('#test').jec({ ignoredKeys: [72, { min: 73, max: 75}] });
        key($('#test'), 72);
        same($('#test').jecValue(), '', 'Ignored key pressed (number)');
        key($('#test'), 74);
        same($('#test').jecValue(), '', 'Ignored key pressed (range)');
        key($('#test'), 76);
        same($('#test').jecValue(), 'L', 'Key outside of ignores pressed');
        reset($('#test'));
    });

    test('Setting: acceptedKeys', function () {
        expect(3);

        $('#test').jec({ acceptedKeys: [72, { min: 73, max: 75}] });
        key($('#test'), 72);
        same($('#test').jecValue(), 'H', 'Accepted key pressed (number)');
        key($('#test'), 74);
        same($('#test').jecValue(), 'HJ', 'Accepted key pressed (range)');
        key($('#test'), 76);
        same($('#test').jecValue(), 'HJ', 'Key outside of accepted pressed');
        reset($('#test'));
    });
    
    test('Setting: ignoreOptGroups', function () {
    	expect(10);

		$('#gtest').jec({ ignoreOptGroups: false, position: 1 });
        same($('#gtest > option:eq(1)').val(), '', 'Correct editable option placement');
        reset($('#gtest'));
        
        $('#gtest').jec({ ignoreOptGroups: true, position: 1 });
        same($('#gtest optgroup:first option:first').val(), '', 
        	'Correct editable option placement inside optgroup');
        reset($('#gtest'));

        $('#gtest').jec({ ignoreOptGroups: '1', position: 1 });
        same($('#gtest > option:eq(1)').val(), '', 'Ignoring invalid parameter (string)');
        reset($('#gtest'));

        $('#gtest').jec({ ignoreOptGroups: 1, position: 1 });
        same($('#gtest > option:eq(1)').val(), '', 'Ignoring invalid parameter (int)');
        reset($('#gtest'));

        $('#gtest').jec({ ignoreOptGroups: 1.2, position: 1 });
        same($('#gtest > option:eq(1)').val(), '', 'Ignoring invalid parameter (float)');
        reset($('#gtest'));

        $('#gtest').jec({ ignoreOptGroups: null, position: 1 });
        same($('#gtest > option:eq(1)').val(), '', 'Ignoring invalid parameter (null)');
        reset($('#gtest'));

        $('#gtest').jec({ ignoreOptGroups: undefined, position: 1 });
        same($('#gtest > option:eq(1)').val(), '', 'Ignoring invalid parameter (undefined)');
        reset($('#gtest'));

        $('#gtest').jec({ ignoreOptGroups: { focus: true}, position: 1 });
        same($('#gtest > option:eq(1)').val(), '', 'Ignoring invalid parameter (object)');
        reset($('#gtest'));

        $('#gtest').jec({ ignoreOptGroups: [true], position: 1 });
        same($('#gtest > option:eq(1)').val(), '', 'Ignoring invalid parameter (array)');
        reset($('#gtest'));
		
		$('#gtest').jec({ ignoreOptGroups: $, position: 1 });
        same($('#gtest > option:eq(1)').val(), '', 'Ignoring invalid parameter (function)');
        reset($('#gtest'));
    });

    module('initJS');
    test('Editable combobox initialization', function () {
        expect(1);

        var combobox = $.jec();
        ok(combobox.children('option.jecEditableOption').length === 1,
            'Create pure JS combobox without any preferences');
        reset(combobox);
    });

    test('Options', function () {
        expect(23);

        var op = [1, 1.2, 'v1', { k1: 'v1' }, { k2: 1, k3: 1.2, k4: 'v4' }, [], undefined, null, 
            true], combobox = $.jec(op);

        ok(combobox.children('option.jecEditableOption').length === 1, 'Combobox created');
        same(combobox.children('option:eq(1)').val(), '1', 'Checking option #1 key');
        same(combobox.children('option:eq(1)').text(), '1', 'Checking option #1 value');
        same(combobox.children('option:eq(2)').val(), '1.2', 'Checking option #2 key');
        same(combobox.children('option:eq(2)').text(), '1.2', 'Checking option #2 value');
        same(combobox.children('option:eq(3)').val(), 'v1', 'Checking option #3 key');
        same(combobox.children('option:eq(3)').text(), 'v1', 'Checking option #3 value');
        same(combobox.children('option:eq(4)').val(), 'k1', 'Checking option #4 key');
        same(combobox.children('option:eq(4)').text(), 'v1', 'Checking option #4 value');
        same(combobox.children('option:eq(5)').val(), 'k2', 'Checking option #5 key');
        same(combobox.children('option:eq(5)').text(), '1', 'Checking option #5 value');
        same(combobox.children('option:eq(6)').val(), 'k3', 'Checking option #6 key');
        same(combobox.children('option:eq(6)').text(), '1.2', 'Checking option #6 value');
        same(combobox.children('option:eq(7)').val(), 'k4', 'Checking option #7 key');
        same(combobox.children('option:eq(7)').text(), 'v4', 'Checking option #7 value');
        same(combobox.children('option').length, 8, 'Checking option array length');
        reset(combobox);

        combobox = $.jec(undefined);
        ok(combobox.children('option.jecEditableOption').length === 1,
            'Combobox created (undefined)');
        reset(combobox);

        combobox = $.jec(null);
        ok(combobox.children('option.jecEditableOption').length === 1, 'Combobox created (null)');
        reset(combobox);

        combobox = $.jec('1');
        ok(combobox.children('option.jecEditableOption').length === 1,
            'Combobox created (string)');
        reset(combobox);

        combobox = $.jec(1);
        ok(combobox.children('option.jecEditableOption').length === 1, 'Combobox created (int)');
        reset(combobox);

        combobox = $.jec(1.2);
        ok(combobox.children('option.jecEditableOption').length === 1, 'Combobox created (float)');
        reset(combobox);

        combobox = $.jec(true);
        ok(combobox.children('option.jecEditableOption').length === 1,
            'Combobox created (boolean)');
        reset(combobox);

        combobox = $.jec({});
        ok(combobox.children('option.jecEditableOption').length === 1,
            'Combobox created (boolean)');
        reset(combobox);
    });

    test('Keyboard', function () {
        expect(6);

        var cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
            combobox = $.jec(cbOptions, { position: 0 });

        combobox.jec();
        key(combobox, 72);
        same(combobox.jecValue(), 'H', 'Type letter H');
        key(combobox, 105);
        same(combobox.jecValue(), 'Hi', 'Type letter i');
        key(combobox, 32);
        same(combobox.jecValue(), 'Hi ', 'Type space');
        key(combobox, 33);
        same(combobox.jecValue(), 'Hi !', 'Type !');
        key(combobox, 8);
        same(combobox.jecValue(), 'Hi ', 'Backspace');
        key(combobox, 46);
        same(combobox.jecValue(), 'Hi', 'Delete');
        reset(combobox);
    });

    test('Setting: position', function () {
        expect(13);

        var cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
            combobox = $.jec(cbOptions, { position: 0 });

        ok(combobox.children('option:first.jecEditableOption').length === 1,
            'Editable option on first position');
        reset(combobox);

        combobox = $.jec(cbOptions, { position: 1 });
        ok(combobox.children('option').eq(1).filter('.jecEditableOption').length === 1,
            'Editable option on second position');
        reset(combobox);

        combobox = $.jec(cbOptions, { position: 3 });
        ok(combobox.children('option').eq(3).filter('.jecEditableOption').length === 1,
            'Editable option on last position');
        reset(combobox);

        combobox = $.jec(cbOptions, { position: 100 });
        ok(combobox.children('option:last').filter('.jecEditableOption').length === 1,
            'Editable option on last position (value greater then number of options)');
        reset(combobox);

        combobox = $.jec(cbOptions, { position: -1 });
        ok(combobox.children('option:first.jecEditableOption').length === 1,
            'Editable option on first position (negative int)');
        reset(combobox);

        combobox = $.jec(cbOptions, { position: 1.2 });
        ok(combobox.children('option:first.jecEditableOption').length === 1,
            'Editable option on first position (float)');
        reset(combobox);

        combobox = $.jec(cbOptions, { position: '1' });
        ok(combobox.children('option:first.jecEditableOption').length === 1,
            'Editable option on first position (string)');
        reset(combobox);

        combobox = $.jec(cbOptions, { position: true });
        ok(combobox.children('option:first.jecEditableOption').length === 1,
            'Editable option on first position (boolean)');
        reset(combobox);

        combobox = $.jec(cbOptions, { position: null });
        ok(combobox.children('option:first.jecEditableOption').length === 1,
            'Editable option on first position (null)');
        reset(combobox);

        combobox = $.jec(cbOptions, { position: undefined });
        ok(combobox.children('option:first.jecEditableOption').length === 1,
            'Editable option on first position (undefined)');
        reset(combobox);

        combobox = $.jec(cbOptions, { position: {} });
        ok(combobox.children('option:first.jecEditableOption').length === 1,
            'Editable option on first position (object)');
        reset(combobox);

        combobox = $.jec(cbOptions, { position: [] });
        ok(combobox.children('option:first.jecEditableOption').length === 1,
            'Editable option on first position (array)');
        reset(combobox);

        combobox = $.jec(cbOptions, { position: $ });
        ok(combobox.children('option:first.jecEditableOption').length === 1,
            'Editable option on first position (function)');
        reset(combobox);
    });
    
    test('Setting: maxLength', function () {
        expect(10);
        
        var cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
            combobox = $.jec(cbOptions, { maxLength: 2 });

        key(combobox, 72);
        key(combobox, 72);
        key(combobox, 72);
        same(combobox.jecValue().length, 2, 'Limiting max length');
        reset(combobox);

        combobox = $.jec(cbOptions, { maxLength: -1 });
        key(combobox, 72);
        same(combobox.jecValue().length, 1, 'Negative max length');
        reset(combobox);

        combobox = $.jec(cbOptions, { maxLength: 0.1 });
        key(combobox, 72);
        same(combobox.jecValue().length, 1, 'Malformed max length (float)');
        reset(combobox);

        combobox = $.jec(cbOptions, { maxLength: '0' });
        key(combobox, 72);
        same(combobox.jecValue().length, 1, 'Malformed max length (string)');
        reset(combobox);

        combobox = $.jec(cbOptions, { maxLength: true });
        key(combobox, 72);
        same(combobox.jecValue().length, 1, 'Malformed max length (bool)');
        reset(combobox);

        combobox = $.jec(cbOptions, { maxLength: null });
        key(combobox, 72);
        same(combobox.jecValue().length, 1, 'Malformed max length (null)');
        reset(combobox);

        combobox = $.jec(cbOptions, { maxLength: undefined });
        key(combobox, 72);
        same(combobox.jecValue().length, 1, 'Malformed max length (undefined)');
        reset(combobox);

        combobox = $.jec(cbOptions, { maxLength: {} });
        key(combobox, 72);
        same(combobox.jecValue().length, 1, 'Malformed max length (object)');
        reset(combobox);

        combobox = $.jec(cbOptions, { maxLength: [] });
        key(combobox, 72);
        same(combobox.jecValue().length, 1, 'Malformed max length (array)');
        reset(combobox);

        combobox = $.jec(cbOptions, { maxLength: $ });
        key(combobox, 72);
        same(combobox.jecValue().length, 1, 'Malformed max length (function)');
        reset(combobox);
    });

    test('Setting: classes', function () {
        expect(15);

        var c1 = 'class1', c2 = 'class2',
            cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
            combobox = $.jec(cbOptions, { classes: '' });

        ok(combobox.attr('class') === '', 'No extra classes (string)');
        reset(combobox);

        combobox = $.jec(cbOptions, { classes: c1 });
        ok(combobox.hasClass(c1), 'One extra class (string)');
        reset(combobox);

        combobox = $.jec(cbOptions, { classes: c1 + ' ' + c2 });
        ok(combobox.hasClass(c1), 'Several extra classes - checking c1 class (string)');
		ok(combobox.hasClass(c2), 'Several extra classes - checking c2 class (string)');
        reset(combobox);

        combobox = $.jec(cbOptions, { classes: [] });
        ok(combobox.attr('class') === '', 'No extra classes (array)');
        reset(combobox);

        combobox = $.jec(cbOptions, { classes: [c1] });
        ok(combobox.hasClass(c1), 'One extra class (array)');
        reset(combobox);

        combobox = $.jec(cbOptions, { classes: [c1, c2] });
        ok(combobox.hasClass(c1), 'Several extra classes - checking c1 class(array)');
		ok(combobox.hasClass(c2), 'Several extra classes - checking c2 class(array)');
        reset(combobox);

        combobox = $.jec(cbOptions, { classes: 1 });
        ok(combobox.attr('class') === '', 'No extra classes (int)');
        reset(combobox);

        combobox = $.jec(cbOptions, { classes: 1.2 });
        ok(combobox.attr('class') === '', 'No extra classes (float)');
        reset(combobox);

        combobox = $.jec(cbOptions, { classes: true });
        ok(combobox.attr('class') === '', 'No extra classes (boolean)');
        reset(combobox);

        combobox = $.jec(cbOptions, { classes: null });
        ok(combobox.attr('class') === '', 'No extra classes (null)');
        reset(combobox);

        combobox = $.jec(cbOptions, { classes: undefined });
        ok(combobox.attr('class') === '', 'No extra classes (undefined)');
        reset(combobox);

        combobox = $.jec(cbOptions, { classes: {} });
        ok(combobox.attr('class') === '', 'No extra classes (object)');
        reset(combobox);

        combobox = $.jec(cbOptions, { classes: $ });
        ok(combobox.attr('class') === '', 'No extra classes (function)');
        reset(combobox);
    });

    test('Setting: optionClasses', function () {
        expect(15);

        var c1 = 'c1', c2 = 'c2', cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
            combobox = $.jec(cbOptions, { optionClasses: '' });

        ok(trim(combobox.children('option.jecEditableOption').attr('class')) ===
            'jecEditableOption', 'No extra classes (string)');
        reset(combobox);

        combobox = $.jec(cbOptions, { optionClasses: c1 });
        ok(combobox.children('option.jecEditableOption').hasClass(c1),
            'One extra class (string)');
        reset(combobox);

        combobox = $.jec(cbOptions, { optionClasses: c1 + ' ' + c2 });
        ok(combobox.children('option.jecEditableOption').hasClass(c1),
            'Several extra classes - checking c1 class (string)');
		ok(combobox.children('option.jecEditableOption').hasClass(c2),
            'Several extra classes - checking c2 class (string)');
        reset(combobox);

        combobox = $.jec(cbOptions, { optionClasses: [] });
        ok(trim(combobox.children('option.jecEditableOption').attr('class')) ===
            'jecEditableOption', 'No extra classes (array)');
        reset(combobox);

        combobox = $.jec(cbOptions, { optionClasses: [c1] });
        ok(combobox.children('option.jecEditableOption').hasClass(c1),
            'One extra class (array)');
        reset(combobox);

        combobox = $.jec(cbOptions, { optionClasses: [c1, c2] });
        ok(combobox.children('option.jecEditableOption').hasClass(c1),
             'Several extra classes - checking c1 class(array)');
		ok(combobox.children('option.jecEditableOption').hasClass(c2),
             'Several extra classes - checking c2 class(array)');
        reset(combobox);

        combobox = $.jec(cbOptions, { optionClasses: 1 });
        ok(trim(combobox.children('option.jecEditableOption').attr('class')) ===
            'jecEditableOption', 'No extra classes (int)');
        reset(combobox);

        combobox = $.jec(cbOptions, { optionClasses: 1.2 });
        ok(trim(combobox.children('option.jecEditableOption').attr('class')) ===
            'jecEditableOption', 'No extra classes (float)');
        reset(combobox);

        combobox = $.jec(cbOptions, { optionClasses: true });
        ok(trim(combobox.children('option.jecEditableOption').attr('class')) ===
            'jecEditableOption', 'No extra classes (boolean)');
        reset(combobox);

        combobox = $.jec(cbOptions, { optionClasses: null });
        ok(trim(combobox.children('option.jecEditableOption').attr('class')) ===
            'jecEditableOption', 'No extra classes (null)');
        reset(combobox);

        combobox = $.jec(cbOptions, { optionClasses: undefined });
        ok(trim(combobox.children('option.jecEditableOption').attr('class')) ===
            'jecEditableOption', 'No extra classes (undefined)');
        reset(combobox);

        combobox = $.jec(cbOptions, { optionClasses: {} });
        ok(trim(combobox.children('option.jecEditableOption').attr('class')) ===
            'jecEditableOption', 'No extra classes (object)');
        reset(combobox);

        combobox = $.jec(cbOptions, { optionClasses: $ });
        ok(trim(combobox.children('option.jecEditableOption').attr('class')) ===
            'jecEditableOption', 'No extra classes (function)');
        reset(combobox);
    });

    test('Setting: styles', function () {
        expect(12);

        var s1 = 'opacity', v1 = '0.5', s2 = 'display', v2 = 'block', obj = {},
            cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
            combobox = $.jec(cbOptions, { styles: obj });

        same(combobox.css(s1), '1', 'No extra styles');
        reset(combobox);

        obj[s1] = v1;
        combobox = $.jec(cbOptions, { styles: obj });
        same(combobox.css(s1), v1, 'Opacity changed');
        reset(combobox);

        obj[s2] = v2;
        combobox = $.jec(cbOptions, { styles: obj });
        same(combobox.css(s1), v1, 'Opacity and display changed, checking opacity');
        same(combobox.css(s2), v2, 'Opacity and display changed, checking display');
        reset(combobox);

        combobox = $.jec(cbOptions, { styles: 'width: 100px' });
        same(combobox.css(s1), '1', 'No extra styles (string)');
        reset(combobox);

        combobox = $.jec(cbOptions, { styles: 0 });
        same(combobox.css(s1), '1', 'No extra styles (int)');
        reset(combobox);

        combobox = $.jec(cbOptions, { styles: 0.5 });
        same(combobox.css(s1), '1', 'No extra styles (float)');
        reset(combobox);

        combobox = $.jec(cbOptions, { styles: true });
        same(combobox.css(s1), '1', 'No extra styles (boolean)');
        reset(combobox);

        combobox = $.jec(cbOptions, { styles: null });
        same(combobox.css(s1), '1', 'No extra styles (null)');
        reset(combobox);

        combobox = $.jec(cbOptions, { styles: undefined });
        same(combobox.css(s1), '1', 'No extra styles (undefined)');
        reset(combobox);

        combobox = $.jec(cbOptions, { styles: [] });
        same(combobox.css(s1), '1', 'No extra styles (array)');
        reset(combobox);

        combobox = $.jec(cbOptions, { styles: $ });
        same(combobox.css(s1), '1', 'No extra styles (function)');
        reset(combobox);
    });

    test('Setting: optionStyles', function () {
        expect(12);

        var s1 = 'opacity', v1 = '0.5', s2 = 'display', v2 = 'block', obj = {},
            cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
            combobox = $.jec(cbOptions, { optionStyles: obj });

        same(combobox.children('option.jecEditableOption').css(s1), '1', 'No extra styles');
        reset(combobox);

        obj[s1] = v1;
        combobox = $.jec(cbOptions, { optionStyles: obj });
        same(combobox.children('option.jecEditableOption').css(s1), v1, 'Opacity changed');
        reset(combobox);

        obj[s2] = v2;
        combobox = $.jec(cbOptions, { optionStyles: obj });
        same(combobox.children('option.jecEditableOption').css(s1), v1,
            'Opacity and display changed, checking opacity');
        same(combobox.children('option.jecEditableOption').css(s2), v2,
            'Opacity and display changed, checking display');
        reset(combobox);

        combobox = $.jec(cbOptions, { styles: 'width: 100px' });
        same(combobox.children('option.jecEditableOption').css(s1), '1', 
            'No extra styles (string)');
        reset(combobox);

        combobox = $.jec(cbOptions, { optionStyles: 0 });
        same(combobox.children('option.jecEditableOption').css(s1), '1', 'No extra styles (int)');
        reset(combobox);

        combobox = $.jec(cbOptions, { optionStyles: 0.5 });
        same(combobox.children('option.jecEditableOption').css(s1), '1', 'No extra styles (float)');
        reset(combobox);

        combobox = $.jec(cbOptions, { optionStyles: true });
        same(combobox.children('option.jecEditableOption').css(s1), '1', 
            'No extra styles (boolean)');
        reset(combobox);

        combobox = $.jec(cbOptions, { optionStyles: null });
        same(combobox.children('option.jecEditableOption').css(s1), '1', 'No extra styles (null)');
        reset(combobox);

        combobox = $.jec(cbOptions, { optionStyles: undefined });
        same(combobox.children('option.jecEditableOption').css(s1), '1', 
            'No extra styles (undefined)');
        reset(combobox);

        combobox = $.jec(cbOptions, { optionStyles: [] });
        same(combobox.children('option.jecEditableOption').css(s1), '1', 'No extra styles (array)');
        reset(combobox);

        combobox = $.jec(cbOptions, { optionStyles: $ });
        same(combobox.children('option.jecEditableOption').css(s1), '1', 
            'No extra styles (function)');
        reset(combobox);
    });
    
    test('Setting: triggerChangeEvent', function () {
        expect(10);
        
        var test = null, cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}], combobox;
        
        function testHandler() {
            test = 1;
        }
        
        combobox = $.jec(cbOptions, { triggerChangeEvent: true });
        combobox.bind('change', testHandler);
        key(combobox, 72);
        same(test, 1, 'Run change event handler');
        reset(combobox);
        test = null;

        combobox = $.jec(cbOptions, { triggerChangeEvent: false });
        combobox.bind('change', testHandler);
        key(combobox, 72);
        same(test, null, 'Ignore change event handler');
        reset(combobox);
        test = null;
        
        combobox = $.jec(cbOptions, { triggerChangeEvent: '' });
        combobox.bind('change', testHandler);
        key(combobox, 72);
        same(test, null, 'Ignore malformed parameter (string)');
        reset(combobox);
        test = null;
        
        combobox = $.jec(cbOptions, { triggerChangeEvent: 1 });
        combobox.bind('change', testHandler);
        key(combobox, 72);
        same(test, null, 'Ignore malformed parameter (int)');
        reset(combobox);
        test = null;
        
        combobox = $.jec(cbOptions, { triggerChangeEvent: 1.2 });
        combobox.bind('change', testHandler);
        key(combobox, 72);
        same(test, null, 'Ignore malformed parameter (float)');
        reset(combobox);
        test = null;
        
        combobox = $.jec(cbOptions, { triggerChangeEvent: undefined });
        combobox.bind('change', testHandler);
        key(combobox, 72);
        same(test, null, 'Ignore malformed parameter (undefined)');
        reset(combobox);
        test = null;
        
        combobox = $.jec(cbOptions, { triggerChangeEvent: null });
        combobox.bind('change', testHandler);
        key(combobox, 72);
        same(test, null, 'Ignore malformed parameter (null)');
        reset(combobox);
        test = null;
        
        combobox = $.jec(cbOptions, { triggerChangeEvent: {} });
        combobox.bind('change', testHandler);
        key(combobox, 72);
        same(test, null, 'Ignore malformed parameter (object)');
        reset(combobox);
        test = null;
        
        combobox = $.jec(cbOptions, { triggerChangeEvent: [] });
        combobox.bind('change', testHandler);
        key(combobox, 72);
        same(test, null, 'Ignore malformed parameter (array)');
        reset(combobox);
        test = null;
        
        combobox = $.jec(cbOptions, { triggerChangeEvent: $ });
        combobox.bind('change', testHandler);
        key(combobox, 72);
        same(test, null, 'Ignore malformed parameter (function)');
        reset(combobox);
        test = null;
    });

    test('Setting: focusOnNewOption', function () {
        expect(10);

        var cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
            combobox = $.jec(cbOptions, { focusOnNewOption: false, position: 1 });

        same(combobox.val(), 'opt1', 'Focus on first option');
        reset(combobox);

        combobox = $.jec(cbOptions, { focusOnNewOption: true, position: 1 });
		same(combobox.val(), '', 'Focus moved to editable option');
        reset(combobox);

        combobox = $.jec(cbOptions, { focusOnNewOption: '1', position: 1 });
        same(combobox.val(), 'opt1', 'Focus on first option (string)');
        reset(combobox);

        combobox = $.jec(cbOptions, { focusOnNewOption: 1, position: 1 });
        same(combobox.val(), 'opt1', 'Focus on first option (int)');
        reset(combobox);

        combobox = $.jec(cbOptions, { focusOnNewOption: 1.2, position: 1 });
        same(combobox.val(), 'opt1', 'Focus on first option (float)');
        reset(combobox);

        combobox = $.jec(cbOptions, { focusOnNewOption: null, position: 1 });
        same(combobox.val(), 'opt1', 'Focus on first option (null)');
        reset(combobox);

        combobox = $.jec(cbOptions, { focusOnNewOption: undefined, position: 1 });
        same(combobox.val(), 'opt1', 'Focus on first option (undefined)');
        reset(combobox);

        combobox = $.jec(cbOptions, { focusOnNewOption: { focus: true }, position: 1 });
        same(combobox.val(), 'opt1', 'Focus on first option (object)');
        reset(combobox);

        combobox = $.jec(cbOptions, { focusOnNewOption: [true], position: 1 });
        same(combobox.val(), 'opt1', 'Focus on first option (array)');
        reset(combobox);
		
		combobox = $.jec(cbOptions, { focusOnNewOption: $, position: 1 });
        same(combobox.val(), 'opt1', 'Focus on first option (function)');
        reset(combobox);
    });

    test('Setting: blinkingCursor', function () {
        // nothing to test here at the moment
        expect(0);
    });

    test('Setting: blinkingCursorInterval', function () {
        // nothing to test here at the moment
        expect(0);
    });

    test('Setting: useExistingOptions', function () {
        expect(3);

        var cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
            combobox = $.jec(cbOptions, { useExistingOptions: true });

        combobox.children('option:eq(1)').attr('selected', 'selected');
        combobox.trigger('change');
        same(combobox.jecValue(), 'opt1', 'Select first option');
        combobox.children('option:eq(2)').attr('selected', 'selected');
        combobox.trigger('change');
        same(combobox.jecValue(), 'opt2', 'Select second option');
        combobox.children('option:last').attr('selected', 'selected');
        combobox.trigger('change');
        same(combobox.jecValue(), 'opt3', 'Select last option');
        reset(combobox);
    });

    test('Setting: ignoredKeys', function () {
        expect(3);

        var cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
            combobox = $.jec(cbOptions, { ignoredKeys: [72, { min: 73, max: 75}] });

        key(combobox, 72);
        ok(combobox.jecValue() === '', 'Ignored key pressed (number)');
        key(combobox, 74);
        ok(combobox.jecValue() === '', 'Ignored key pressed (range)');
        key(combobox, 76);
        ok(combobox.jecValue() !== '', 'Key outside of ignores pressed');
        reset(combobox);
    });

    test('Setting: acceptedKeys', function () {
        expect(3);

        var cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
            combobox = $.jec(cbOptions, { acceptedKeys: [72, { min: 73, max: 75}] });

        key(combobox, 72);
        ok(combobox.jecValue() === 'H', 'Accepted key pressed (number)');
        key(combobox, 74);
        ok(combobox.jecValue() === 'HJ', 'Accepted key pressed (range)');
        key(combobox, 76);
        ok(combobox.jecValue() === 'HJ', 'Key outside of accepted pressed');
        reset(combobox);
    });

    module('disable');
    test('Editable combobox deactivation', function () {
        expect(2);

        $('#test').jec();
        $('#test').jecOff();
        ok($('#test option').length === 3, 'Check if editable option was removed');
        ok($('#test').data('jecId') !== null, 'Check if id is still present');
        reset($('#test'));
    });

    module('enable');
    test('Editable combobox activation', function () {
        expect(1);

        $('#test').jec();
        $('#test').jecOff();
        $('#test').jecOn();
        ok($('#test option.jecEditableOption').length === 1, 'Check if editable option was added');
        reset($('#test'));
    });

    module('kill');
    test('Editable combobox destruction', function () {
        expect(2);

        $('#test').jec();
        reset($('#test'));
        ok($('#test option').length === 3, 'Check if editable option was removed');
        ok($('#test').data('jecId') === undefined, 'Check if id was removed');
    });

    module('value');
    test('Getting value', function () {
        expect(3);

        var v1 = 'v1', v2 = 1, v3 = 1.2;

        $('#test').jec();
        $('#test option.jecEditableOption').text(v1).val(v1);
        same($('#test').jecValue(), v1, 'Get value (string)');
        $('#test option.jecEditableOption').text(v2).val(v2);
        same($('#test').jecValue(), String(v2), 'Get value (int)');
        $('#test option.jecEditableOption').text(v3).val(v3);
        same($('#test').jecValue(), String(v3), 'Get value (float)');
        reset($('#test'));
    });

    test('Setting value', function () {
        expect(9);

        var v1 = 'v1', v2 = 1, v3 = 1.2;

        $('#test').jec();
        $('#test').jecValue(v1);
        same($('#test').jecValue(), v1, 'Get value (string)');
        $('#test').jecValue(v2);
        same($('#test').jecValue(), String(v2), 'Get value (int)');
        $('#test').jecValue(v3);
        same($('#test').jecValue(), String(v3), 'Get value (float)');
        $('#test').jecValue({});
        same($('#test').jecValue(), String(v3), 'Get value (object)');
        $('#test').jecValue([]);
        same($('#test').jecValue(), String(v3), 'Get value (array)');
        $('#test').jecValue(null);
        same($('#test').jecValue(), String(v3), 'Get value (null)');
        $('#test').jecValue(undefined);
        same($('#test').jecValue(), String(v3), 'Get value (undefined)');
        $('#test').jecValue(true);
        same($('#test').jecValue(), String(v3), 'Get value (boolean)');
        $('#test').jecValue($);
        same($('#test').jecValue(), String(v3), 'Get value (function)');
        reset($('#test'));
    });

    module('pref');
    test('Getting preference', function () {
        expect(19);

        $('#test').jec();
        ok($('#test').jecPref() === undefined, 'Get preference (undefined)');
        ok($('#test').jecPref(null) === undefined, 'Get preference (null)');
        ok($('#test').jecPref({}) === undefined, 'Get preference (object)');
        ok($('#test').jecPref(1) === undefined, 'Get preference (int)');
        ok($('#test').jecPref(1.2) === undefined, 'Get preference (float)');
        ok($('#test').jecPref(true) === undefined, 'Get preference (boolean)');
        ok($('#test').jecPref($) === undefined, 'Get preference (function)');
        ok($('#test').jecPref('dummy') === undefined, 'Get preference (not-existing string)');

        var i, keys = [], defaults = {
            position: 0,
            classes: [],
            styles: {},
            optionClasses: [],
            optionStyles: {},
            focusOnNewOption: false,
            useExistingOptions: false,
            blinkingCursor: false,
            blinkingCursorInterval: 1000,
            ignoredKeys: [],
            acceptedKeys: [
                { min: 32, max: 126 },
                { min: 191, max: 382 }
            ]
        };

        $.each(defaults, function (key, value) {
            if (value !== undefined) {
                if (key === 'acceptedKeys') {
                    value = defaults.acceptedKeys;
                    $.each(value, function () {
                        // min,max tuple
                        if (this !== null && typeof this === 'object' &&
                            typeof this.min === 'number' && typeof this.max === 'number' &&
                            this.min <= this.max) {
                            for (i = this.min; i <= this.max; i += 1) {
                                keys[keys.length] = i;
                            }
                            // number
                        } else if (typeof this === 'number') {
                            keys[keys.length] = this;
                        }
                    });
                    same($('#test').jecPref('acceptedKeys'), keys, 'Get ' + key + ' value');
                } else {
                    same($('#test').jecPref(key), value, 'Get ' + key + ' value');
                }
            }
        });

        reset($('#test'));
    });

    test('Setting preference: position', function () {
        expect(9);

        $('#test').jec();
        $('#test').jecPref('position', 1);
        same($('#test').jecPref('position'), 1, 'Set preference (int)');
        $('#test').jecPref('position', 1.2);
        same($('#test').jecPref('position'), 1, 'Set preference (float)');
        $('#test').jecPref('position', '2');
        same($('#test').jecPref('position'), 1, 'Set preference (string)');
        $('#test').jecPref('position', {});
        same($('#test').jecPref('position'), 1, 'Set preference (object)');
        $('#test').jecPref('position', []);
        same($('#test').jecPref('position'), 1, 'Set preference (array)');
        $('#test').jecPref('position', false);
        same($('#test').jecPref('position'), 1, 'Set preference (boolean)');
        $('#test').jecPref('position', undefined);
        same($('#test').jecPref('position'), 1, 'Set preference (undefined)');
        $('#test').jecPref('position', null);
        same($('#test').jecPref('position'), 1, 'Set preference (null)');
        $('#test').jecPref('position', $);
        same($('#test').jecPref('position'), 1, 'Set preference (function)');
        reset($('#test'));
    });

    test('Setting preference: classes', function () {
        expect(9);

        var c1 = 'c1';
        $('#test').jec();
        $('#test').jecPref('classes', [c1]);
        same($('#test').jecPref('classes'), [c1], 'Set preference (array)');
        $('#test').jecPref('classes', c1);
        same($('#test').jecPref('classes'), [c1], 'Set preference (string)');
        $('#test').jecPref('classes', 1);
        same($('#test').jecPref('classes'), [c1], 'Set preference (int)');
        $('#test').jecPref('classes', 1.2);
        same($('#test').jecPref('classes'), [c1], 'Set preference (float)');
        $('#test').jecPref('classes', {});
        same($('#test').jecPref('classes'), [c1], 'Set preference (object)');
        $('#test').jecPref('classes', false);
        same($('#test').jecPref('classes'), [c1], 'Set preference (boolean)');
        $('#test').jecPref('classes', undefined);
        same($('#test').jecPref('classes'), [c1], 'Set preference (undefined)');
        $('#test').jecPref('classes', null);
        same($('#test').jecPref('classes'), [c1], 'Set preference (null)');
        $('#test').jecPref('classes', $);
        same($('#test').jecPref('classes'), [c1], 'Set preference (function)');
        reset($('#test'));
    });

    test('Setting preference: styles', function () {
        expect(9);

        var styles = { opacity: 0.5, 'display': 'none' };

        $('#test').jec();
        $('#test').jecPref('styles', styles);
        same($('#test').jecPref('styles'), styles, 'Set preference (object)');
        $('#test').jecPref('styles', []);
        same($('#test').jecPref('styles'), styles, 'Set preference (array)');
        $('#test').jecPref('styles', 'width: 100px;');
        same($('#test').jecPref('styles'), styles, 'Set preference (string)');
        $('#test').jecPref('styles', 1);
        same($('#test').jecPref('styles'), styles, 'Set preference (int)');
        $('#test').jecPref('styles', 1.2);
        same($('#test').jecPref('styles'), styles, 'Set preference (float)');
        $('#test').jecPref('styles', false);
        same($('#test').jecPref('styles'), styles, 'Set preference (boolean)');
        $('#test').jecPref('styles', undefined);
        same($('#test').jecPref('styles'), styles, 'Set preference (undefined)');
        $('#test').jecPref('styles', null);
        same($('#test').jecPref('styles'), styles, 'Set preference (null)');
        $('#test').jecPref('styles', $);
        same($('#test').jecPref('styles'), styles, 'Set preference (function)');
        reset($('#test'));
    });

    test('Setting preference: focusOnNewOption', function () {
        expect(9);

        $('#test').jec();
        $('#test').jecPref('focusOnNewOption', true);
        same($('#test').jecPref('focusOnNewOption'), true, 'Set preference (boolean)');
        $('#test').jecPref('focusOnNewOption', 'true');
        same($('#test').jecPref('focusOnNewOption'), true, 'Set preference (string)');
        $('#test').jecPref('focusOnNewOption', {});
        same($('#test').jecPref('focusOnNewOption'), true, 'Set preference (object)');
        $('#test').jecPref('focusOnNewOption', []);
        same($('#test').jecPref('focusOnNewOption'), true, 'Set preference (array)');
        $('#test').jecPref('focusOnNewOption', 1);
        same($('#test').jecPref('focusOnNewOption'), true, 'Set preference (int)');
        $('#test').jecPref('focusOnNewOption', 1.2);
        same($('#test').jecPref('focusOnNewOption'), true, 'Set preference (float)');
        $('#test').jecPref('focusOnNewOption', undefined);
        same($('#test').jecPref('focusOnNewOption'), true, 'Set preference (undefined)');
        $('#test').jecPref('focusOnNewOption', null);
        same($('#test').jecPref('focusOnNewOption'), true, 'Set preference (null)');
        $('#test').jecPref('focusOnNewOption', $);
        same($('#test').jecPref('focusOnNewOption'), true, 'Set preference (function)');
        reset($('#test'));
    });

    test('Setting preference: useExistingOptions', function () {
        expect(9);

        $('#test').jec();
        $('#test').jecPref('useExistingOptions', true);
        same($('#test').jecPref('useExistingOptions'), true, 'Set preference (boolean)');
        $('#test').jecPref('useExistingOptions', 'true');
        same($('#test').jecPref('useExistingOptions'), true, 'Set preference (string)');
        $('#test').jecPref('useExistingOptions', {});
        same($('#test').jecPref('useExistingOptions'), true, 'Set preference (object)');
        $('#test').jecPref('useExistingOptions', []);
        same($('#test').jecPref('useExistingOptions'), true, 'Set preference (array)');
        $('#test').jecPref('useExistingOptions', 1);
        same($('#test').jecPref('useExistingOptions'), true, 'Set preference (int)');
        $('#test').jecPref('useExistingOptions', 1.2);
        same($('#test').jecPref('useExistingOptions'), true, 'Set preference (float)');
        $('#test').jecPref('useExistingOptions', undefined);
        same($('#test').jecPref('useExistingOptions'), true, 'Set preference (undefined)');
        $('#test').jecPref('useExistingOptions', null);
        same($('#test').jecPref('useExistingOptions'), true, 'Set preference (null)');
        $('#test').jecPref('useExistingOptions', $);
        same($('#test').jecPref('useExistingOptions'), true, 'Set preference (function)');
        reset($('#test'));
    });

    test('Setting preference: blinkingCursor', function () {
        expect(9);

        $('#test').jec();
        $('#test').jecPref('blinkingCursor', true);
        same($('#test').jecPref('blinkingCursor'), true, 'Set preference (boolean)');
        $('#test').jecPref('blinkingCursor', 'true');
        same($('#test').jecPref('blinkingCursor'), true, 'Set preference (string)');
        $('#test').jecPref('blinkingCursor', {});
        same($('#test').jecPref('blinkingCursor'), true, 'Set preference (object)');
        $('#test').jecPref('blinkingCursor', []);
        same($('#test').jecPref('blinkingCursor'), true, 'Set preference (array)');
        $('#test').jecPref('blinkingCursor', 1);
        same($('#test').jecPref('blinkingCursor'), true, 'Set preference (int)');
        $('#test').jecPref('blinkingCursor', 1.2);
        same($('#test').jecPref('blinkingCursor'), true, 'Set preference (float)');
        $('#test').jecPref('blinkingCursor', undefined);
        same($('#test').jecPref('blinkingCursor'), true, 'Set preference (undefined)');
        $('#test').jecPref('blinkingCursor', null);
        same($('#test').jecPref('blinkingCursor'), true, 'Set preference (null)');
        $('#test').jecPref('blinkingCursor', $);
        same($('#test').jecPref('blinkingCursor'), true, 'Set preference (function)');
        reset($('#test'));
    });

    test('Setting preference: blinkingCursorInterval', function () {
        expect(9);

        $('#test').jec();
        $('#test').jecPref('blinkingCursorInterval', 1);
        same($('#test').jecPref('blinkingCursorInterval'), 1, 'Set preference (int)');
        $('#test').jecPref('blinkingCursorInterval', 1.2);
        same($('#test').jecPref('blinkingCursorInterval'), 1, 'Set preference (float)');
        $('#test').jecPref('blinkingCursorInterval', '2');
        same($('#test').jecPref('blinkingCursorInterval'), 1, 'Set preference (string)');
        $('#test').jecPref('blinkingCursorInterval', {});
        same($('#test').jecPref('blinkingCursorInterval'), 1, 'Set preference (object)');
        $('#test').jecPref('blinkingCursorInterval', []);
        same($('#test').jecPref('blinkingCursorInterval'), 1, 'Set preference (array)');
        $('#test').jecPref('blinkingCursorInterval', false);
        same($('#test').jecPref('blinkingCursorInterval'), 1, 'Set preference (boolean)');
        $('#test').jecPref('blinkingCursorInterval', undefined);
        same($('#test').jecPref('blinkingCursorInterval'), 1, 'Set preference (undefined)');
        $('#test').jecPref('blinkingCursorInterval', null);
        same($('#test').jecPref('blinkingCursorInterval'), 1, 'Set preference (null)');
        $('#test').jecPref('blinkingCursorInterval', $);
        same($('#test').jecPref('blinkingCursorInterval'), 1, 'Set preference (function)');
        reset($('#test'));
    });

    test('Setting preference: ignoredKeys', function () {
        expect(9);

        var range, parsedRange = [10, 11, 12, 13, 14, 15, 35, 55];
        range = [
            { min: 10, max: 15 }, // (min, max) tuple
            35, 55 // number values
        ];

        $('#test').jec();
        $('#test').jecPref('ignoredKeys', range);
        same($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (array)');
        $('#test').jecPref('ignoredKeys', true);
        same($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (boolean)');
        $('#test').jecPref('ignoredKeys', '');
        same($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (string)');
        $('#test').jecPref('ignoredKeys', {});
        same($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (object)');
        $('#test').jecPref('ignoredKeys', 1);
        same($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (int)');
        $('#test').jecPref('ignoredKeys', 1.2);
        same($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (float)');
        $('#test').jecPref('ignoredKeys', undefined);
        same($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (undefined)');
        $('#test').jecPref('ignoredKeys', null);
        same($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (null)');
        $('#test').jecPref('ignoredKeys', $);
        same($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (function)');
        reset($('#test'));
    });

    test('Setting preference: acceptedKeys', function () {
        expect(9);

        var range, parsedRange = [10, 11, 12, 13, 14, 15, 35, 55];
        range = [
            { min: 10, max: 15 }, // (min, max) tuple
            35, 55 // number values
        ];

        $('#test').jec();
        $('#test').jecPref('acceptedKeys', range);
        same($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (array)');
        $('#test').jecPref('acceptedKeys', true);
        same($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (boolean)');
        $('#test').jecPref('acceptedKeys', '');
        same($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (string)');
        $('#test').jecPref('acceptedKeys', {});
        same($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (object)');
        $('#test').jecPref('acceptedKeys', 1);
        same($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (int)');
        $('#test').jecPref('acceptedKeys', 1.2);
        same($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (float)');
        $('#test').jecPref('acceptedKeys', undefined);
        same($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (undefined)');
        $('#test').jecPref('acceptedKeys', null);
        same($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (null)');
        $('#test').jecPref('acceptedKeys', $);
        same($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (function)');
        reset($('#test'));
    });
    
    $('#test').hide();
    $('#gtest').hide();
});