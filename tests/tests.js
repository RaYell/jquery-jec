/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, 
regexp: true, strict: true, newcap: true, immed: true, maxerr: 50, indent: 4, maxlen: 120*/
/*global $, jqUnit, String*/
/*members Event, acceptedKeys, andSelf, attr, bind, blinkingCursor, blinkingCursorInterval, children, classes, css, 
data, display, done, each, eq, equals, expect, filter, find, focus, focusOnNewOption, g1, hasClass, hide, ignoredKeys, 
ignoreOptGroups, isArray, isObj, isPlainObject, isSet, jECTimer, jec, jecKill, jecOff, jecOn, jecPref, jecValue, k1, 
k2, k3, k4, k5,k6, keyCode, length, log, max, maxLength, min, module, ok, opacity, opt1, opt2, opt3, optionClasses, 
optionStyles, position, remove, replace, styles, test, testDone, text, trigger, triggerChangeEvent, unbind, 
useExistingOptions, val*/

$(function () {
	'use strict';

    // hack for html validator (ol cannot be empty)
    $('li').remove();

    // disable timers in order not to hang up the browser
    $.jECTimer = null;

    var trim, key, reset, isEmptyOrUndefined;

    trim = function (str) {
        return str.replace(/(^\s+)|(\s+$)/, '');
    };

    key = function (elem, code) {
        var list = ['keydown', 'keypress', 'keyup'];
        $.each(list, function () {
			var val = this, e = $.Event(val, { keyCode: code });
            elem.trigger(e);
        });
    };

    reset = function (elem) {
        elem.jecKill();
        elem.val('opt2');
        elem.children().andSelf().attr('class', '');
        elem.children().andSelf().attr('style', '');
    };
	
	isEmptyOrUndefined = function (value) {
		return value === '' || value === undefined;
	};

	jqUnit.module('init');
	jqUnit.test('Editable combobox initialization', function () {
		jqUnit.expect(1);

		$('#test').jec();
		jqUnit.ok($('#test:editable').length === 1, 'Create combobox without any preferences');
		reset($('#test'));
	});

	jqUnit.test('Keyboard', function () {
		jqUnit.expect(6);

		$('#test').jec();
		key($('#test'), 72);
		jqUnit.equals($('#test').jecValue(), 'H', 'Type letter H');
		key($('#test'), 105);
		jqUnit.equals($('#test').jecValue(), 'Hi', 'Type letter i');
		key($('#test'), 32);
		jqUnit.equals($('#test').jecValue(), 'Hi ', 'Type space');
		key($('#test'), 33);
		jqUnit.equals($('#test').jecValue(), 'Hi !', 'Type !');
		key($('#test'), 8);
		jqUnit.equals($('#test').jecValue(), 'Hi ', 'Backspace');
		key($('#test'), 46);
		jqUnit.equals($('#test').jecValue(), 'Hi', 'Delete');
		reset($('#test'));
	});

	jqUnit.test('Setting: position', function () {
		jqUnit.expect(13);

		$('#test').jec({ position: 0 });
		jqUnit.ok($('#test').children('option:first.jecEditableOption').length === 1,
			'Editable option on first position');
		reset($('#test'));

		$('#test').jec({ position: 1 });
		jqUnit.ok($('#test').children('option').eq(1).filter('.jecEditableOption').length === 1,
			'Editable option on second position');
		reset($('#test'));

		$('#test').jec({ position: 3 });
		jqUnit.ok($('#test').children('option:last').filter('.jecEditableOption').length === 1,
			'Editable option on last position');
		reset($('#test'));

		$('#test').jec({ position: 100 });
		jqUnit.ok($('#test').children('option:last').filter('.jecEditableOption').length === 1,
			'Editable option on last position (value greater then number of options)');
		reset($('#test'));

		$('#test').jec({ position: -1 });
		jqUnit.ok($('#test').children('option:first.jecEditableOption').length === 1,
			'Editable option on first position (negative int)');
		reset($('#test'));

		$('#test').jec({ position: 1.2 });
		jqUnit.ok($('#test').children('option:first.jecEditableOption').length === 1,
			'Editable option on first position (float)');
		reset($('#test'));

		$('#test').jec({ position: '1' });
		jqUnit.ok($('#test').children('option:first.jecEditableOption').length === 1,
			'Editable option on first position (string)');
		reset($('#test'));

		$('#test').jec({ position: true });
		jqUnit.ok($('#test').children('option:first.jecEditableOption').length === 1,
			'Editable option on first position (boolean)');
		reset($('#test'));

		$('#test').jec({ position: null });
		jqUnit.ok($('#test').children('option:first.jecEditableOption').length === 1,
			'Editable option on first position (null)');
		reset($('#test'));

		$('#test').jec({ position: undefined });
		jqUnit.ok($('#test').children('option:first.jecEditableOption').length === 1,
			'Editable option on first position (undefined)');
		reset($('#test'));

		$('#test').jec({ position: {} });
		jqUnit.ok($('#test').children('option:first.jecEditableOption').length === 1,
			'Editable option on first position (object)');
		reset($('#test'));

		$('#test').jec({ position: [] });
		jqUnit.ok($('#test').children('option:first.jecEditableOption').length === 1,
			'Editable option on first position (array)');
		reset($('#test'));

		$('#test').jec({ position: $ });
		jqUnit.ok($('#test').children('option:first.jecEditableOption').length === 1,
			'Editable option on first position (function)');
		reset($('#test'));
	});
	
	jqUnit.test('Setting: maxLength', function () {
		jqUnit.expect(10);

		$('#test').jec({ maxLength: 2 });
		key($('#test'), 72);
		key($('#test'), 72);
		key($('#test'), 72);
		jqUnit.equals($('#test').jecValue().length, 2, 'Limiting max length');
		reset($('#test'));

		$('#test').jec({ maxLength: -1 });
		key($('#test'), 72);
		jqUnit.equals($('#test').jecValue().length, 1, 'Negative max length');
		reset($('#test'));

		$('#test').jec({ maxLength: 0.1 });
		key($('#test'), 72);
		jqUnit.equals($('#test').jecValue().length, 1, 'Malformed max length (float)');
		reset($('#test'));

		$('#test').jec({ maxLength: '0' });
		key($('#test'), 72);
		jqUnit.equals($('#test').jecValue().length, 1, 'Malformed max length (string)');
		reset($('#test'));

		$('#test').jec({ maxLength: true });
		key($('#test'), 72);
		jqUnit.equals($('#test').jecValue().length, 1, 'Malformed max length (bool)');
		reset($('#test'));

		$('#test').jec({ maxLength: null });
		key($('#test'), 72);
		jqUnit.equals($('#test').jecValue().length, 1, 'Malformed max length (null)');
		reset($('#test'));

		$('#test').jec({ maxLength: undefined });
		key($('#test'), 72);
		jqUnit.equals($('#test').jecValue().length, 1, 'Malformed max length (undefined)');
		reset($('#test'));

		$('#test').jec({ maxLength: {} });
		key($('#test'), 72);
		jqUnit.equals($('#test').jecValue().length, 1, 'Malformed max length (object)');
		reset($('#test'));

		$('#test').jec({ maxLength: [] });
		key($('#test'), 72);
		jqUnit.equals($('#test').jecValue().length, 1, 'Malformed max length (array)');
		reset($('#test'));

		$('#test').jec({ maxLength: $ });
		key($('#test'), 72);
		jqUnit.equals($('#test').jecValue().length, 1, 'Malformed max length (function)');
		reset($('#test'));
	});

	jqUnit.test('Setting: classes', function () {
		jqUnit.expect(15);

		var c1 = 'class1', c2 = 'class2';

		$('#test').jec({ classes: '' });
		jqUnit.ok(isEmptyOrUndefined($('#test').attr('class')), 'No extra classes (string)');
		reset($('#test'));

		$('#test').jec({ classes: c1 });
		jqUnit.ok($('#test').hasClass(c1), 'One extra class (string)');
		reset($('#test'));

		$('#test').jec({ classes: c1 + ' ' + c2 });
		jqUnit.ok($('#test').hasClass(c1), 'Several extra classes  - checking c1 class (string)');
		jqUnit.ok($('#test').hasClass(c2), 'Several extra classes  - checking c2 class (string)');
		reset($('#test'));

		$('#test').jec({ classes: [] });
		jqUnit.ok(isEmptyOrUndefined($('#test').attr('class')), 'No extra classes (array)');
		reset($('#test'));

		$('#test').jec({ classes: [c1] });
		jqUnit.ok($('#test').hasClass(c1), 'One extra class (array)');
		reset($('#test'));

		$('#test').jec({ classes: [c1, c2] });
		jqUnit.ok($('#test').hasClass(c1), 'Several extra classes - checking c1 class (array)');
		jqUnit.ok($('#test').hasClass(c2), 'Several extra classes - checking c1 class (array)');
		reset($('#test'));

		$('#test').jec({ classes: 1 });
		jqUnit.ok(isEmptyOrUndefined($('#test').attr('class')), 'No extra classes (int)');
		reset($('#test'));

		$('#test').jec({ classes: 1.2 });
		jqUnit.ok(isEmptyOrUndefined($('#test').attr('class')), 'No extra classes (float)');
		reset($('#test'));

		$('#test').jec({ classes: true });
		jqUnit.ok(isEmptyOrUndefined($('#test').attr('class')), 'No extra classes (boolean)');
		reset($('#test'));

		$('#test').jec({ classes: null });
		jqUnit.ok(isEmptyOrUndefined($('#test').attr('class')), 'No extra classes (null)');
		reset($('#test'));

		$('#test').jec({ classes: undefined });
		jqUnit.ok(isEmptyOrUndefined($('#test').attr('class')), 'No extra classes (undefined)');
		reset($('#test'));

		$('#test').jec({ classes: {} });
		jqUnit.ok(isEmptyOrUndefined($('#test').attr('class')), 'No extra classes (object)');
		reset($('#test'));

		$('#test').jec({ classes: $ });
		jqUnit.ok(isEmptyOrUndefined($('#test').attr('class')), 'No extra classes (function)');
		reset($('#test'));
	});

	jqUnit.test('Setting: optionClasses', function () {
		jqUnit.expect(15);

		var c1 = 'c1', c2 = 'c2';

		$('#test').jec({ optionClasses: '' });
		jqUnit.ok(trim($('#test').children('option.jecEditableOption').attr('class')) ===
			'jecEditableOption', 'No extra classes (string)');
		reset($('#test'));

		$('#test').jec({ optionClasses: c1 });
		jqUnit.ok($('#test').children('option.jecEditableOption').hasClass(c1),
			'One extra class (string)');
		reset($('#test'));

		$('#test').jec({ optionClasses: c1 + ' ' + c2 });
		jqUnit.ok($('#test').children('option.jecEditableOption').hasClass(c1),
			'Several extra classes - checking c1 class(string)');
		jqUnit.ok($('#test').children('option.jecEditableOption').hasClass(c2),
			'Several extra classes - checking c2 class(string)');
		reset($('#test'));

		$('#test').jec({ optionClasses: [] });
		jqUnit.ok(trim($('#test').children('option.jecEditableOption').attr('class')) ===
			'jecEditableOption', 'No extra classes (array)');
		reset($('#test'));

		$('#test').jec({ optionClasses: [c1] });
		jqUnit.ok($('#test').children('option.jecEditableOption').hasClass(c1),
			'One extra class (array)');
		reset($('#test'));

		$('#test').jec({ optionClasses: [c1, c2] });
		jqUnit.ok($('#test').children('option.jecEditableOption').hasClass(c1),
			 'Several extra classes - checking c1 class (array)');
		jqUnit.ok($('#test').children('option.jecEditableOption').hasClass(c2),
			 'Several extra classes - checking c1 class (array)');
		reset($('#test'));

		$('#test').jec({ optionClasses: 1 });
		jqUnit.ok(trim($('#test').children('option.jecEditableOption').attr('class')) ===
			'jecEditableOption', 'No extra classes (int)');
		reset($('#test'));

		$('#test').jec({ optionClasses: 1.2 });
		jqUnit.ok(trim($('#test').children('option.jecEditableOption').attr('class')) ===
			'jecEditableOption', 'No extra classes (float)');
		reset($('#test'));

		$('#test').jec({ optionClasses: true });
		jqUnit.ok(trim($('#test').children('option.jecEditableOption').attr('class')) ===
			'jecEditableOption', 'No extra classes (boolean)');
		reset($('#test'));

		$('#test').jec({ optionClasses: null });
		jqUnit.ok(trim($('#test').children('option.jecEditableOption').attr('class')) ===
			'jecEditableOption', 'No extra classes (null)');
		reset($('#test'));

		$('#test').jec({ optionClasses: undefined });
		jqUnit.ok(trim($('#test').children('option.jecEditableOption').attr('class')) ===
			'jecEditableOption', 'No extra classes (undefined)');
		reset($('#test'));

		$('#test').jec({ optionClasses: {} });
		jqUnit.ok(trim($('#test').children('option.jecEditableOption').attr('class')) ===
			'jecEditableOption', 'No extra classes (object)');
		reset($('#test'));

		$('#test').jec({ optionClasses: $ });
		jqUnit.ok(trim($('#test').children('option.jecEditableOption').attr('class')) ===
			'jecEditableOption', 'No extra classes (function)');
		reset($('#test'));
	});

	jqUnit.test('Setting: styles', function () {
		jqUnit.expect(12);

		var s1 = 'opacity', v1 = '0.5', s2 = 'display', v2 = 'none', obj = {};

		$('#test').jec({ styles: obj });
		jqUnit.equals($('#test').css(s1), '1', 'No extra styles');
		reset($('#test'));

		obj[s1] = v1;
		$('#test').jec({ styles: obj });
		jqUnit.equals($('#test').css(s1), v1, 'Opacity changed');
		reset($('#test'));

		obj[s2] = v2;
		$('#test').jec({ styles: obj });
		jqUnit.equals($('#test').css(s1), v1, 'Opacity and display changed, checking opacity');
		jqUnit.equals($('#test').css(s2), v2, 'Opacity and display changed, checking display');
		reset($('#test'));

		$('#test').jec({ styles: 'width: 100px' });
		jqUnit.equals($('#test').css(s1), '1', 'No extra styles (string)');
		reset($('#test'));

		$('#test').jec({ styles: 0 });
		jqUnit.equals($('#test').css(s1), '1', 'No extra styles (int)');
		reset($('#test'));

		$('#test').jec({ styles: 0.5 });
		jqUnit.equals($('#test').css(s1), '1', 'No extra styles (float)');
		reset($('#test'));

		$('#test').jec({ styles: true });
		jqUnit.equals($('#test').css(s1), '1', 'No extra styles (boolean)');
		reset($('#test'));

		$('#test').jec({ styles: null });
		jqUnit.equals($('#test').css(s1), '1', 'No extra styles (null)');
		reset($('#test'));

		$('#test').jec({ styles: undefined });
		jqUnit.equals($('#test').css(s1), '1', 'No extra styles (undefined)');
		reset($('#test'));

		$('#test').jec({ styles: [] });
		jqUnit.equals($('#test').css(s1), '1', 'No extra styles (array)');
		reset($('#test'));

		$('#test').jec({ styles: $ });
		jqUnit.equals($('#test').css(s1), '1', 'No extra styles (function)');
		reset($('#test'));
	});

	jqUnit.test('Setting: optionStyles', function () {
		jqUnit.expect(12);

		var s1 = 'opacity', v1 = '0.5', s2 = 'display', v2 = 'none', obj = {};

		$('#test').jec({ optionStyles: obj });
		jqUnit.equals($('#test option.jecEditableOption').css(s1), '1', 'No extra styles');
		reset($('#test'));

		obj[s1] = v1;
		$('#test').jec({ optionStyles: obj });
		jqUnit.equals($('#test option.jecEditableOption').css(s1), v1, 'Opacity changed');
		reset($('#test'));

		obj[s2] = v2;
		$('#test').jec({ optionStyles: obj });
		jqUnit.equals($('#test option.jecEditableOption').css(s1), v1,
			'Opacity and display changed, checking opacity');
		jqUnit.equals($('#test option.jecEditableOption').css(s2), v2,
			'Opacity and display changed, checking display');
		reset($('#test'));

		$('#test').jec({ styles: 'width: 100px' });
		jqUnit.equals($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (string)');
		reset($('#test'));

		$('#test').jec({ optionStyles: 0 });
		jqUnit.equals($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (int)');
		reset($('#test'));

		$('#test').jec({ optionStyles: 0.5 });
		jqUnit.equals($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (float)');
		reset($('#test'));

		$('#test').jec({ optionStyles: true });
		jqUnit.equals($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (boolean)');
		reset($('#test'));

		$('#test').jec({ optionStyles: null });
		jqUnit.equals($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (null)');
		reset($('#test'));

		$('#test').jec({ optionStyles: undefined });
		jqUnit.equals($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (undefined)');
		reset($('#test'));

		$('#test').jec({ optionStyles: [] });
		jqUnit.equals($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (array)');
		reset($('#test'));

		$('#test').jec({ optionStyles: $ });
		jqUnit.equals($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (function)');
		reset($('#test'));
	});
   
	jqUnit.test('Setting: triggerChangeEvent', function () {
		jqUnit.expect(10);
		
		var val = null;
		
		function testHandler() {
			val = 1;
		}
		
		$('#test').bind('change', testHandler);
		
		$('#test').jec({ triggerChangeEvent: true });
		key($('#test'), 72);
		jqUnit.equals(val, 1, 'Run change event handler');
		reset($('#test'));
		val = null;

		$('#test').jec({ triggerChangeEvent: false });
		key($('#test'), 72);
		jqUnit.equals(val, null, 'Ignore change event handler');
		reset($('#test'));
		val = null;
		
		$('#test').jec({ triggerChangeEvent: '' });
		key($('#test'), 72);
		jqUnit.equals(val, null, 'Ignore malformed parameter (string)');
		reset($('#test'));
		val = null;
		
		$('#test').jec({ triggerChangeEvent: 1 });
		key($('#test'), 72);
		jqUnit.equals(val, null, 'Ignore malformed parameter (int)');
		reset($('#test'));
		val = null;
		
		$('#test').jec({ triggerChangeEvent: 1.2 });
		key($('#test'), 72);
		jqUnit.equals(val, null, 'Ignore malformed parameter (float)');
		reset($('#test'));
		val = null;
		
		$('#test').jec({ triggerChangeEvent: undefined });
		key($('#test'), 72);
		jqUnit.equals(val, null, 'Ignore malformed parameter (undefined)');
		reset($('#test'));
		val = null;
		
		$('#test').jec({ triggerChangeEvent: null });
		key($('#test'), 72);
		jqUnit.equals(val, null, 'Ignore malformed parameter (null)');
		reset($('#test'));
		val = null;
		
		$('#test').jec({ triggerChangeEvent: {} });
		key($('#test'), 72);
		jqUnit.equals(val, null, 'Ignore malformed parameter (object)');
		reset($('#test'));
		val = null;
		
		$('#test').jec({ triggerChangeEvent: [] });
		key($('#test'), 72);
		jqUnit.equals(val, null, 'Ignore malformed parameter (array)');
		reset($('#test'));
		val = null;
		
		$('#test').jec({ triggerChangeEvent: $ });
		key($('#test'), 72);
		jqUnit.equals(val, null, 'Ignore malformed parameter (function)');
		reset($('#test'));
		val = null;
		
		$('#test').unbind('change', testHandler);
	});

	jqUnit.test('Setting: focusOnNewOption', function () {
		jqUnit.expect(10);

		$('#test').jec({ focusOnNewOption: false });
		jqUnit.equals($('#test').val(), 'opt2', 'Focus on second option (bool false)');
		reset($('#test'));

		$('#test').jec({ focusOnNewOption: true });
		jqUnit.equals($('#test').val(), '', 'Focus on editable option (bool true)');
		reset($('#test'));

		$('#test').jec({ focusOnNewOption: '1' });
		jqUnit.equals($('#test').val(), 'opt2', 'Focus on second option (string)');
		reset($('#test'));

		$('#test').jec({ focusOnNewOption: 1 });
		jqUnit.equals($('#test').val(), 'opt2', 'Focus on second option (int)');
		reset($('#test'));

		$('#test').jec({ focusOnNewOption: 1.2 });
		jqUnit.equals($('#test').val(), 'opt2', 'Focus on second option (float)');
		reset($('#test'));

		$('#test').jec({ focusOnNewOption: null });
		jqUnit.equals($('#test').val(), 'opt2', 'Focus on second option (null)');
		reset($('#test'));

		$('#test').jec({ focusOnNewOption: undefined });
		jqUnit.equals($('#test').val(), 'opt2', 'Focus on second option (undefined)');
		reset($('#test'));

		$('#test').jec({ focusOnNewOption: { focus: true} });
		jqUnit.equals($('#test').val(), 'opt2', 'Focus on second option (object)');
		reset($('#test'));

		$('#test').jec({ focusOnNewOption: [true] });
		jqUnit.equals($('#test').val(), 'opt2', 'Focus on second option (array)');
		reset($('#test'));
		
		$('#test').jec({ focusOnNewOption: $ });
		jqUnit.equals($('#test').val(), 'opt2', 'Focus on second option (function)');
		reset($('#test'));
	});

	jqUnit.test('Setting: blinkingCursor', function () {
		// nothing to jqUnit.test here at the moment
		jqUnit.expect(0);
	});

	jqUnit.test('Setting: blinkingCursorInterval', function () {
		// nothing to jqUnit.test here at the moment
		jqUnit.expect(0);
	});

	jqUnit.test('Setting: useExistingOptions', function () {
		jqUnit.expect(3);

		$('#test').jec({ useExistingOptions: true });
		$('#test option:eq(1)').attr('selected', 'selected');
		$('#test').trigger('change');
		jqUnit.equals($('#test').jecValue(), 'opt1', 'Select first option');
		$('#test option:eq(2)').attr('selected', 'selected');
		$('#test').trigger('change');
		jqUnit.equals($('#test').jecValue(), 'opt2', 'Select second option');
		$('#test option:last').attr('selected', 'selected');
		$('#test').trigger('change');
		jqUnit.equals($('#test').jecValue(), 'opt3', 'Select last option');
		reset($('#test'));
	});

	jqUnit.test('Setting: ignoredKeys', function () {
		jqUnit.expect(3);

		$('#test').jec({ ignoredKeys: [72, { min: 73, max: 75}] });
		key($('#test'), 72);
		jqUnit.equals($('#test').jecValue(), '', 'Ignored key pressed (number)');
		key($('#test'), 74);
		jqUnit.equals($('#test').jecValue(), '', 'Ignored key pressed (range)');
		key($('#test'), 76);
		jqUnit.equals($('#test').jecValue(), 'L', 'Key outside of ignores pressed');
		reset($('#test'));
	});

	jqUnit.test('Setting: acceptedKeys', function () {
		jqUnit.expect(3);

		$('#test').jec({ acceptedKeys: [72, { min: 73, max: 75}] });
		key($('#test'), 72);
		jqUnit.equals($('#test').jecValue(), 'H', 'Accepted key pressed (number)');
		key($('#test'), 74);
		jqUnit.equals($('#test').jecValue(), 'HJ', 'Accepted key pressed (range)');
		key($('#test'), 76);
		jqUnit.equals($('#test').jecValue(), 'HJ', 'Key outside of accepted pressed');
		reset($('#test'));
	});
	
	jqUnit.test('Setting: ignoreOptGroups', function () {
		jqUnit.expect(10);

		$('#gtest').jec({ ignoreOptGroups: false, position: 1 });
		jqUnit.equals($('#gtest > option:eq(1)').val(), '', 'Correct editable option placement');
		reset($('#gtest'));
		
		$('#gtest').jec({ ignoreOptGroups: true, position: 1 });
		jqUnit.equals($('#gtest optgroup:first option:first').val(), '', 
			'Correct editable option placement inside optgroup');
		reset($('#gtest'));

		$('#gtest').jec({ ignoreOptGroups: '1', position: 1 });
		jqUnit.equals($('#gtest > option:eq(1)').val(), '', 'Ignoring invalid parameter (string)');
		reset($('#gtest'));

		$('#gtest').jec({ ignoreOptGroups: 1, position: 1 });
		jqUnit.equals($('#gtest > option:eq(1)').val(), '', 'Ignoring invalid parameter (int)');
		reset($('#gtest'));

		$('#gtest').jec({ ignoreOptGroups: 1.2, position: 1 });
		jqUnit.equals($('#gtest > option:eq(1)').val(), '', 'Ignoring invalid parameter (float)');
		reset($('#gtest'));

		$('#gtest').jec({ ignoreOptGroups: null, position: 1 });
		jqUnit.equals($('#gtest > option:eq(1)').val(), '', 'Ignoring invalid parameter (null)');
		reset($('#gtest'));

		$('#gtest').jec({ ignoreOptGroups: undefined, position: 1 });
		jqUnit.equals($('#gtest > option:eq(1)').val(), '', 'Ignoring invalid parameter (undefined)');
		reset($('#gtest'));

		$('#gtest').jec({ ignoreOptGroups: { focus: true}, position: 1 });
		jqUnit.equals($('#gtest > option:eq(1)').val(), '', 'Ignoring invalid parameter (object)');
		reset($('#gtest'));

		$('#gtest').jec({ ignoreOptGroups: [true], position: 1 });
		jqUnit.equals($('#gtest > option:eq(1)').val(), '', 'Ignoring invalid parameter (array)');
		reset($('#gtest'));
		
		$('#gtest').jec({ ignoreOptGroups: $, position: 1 });
		jqUnit.equals($('#gtest > option:eq(1)').val(), '', 'Ignoring invalid parameter (function)');
		reset($('#gtest'));
	});

	jqUnit.module('initJS');
	jqUnit.test('Editable combobox initialization', function () {
		jqUnit.expect(1);

		var combobox = $.jec();
		jqUnit.ok(combobox.children('option.jecEditableOption').length === 1,
			'Create pure JS combobox without any preferences');
		reset(combobox);
	});

	jqUnit.test('Options', function () {
		jqUnit.expect(34);

		var op = [1, 1.2, 'v1', { k1: 'v1' }, { k2: 1, k3: 1.2, k4: 'v4' }, [], undefined, null, 
			true, { g1: [2.3, 2, {k5: 'v5', k6: 3}]}], combobox = $.jec(op);

		jqUnit.ok(combobox.children('option.jecEditableOption').length === 1, 'Combobox created');
		jqUnit.equals(combobox.children('option:eq(1)').val(), '1', 'Checking option #1 key');
		jqUnit.equals(combobox.children('option:eq(1)').text(), '1', 'Checking option #1 value');
		jqUnit.equals(combobox.children('option:eq(2)').val(), '1.2', 'Checking option #2 key');
		jqUnit.equals(combobox.children('option:eq(2)').text(), '1.2', 'Checking option #2 value');
		jqUnit.equals(combobox.children('option:eq(3)').val(), 'v1', 'Checking option #3 key');
		jqUnit.equals(combobox.children('option:eq(3)').text(), 'v1', 'Checking option #3 value');
		jqUnit.equals(combobox.children('option:eq(4)').val(), 'k1', 'Checking option #4 key');
		jqUnit.equals(combobox.children('option:eq(4)').text(), 'v1', 'Checking option #4 value');
		jqUnit.equals(combobox.children('option:eq(5)').val(), 'k2', 'Checking option #5 key');
		jqUnit.equals(combobox.children('option:eq(5)').text(), '1', 'Checking option #5 value');
		jqUnit.equals(combobox.children('option:eq(6)').val(), 'k3', 'Checking option #6 key');
		jqUnit.equals(combobox.children('option:eq(6)').text(), '1.2', 'Checking option #6 value');
		jqUnit.equals(combobox.children('option:eq(7)').val(), 'k4', 'Checking option #7 key');
		jqUnit.equals(combobox.children('option:eq(7)').text(), 'v4', 'Checking option #7 value');
		jqUnit.equals(combobox.children('option').length, 8, 'Checking options number');
		
		jqUnit.equals(combobox.children('optgroup').length, 1, 'Checking optgroup number');
		jqUnit.equals(combobox.children('optgroup').attr('label'), 'g1', 'Checking optgroup number');
		jqUnit.equals(combobox.find('optgroup option').length, 4, 'Checking optgroup options number');
		jqUnit.equals(combobox.find('optgroup option:eq(0)').val(), '2.3', 
			'Checking optgroup option #1 key');
		jqUnit.equals(combobox.find('optgroup option:eq(0)').text(), '2.3', 
			'Checking optgroup option #1 value');
		jqUnit.equals(combobox.find('optgroup option:eq(1)').val(), '2', 
			'Checking optgroup option #2 key');
		jqUnit.equals(combobox.find('optgroup option:eq(1)').text(), '2', 
			'Checking optgroup option #2 value');
		jqUnit.equals(combobox.find('optgroup option:eq(2)').val(), 'k5', 
			'Checking optgroup option #3 key');
		jqUnit.equals(combobox.find('optgroup option:eq(2)').text(), 'v5', 
			'Checking optgroup option #3 value');
		jqUnit.equals(combobox.find('optgroup option:eq(3)').val(), 'k6', 
			'Checking optgroup option #4 key');
		jqUnit.equals(combobox.find('optgroup option:eq(3)').text(), '3', 
			'Checking optgroup option #4 value');
		reset(combobox);

		combobox = $.jec(undefined);
		jqUnit.ok(combobox.children('option.jecEditableOption').length === 1,
			'Combobox created (undefined)');
		reset(combobox);

		combobox = $.jec(null);
		jqUnit.ok(combobox.children('option.jecEditableOption').length === 1, 'Combobox created (null)');
		reset(combobox);

		combobox = $.jec('1');
		jqUnit.ok(combobox.children('option.jecEditableOption').length === 1,
			'Combobox created (string)');
		reset(combobox);

		combobox = $.jec(1);
		jqUnit.ok(combobox.children('option.jecEditableOption').length === 1, 'Combobox created (int)');
		reset(combobox);

		combobox = $.jec(1.2);
		jqUnit.ok(combobox.children('option.jecEditableOption').length === 1, 'Combobox created (float)');
		reset(combobox);

		combobox = $.jec(true);
		jqUnit.ok(combobox.children('option.jecEditableOption').length === 1,
			'Combobox created (boolean)');
		reset(combobox);

		combobox = $.jec({});
		jqUnit.ok(combobox.children('option.jecEditableOption').length === 1,
			'Combobox created (boolean)');
		reset(combobox);
	});

	jqUnit.test('Keyboard', function () {
		jqUnit.expect(6);

		var cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
			combobox = $.jec(cbOptions, { position: 0 });

		combobox.jec();
		key(combobox, 72);
		jqUnit.equals(combobox.jecValue(), 'H', 'Type letter H');
		key(combobox, 105);
		jqUnit.equals(combobox.jecValue(), 'Hi', 'Type letter i');
		key(combobox, 32);
		jqUnit.equals(combobox.jecValue(), 'Hi ', 'Type space');
		key(combobox, 33);
		jqUnit.equals(combobox.jecValue(), 'Hi !', 'Type !');
		key(combobox, 8);
		jqUnit.equals(combobox.jecValue(), 'Hi ', 'Backspace');
		key(combobox, 46);
		jqUnit.equals(combobox.jecValue(), 'Hi', 'Delete');
		reset(combobox);
	});

	jqUnit.test('Setting: position', function () {
		jqUnit.expect(13);

		var cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
			combobox = $.jec(cbOptions, { position: 0 });

		jqUnit.ok(combobox.children('option:first.jecEditableOption').length === 1,
			'Editable option on first position');
		reset(combobox);

		combobox = $.jec(cbOptions, { position: 1 });
		jqUnit.ok(combobox.children('option').eq(1).filter('.jecEditableOption').length === 1,
			'Editable option on second position');
		reset(combobox);

		combobox = $.jec(cbOptions, { position: 3 });
		jqUnit.ok(combobox.children('option').eq(3).filter('.jecEditableOption').length === 1,
			'Editable option on last position');
		reset(combobox);

		combobox = $.jec(cbOptions, { position: 100 });
		jqUnit.ok(combobox.children('option:last').filter('.jecEditableOption').length === 1,
			'Editable option on last position (value greater then number of options)');
		reset(combobox);

		combobox = $.jec(cbOptions, { position: -1 });
		jqUnit.ok(combobox.children('option:first.jecEditableOption').length === 1,
			'Editable option on first position (negative int)');
		reset(combobox);

		combobox = $.jec(cbOptions, { position: 1.2 });
		jqUnit.ok(combobox.children('option:first.jecEditableOption').length === 1,
			'Editable option on first position (float)');
		reset(combobox);

		combobox = $.jec(cbOptions, { position: '1' });
		jqUnit.ok(combobox.children('option:first.jecEditableOption').length === 1,
			'Editable option on first position (string)');
		reset(combobox);

		combobox = $.jec(cbOptions, { position: true });
		jqUnit.ok(combobox.children('option:first.jecEditableOption').length === 1,
			'Editable option on first position (boolean)');
		reset(combobox);

		combobox = $.jec(cbOptions, { position: null });
		jqUnit.ok(combobox.children('option:first.jecEditableOption').length === 1,
			'Editable option on first position (null)');
		reset(combobox);

		combobox = $.jec(cbOptions, { position: undefined });
		jqUnit.ok(combobox.children('option:first.jecEditableOption').length === 1,
			'Editable option on first position (undefined)');
		reset(combobox);

		combobox = $.jec(cbOptions, { position: {} });
		jqUnit.ok(combobox.children('option:first.jecEditableOption').length === 1,
			'Editable option on first position (object)');
		reset(combobox);

		combobox = $.jec(cbOptions, { position: [] });
		jqUnit.ok(combobox.children('option:first.jecEditableOption').length === 1,
			'Editable option on first position (array)');
		reset(combobox);

		combobox = $.jec(cbOptions, { position: $ });
		jqUnit.ok(combobox.children('option:first.jecEditableOption').length === 1,
			'Editable option on first position (function)');
		reset(combobox);
	});
	
	jqUnit.test('Setting: maxLength', function () {
		jqUnit.expect(10);
		
		var cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
			combobox = $.jec(cbOptions, { maxLength: 2 });

		key(combobox, 72);
		key(combobox, 72);
		key(combobox, 72);
		jqUnit.equals(combobox.jecValue().length, 2, 'Limiting max length');
		reset(combobox);

		combobox = $.jec(cbOptions, { maxLength: -1 });
		key(combobox, 72);
		jqUnit.equals(combobox.jecValue().length, 1, 'Negative max length');
		reset(combobox);

		combobox = $.jec(cbOptions, { maxLength: 0.1 });
		key(combobox, 72);
		jqUnit.equals(combobox.jecValue().length, 1, 'Malformed max length (float)');
		reset(combobox);

		combobox = $.jec(cbOptions, { maxLength: '0' });
		key(combobox, 72);
		jqUnit.equals(combobox.jecValue().length, 1, 'Malformed max length (string)');
		reset(combobox);

		combobox = $.jec(cbOptions, { maxLength: true });
		key(combobox, 72);
		jqUnit.equals(combobox.jecValue().length, 1, 'Malformed max length (bool)');
		reset(combobox);

		combobox = $.jec(cbOptions, { maxLength: null });
		key(combobox, 72);
		jqUnit.equals(combobox.jecValue().length, 1, 'Malformed max length (null)');
		reset(combobox);

		combobox = $.jec(cbOptions, { maxLength: undefined });
		key(combobox, 72);
		jqUnit.equals(combobox.jecValue().length, 1, 'Malformed max length (undefined)');
		reset(combobox);

		combobox = $.jec(cbOptions, { maxLength: {} });
		key(combobox, 72);
		jqUnit.equals(combobox.jecValue().length, 1, 'Malformed max length (object)');
		reset(combobox);

		combobox = $.jec(cbOptions, { maxLength: [] });
		key(combobox, 72);
		jqUnit.equals(combobox.jecValue().length, 1, 'Malformed max length (array)');
		reset(combobox);

		combobox = $.jec(cbOptions, { maxLength: $ });
		key(combobox, 72);
		jqUnit.equals(combobox.jecValue().length, 1, 'Malformed max length (function)');
		reset(combobox);
	});

	jqUnit.test('Setting: classes', function () {
		jqUnit.expect(15);

		var c1 = 'class1', c2 = 'class2',
			cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
			combobox = $.jec(cbOptions, { classes: '' });

		jqUnit.ok(isEmptyOrUndefined(combobox.attr('class')), 'No extra classes (string)');
		reset(combobox);

		combobox = $.jec(cbOptions, { classes: c1 });
		jqUnit.ok(combobox.hasClass(c1), 'One extra class (string)');
		reset(combobox);

		combobox = $.jec(cbOptions, { classes: c1 + ' ' + c2 });
		jqUnit.ok(combobox.hasClass(c1), 'Several extra classes - checking c1 class (string)');
		jqUnit.ok(combobox.hasClass(c2), 'Several extra classes - checking c2 class (string)');
		reset(combobox);

		combobox = $.jec(cbOptions, { classes: [] });
		jqUnit.ok(isEmptyOrUndefined(combobox.attr('class')), 'No extra classes (array)');
		reset(combobox);

		combobox = $.jec(cbOptions, { classes: [c1] });
		jqUnit.ok(combobox.hasClass(c1), 'One extra class (array)');
		reset(combobox);

		combobox = $.jec(cbOptions, { classes: [c1, c2] });
		jqUnit.ok(combobox.hasClass(c1), 'Several extra classes - checking c1 class(array)');
		jqUnit.ok(combobox.hasClass(c2), 'Several extra classes - checking c2 class(array)');
		reset(combobox);

		combobox = $.jec(cbOptions, { classes: 1 });
		jqUnit.ok(isEmptyOrUndefined(combobox.attr('class')), 'No extra classes (int)');
		reset(combobox);

		combobox = $.jec(cbOptions, { classes: 1.2 });
		jqUnit.ok(isEmptyOrUndefined(combobox.attr('class')), 'No extra classes (float)');
		reset(combobox);

		combobox = $.jec(cbOptions, { classes: true });
		jqUnit.ok(isEmptyOrUndefined(combobox.attr('class')), 'No extra classes (boolean)');
		reset(combobox);

		combobox = $.jec(cbOptions, { classes: null });
		jqUnit.ok(isEmptyOrUndefined(combobox.attr('class')), 'No extra classes (null)');
		reset(combobox);

		combobox = $.jec(cbOptions, { classes: undefined });
		jqUnit.ok(isEmptyOrUndefined(combobox.attr('class')), 'No extra classes (undefined)');
		reset(combobox);

		combobox = $.jec(cbOptions, { classes: {} });
		jqUnit.ok(isEmptyOrUndefined(combobox.attr('class')), 'No extra classes (object)');
		reset(combobox);

		combobox = $.jec(cbOptions, { classes: $ });
		jqUnit.ok(isEmptyOrUndefined(combobox.attr('class')), 'No extra classes (function)');
		reset(combobox);
	});

	jqUnit.test('Setting: optionClasses', function () {
		jqUnit.expect(15);

		var c1 = 'c1', c2 = 'c2', cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
			combobox = $.jec(cbOptions, { optionClasses: '' });

		jqUnit.ok(trim(combobox.children('option.jecEditableOption').attr('class')) ===
			'jecEditableOption', 'No extra classes (string)');
		reset(combobox);

		combobox = $.jec(cbOptions, { optionClasses: c1 });
		jqUnit.ok(combobox.children('option.jecEditableOption').hasClass(c1),
			'One extra class (string)');
		reset(combobox);

		combobox = $.jec(cbOptions, { optionClasses: c1 + ' ' + c2 });
		jqUnit.ok(combobox.children('option.jecEditableOption').hasClass(c1),
			'Several extra classes - checking c1 class (string)');
		jqUnit.ok(combobox.children('option.jecEditableOption').hasClass(c2),
			'Several extra classes - checking c2 class (string)');
		reset(combobox);

		combobox = $.jec(cbOptions, { optionClasses: [] });
		jqUnit.ok(trim(combobox.children('option.jecEditableOption').attr('class')) ===
			'jecEditableOption', 'No extra classes (array)');
		reset(combobox);

		combobox = $.jec(cbOptions, { optionClasses: [c1] });
		jqUnit.ok(combobox.children('option.jecEditableOption').hasClass(c1),
			'One extra class (array)');
		reset(combobox);

		combobox = $.jec(cbOptions, { optionClasses: [c1, c2] });
		jqUnit.ok(combobox.children('option.jecEditableOption').hasClass(c1),
			 'Several extra classes - checking c1 class(array)');
		jqUnit.ok(combobox.children('option.jecEditableOption').hasClass(c2),
			 'Several extra classes - checking c2 class(array)');
		reset(combobox);

		combobox = $.jec(cbOptions, { optionClasses: 1 });
		jqUnit.ok(trim(combobox.children('option.jecEditableOption').attr('class')) ===
			'jecEditableOption', 'No extra classes (int)');
		reset(combobox);

		combobox = $.jec(cbOptions, { optionClasses: 1.2 });
		jqUnit.ok(trim(combobox.children('option.jecEditableOption').attr('class')) ===
			'jecEditableOption', 'No extra classes (float)');
		reset(combobox);

		combobox = $.jec(cbOptions, { optionClasses: true });
		jqUnit.ok(trim(combobox.children('option.jecEditableOption').attr('class')) ===
			'jecEditableOption', 'No extra classes (boolean)');
		reset(combobox);

		combobox = $.jec(cbOptions, { optionClasses: null });
		jqUnit.ok(trim(combobox.children('option.jecEditableOption').attr('class')) ===
			'jecEditableOption', 'No extra classes (null)');
		reset(combobox);

		combobox = $.jec(cbOptions, { optionClasses: undefined });
		jqUnit.ok(trim(combobox.children('option.jecEditableOption').attr('class')) ===
			'jecEditableOption', 'No extra classes (undefined)');
		reset(combobox);

		combobox = $.jec(cbOptions, { optionClasses: {} });
		jqUnit.ok(trim(combobox.children('option.jecEditableOption').attr('class')) ===
			'jecEditableOption', 'No extra classes (object)');
		reset(combobox);

		combobox = $.jec(cbOptions, { optionClasses: $ });
		jqUnit.ok(trim(combobox.children('option.jecEditableOption').attr('class')) ===
			'jecEditableOption', 'No extra classes (function)');
		reset(combobox);
	});

	jqUnit.test('Setting: styles', function () {
		jqUnit.expect(12);

		var s1 = 'opacity', v1 = '0.5', s2 = 'display', v2 = 'block', obj = {},
			cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
			combobox = $.jec(cbOptions, { styles: obj });

		jqUnit.equals(combobox.css(s1), '1', 'No extra styles');
		reset(combobox);

		obj[s1] = v1;
		combobox = $.jec(cbOptions, { styles: obj });
		jqUnit.equals(combobox.css(s1), v1, 'Opacity changed');
		reset(combobox);

		obj[s2] = v2;
		combobox = $.jec(cbOptions, { styles: obj });
		jqUnit.equals(combobox.css(s1), v1, 'Opacity and display changed, checking opacity');
		jqUnit.equals(combobox.css(s2), v2, 'Opacity and display changed, checking display');
		reset(combobox);

		combobox = $.jec(cbOptions, { styles: 'width: 100px' });
		jqUnit.equals(combobox.css(s1), '1', 'No extra styles (string)');
		reset(combobox);

		combobox = $.jec(cbOptions, { styles: 0 });
		jqUnit.equals(combobox.css(s1), '1', 'No extra styles (int)');
		reset(combobox);

		combobox = $.jec(cbOptions, { styles: 0.5 });
		jqUnit.equals(combobox.css(s1), '1', 'No extra styles (float)');
		reset(combobox);

		combobox = $.jec(cbOptions, { styles: true });
		jqUnit.equals(combobox.css(s1), '1', 'No extra styles (boolean)');
		reset(combobox);

		combobox = $.jec(cbOptions, { styles: null });
		jqUnit.equals(combobox.css(s1), '1', 'No extra styles (null)');
		reset(combobox);

		combobox = $.jec(cbOptions, { styles: undefined });
		jqUnit.equals(combobox.css(s1), '1', 'No extra styles (undefined)');
		reset(combobox);

		combobox = $.jec(cbOptions, { styles: [] });
		jqUnit.equals(combobox.css(s1), '1', 'No extra styles (array)');
		reset(combobox);

		combobox = $.jec(cbOptions, { styles: $ });
		jqUnit.equals(combobox.css(s1), '1', 'No extra styles (function)');
		reset(combobox);
	});

	jqUnit.test('Setting: optionStyles', function () {
		jqUnit.expect(12);

		var s1 = 'opacity', v1 = '0.5', s2 = 'display', v2 = 'block', obj = {},
			cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
			combobox = $.jec(cbOptions, { optionStyles: obj });

		jqUnit.equals(combobox.children('option.jecEditableOption').css(s1), '1', 'No extra styles');
		reset(combobox);

		obj[s1] = v1;
		combobox = $.jec(cbOptions, { optionStyles: obj });
		jqUnit.equals(combobox.children('option.jecEditableOption').css(s1), v1, 'Opacity changed');
		reset(combobox);

		obj[s2] = v2;
		combobox = $.jec(cbOptions, { optionStyles: obj });
		jqUnit.equals(combobox.children('option.jecEditableOption').css(s1), v1,
			'Opacity and display changed, checking opacity');
		jqUnit.equals(combobox.children('option.jecEditableOption').css(s2), v2,
			'Opacity and display changed, checking display');
		reset(combobox);

		combobox = $.jec(cbOptions, { styles: 'width: 100px' });
		jqUnit.equals(combobox.children('option.jecEditableOption').css(s1), '1', 
			'No extra styles (string)');
		reset(combobox);

		combobox = $.jec(cbOptions, { optionStyles: 0 });
		jqUnit.equals(combobox.children('option.jecEditableOption').css(s1), '1', 'No extra styles (int)');
		reset(combobox);

		combobox = $.jec(cbOptions, { optionStyles: 0.5 });
		jqUnit.equals(combobox.children('option.jecEditableOption').css(s1), '1', 'No extra styles (float)');
		reset(combobox);

		combobox = $.jec(cbOptions, { optionStyles: true });
		jqUnit.equals(combobox.children('option.jecEditableOption').css(s1), '1', 
			'No extra styles (boolean)');
		reset(combobox);

		combobox = $.jec(cbOptions, { optionStyles: null });
		jqUnit.equals(combobox.children('option.jecEditableOption').css(s1), '1', 'No extra styles (null)');
		reset(combobox);

		combobox = $.jec(cbOptions, { optionStyles: undefined });
		jqUnit.equals(combobox.children('option.jecEditableOption').css(s1), '1', 
			'No extra styles (undefined)');
		reset(combobox);

		combobox = $.jec(cbOptions, { optionStyles: [] });
		jqUnit.equals(combobox.children('option.jecEditableOption').css(s1), '1', 'No extra styles (array)');
		reset(combobox);

		combobox = $.jec(cbOptions, { optionStyles: $ });
		jqUnit.equals(combobox.children('option.jecEditableOption').css(s1), '1', 
			'No extra styles (function)');
		reset(combobox);
	});
	
	jqUnit.test('Setting: triggerChangeEvent', function () {
		jqUnit.expect(10);
		
		var test = null, cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}], combobox;
		
		function testHandler() {
			test = 1;
		}
		
		combobox = $.jec(cbOptions, { triggerChangeEvent: true });
		combobox.bind('change', testHandler);
		key(combobox, 72);
		jqUnit.equals(test, 1, 'Run change event handler');
		reset(combobox);
		test = null;

		combobox = $.jec(cbOptions, { triggerChangeEvent: false });
		combobox.bind('change', testHandler);
		key(combobox, 72);
		jqUnit.equals(test, null, 'Ignore change event handler');
		reset(combobox);
		test = null;
		
		combobox = $.jec(cbOptions, { triggerChangeEvent: '' });
		combobox.bind('change', testHandler);
		key(combobox, 72);
		jqUnit.equals(test, null, 'Ignore malformed parameter (string)');
		reset(combobox);
		test = null;
		
		combobox = $.jec(cbOptions, { triggerChangeEvent: 1 });
		combobox.bind('change', testHandler);
		key(combobox, 72);
		jqUnit.equals(test, null, 'Ignore malformed parameter (int)');
		reset(combobox);
		test = null;
		
		combobox = $.jec(cbOptions, { triggerChangeEvent: 1.2 });
		combobox.bind('change', testHandler);
		key(combobox, 72);
		jqUnit.equals(test, null, 'Ignore malformed parameter (float)');
		reset(combobox);
		test = null;
		
		combobox = $.jec(cbOptions, { triggerChangeEvent: undefined });
		combobox.bind('change', testHandler);
		key(combobox, 72);
		jqUnit.equals(test, null, 'Ignore malformed parameter (undefined)');
		reset(combobox);
		test = null;
		
		combobox = $.jec(cbOptions, { triggerChangeEvent: null });
		combobox.bind('change', testHandler);
		key(combobox, 72);
		jqUnit.equals(test, null, 'Ignore malformed parameter (null)');
		reset(combobox);
		test = null;
		
		combobox = $.jec(cbOptions, { triggerChangeEvent: {} });
		combobox.bind('change', testHandler);
		key(combobox, 72);
		jqUnit.equals(test, null, 'Ignore malformed parameter (object)');
		reset(combobox);
		test = null;
		
		combobox = $.jec(cbOptions, { triggerChangeEvent: [] });
		combobox.bind('change', testHandler);
		key(combobox, 72);
		jqUnit.equals(test, null, 'Ignore malformed parameter (array)');
		reset(combobox);
		test = null;
		
		combobox = $.jec(cbOptions, { triggerChangeEvent: $ });
		combobox.bind('change', testHandler);
		key(combobox, 72);
		jqUnit.equals(test, null, 'Ignore malformed parameter (function)');
		reset(combobox);
		test = null;
	});

	jqUnit.test('Setting: focusOnNewOption', function () {
		jqUnit.expect(10);

		var cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
			combobox = $.jec(cbOptions, { focusOnNewOption: false, position: 1 });

		jqUnit.equals(combobox.val(), 'opt1', 'Focus on first option');
		reset(combobox);

		combobox = $.jec(cbOptions, { focusOnNewOption: true, position: 1 });
		jqUnit.equals(combobox.val(), '', 'Focus moved to editable option');
		reset(combobox);

		combobox = $.jec(cbOptions, { focusOnNewOption: '1', position: 1 });
		jqUnit.equals(combobox.val(), 'opt1', 'Focus on first option (string)');
		reset(combobox);

		combobox = $.jec(cbOptions, { focusOnNewOption: 1, position: 1 });
		jqUnit.equals(combobox.val(), 'opt1', 'Focus on first option (int)');
		reset(combobox);

		combobox = $.jec(cbOptions, { focusOnNewOption: 1.2, position: 1 });
		jqUnit.equals(combobox.val(), 'opt1', 'Focus on first option (float)');
		reset(combobox);

		combobox = $.jec(cbOptions, { focusOnNewOption: null, position: 1 });
		jqUnit.equals(combobox.val(), 'opt1', 'Focus on first option (null)');
		reset(combobox);

		combobox = $.jec(cbOptions, { focusOnNewOption: undefined, position: 1 });
		jqUnit.equals(combobox.val(), 'opt1', 'Focus on first option (undefined)');
		reset(combobox);

		combobox = $.jec(cbOptions, { focusOnNewOption: { focus: true }, position: 1 });
		jqUnit.equals(combobox.val(), 'opt1', 'Focus on first option (object)');
		reset(combobox);

		combobox = $.jec(cbOptions, { focusOnNewOption: [true], position: 1 });
		jqUnit.equals(combobox.val(), 'opt1', 'Focus on first option (array)');
		reset(combobox);
		
		combobox = $.jec(cbOptions, { focusOnNewOption: $, position: 1 });
		jqUnit.equals(combobox.val(), 'opt1', 'Focus on first option (function)');
		reset(combobox);
	});

	jqUnit.test('Setting: blinkingCursor', function () {
		// nothing to jqUnit.test here at the moment
		jqUnit.expect(0);
	});

	jqUnit.test('Setting: blinkingCursorInterval', function () {
		// nothing to jqUnit.test here at the moment
		jqUnit.expect(0);
	});

	jqUnit.test('Setting: useExistingOptions', function () {
		jqUnit.expect(3);

		var cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
			combobox = $.jec(cbOptions, { useExistingOptions: true });

		combobox.children('option:eq(1)').attr('selected', 'selected');
		combobox.trigger('change');
		jqUnit.equals(combobox.jecValue(), 'opt1', 'Select first option');
		combobox.children('option:eq(2)').attr('selected', 'selected');
		combobox.trigger('change');
		jqUnit.equals(combobox.jecValue(), 'opt2', 'Select second option');
		combobox.children('option:last').attr('selected', 'selected');
		combobox.trigger('change');
		jqUnit.equals(combobox.jecValue(), 'opt3', 'Select last option');
		reset(combobox);
	});

	jqUnit.test('Setting: ignoredKeys', function () {
		jqUnit.expect(3);

		var cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
			combobox = $.jec(cbOptions, { ignoredKeys: [72, { min: 73, max: 75}] });
			
		key(combobox, 72);
		jqUnit.equals(combobox.jecValue(), '', 'Ignored key pressed (number)');
		key(combobox, 74);
		jqUnit.equals(combobox.jecValue(), '', 'Ignored key pressed (range)');
		key(combobox, 76);
		jqUnit.equals(combobox.jecValue(), 'L', 'Key outside of ignores pressed');
		reset(combobox);
	});

	jqUnit.test('Setting: acceptedKeys', function () {
		jqUnit.expect(3);

		var cbOptions = [{ opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
			combobox = $.jec(cbOptions, { acceptedKeys: [72, { min: 73, max: 75}] });

		key(combobox, 72);
		jqUnit.ok(combobox.jecValue() === 'H', 'Accepted key pressed (number)');
		key(combobox, 74);
		jqUnit.ok(combobox.jecValue() === 'HJ', 'Accepted key pressed (range)');
		key(combobox, 76);
		jqUnit.ok(combobox.jecValue() === 'HJ', 'Key outside of accepted pressed');
		reset(combobox);
	});

	jqUnit.module('disable');
	jqUnit.test('Editable combobox deactivation', function () {
		jqUnit.expect(2);

		$('#test').jec();
		$('#test').jecOff();
		jqUnit.ok($('#test option').length === 3, 'Check if editable option was removed');
		jqUnit.ok($('#test').data('jecId') !== null, 'Check if id is still present');
		reset($('#test'));
	});

	jqUnit.module('enable');
	jqUnit.test('Editable combobox activation', function () {
		jqUnit.expect(1);

		$('#test').jec();
		$('#test').jecOff();
		$('#test').jecOn();
		jqUnit.ok($('#test option.jecEditableOption').length === 1, 'Check if editable option was added');
		reset($('#test'));
	});

	jqUnit.module('kill');
	jqUnit.test('Editable combobox destruction', function () {
		jqUnit.expect(2);

		$('#test').jec();
		reset($('#test'));
		jqUnit.ok($('#test option').length === 3, 'Check if editable option was removed');
		jqUnit.ok($('#test').data('jecId') === undefined, 'Check if id was removed');
	});

	jqUnit.module('value');
	jqUnit.test('Getting value', function () {
		jqUnit.expect(3);

		var v1 = 'v1', v2 = 1, v3 = 1.2;

		$('#test').jec();
		$('#test option.jecEditableOption').text(v1).val(v1);
		jqUnit.equals($('#test').jecValue(), v1, 'Get value (string)');
		$('#test option.jecEditableOption').text(v2).val(v2);
		jqUnit.equals($('#test').jecValue(), String(v2), 'Get value (int)');
		$('#test option.jecEditableOption').text(v3).val(v3);
		jqUnit.equals($('#test').jecValue(), String(v3), 'Get value (float)');
		reset($('#test'));
	});

	jqUnit.test('Setting value', function () {
		jqUnit.expect(9);

		var v1 = 'v1', v2 = 1, v3 = 1.2;

		$('#test').jec();
		$('#test').jecValue(v1);
		jqUnit.equals($('#test').jecValue(), v1, 'Get value (string)');
		$('#test').jecValue(v2);
		jqUnit.equals($('#test').jecValue(), String(v2), 'Get value (int)');
		$('#test').jecValue(v3);
		jqUnit.equals($('#test').jecValue(), String(v3), 'Get value (float)');
		$('#test').jecValue({});
		jqUnit.equals($('#test').jecValue(), String(v3), 'Get value (object)');
		$('#test').jecValue([]);
		jqUnit.equals($('#test').jecValue(), String(v3), 'Get value (array)');
		$('#test').jecValue(null);
		jqUnit.equals($('#test').jecValue(), String(v3), 'Get value (null)');
		$('#test').jecValue(undefined);
		jqUnit.equals($('#test').jecValue(), String(v3), 'Get value (undefined)');
		$('#test').jecValue(true);
		jqUnit.equals($('#test').jecValue(), String(v3), 'Get value (boolean)');
		$('#test').jecValue($);
		jqUnit.equals($('#test').jecValue(), String(v3), 'Get value (function)');
		reset($('#test'));
	});

	jqUnit.module('pref');
	jqUnit.test('Getting preference', function () {
		jqUnit.expect(19);

		$('#test').jec();
		jqUnit.ok($('#test').jecPref() === undefined, 'Get preference (undefined)');
		jqUnit.ok($('#test').jecPref(null) === undefined, 'Get preference (null)');
		jqUnit.ok($('#test').jecPref({}) === undefined, 'Get preference (object)');
		jqUnit.ok($('#test').jecPref(1) === undefined, 'Get preference (int)');
		jqUnit.ok($('#test').jecPref(1.2) === undefined, 'Get preference (float)');
		jqUnit.ok($('#test').jecPref(true) === undefined, 'Get preference (boolean)');
		jqUnit.ok($('#test').jecPref($) === undefined, 'Get preference (function)');
		jqUnit.ok($('#test').jecPref('dummy') === undefined, 'Get preference (not-existing string)');

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
					jqUnit.isSet($('#test').jecPref('acceptedKeys'), keys, 'Get ' + key + ' value');
				} else {
					if ($.isArray(value)) {
						jqUnit.isSet($('#test').jecPref(key), value, 'Get ' + key + ' value');
					} else if ($.isPlainObject(value)) {
						jqUnit.isObj($('#test').jecPref(key), value, 'Get ' + key + ' value');
					} else {
						jqUnit.equals($('#test').jecPref(key), value, 'Get ' + key + ' value');
					}
				}
			}
		});

		reset($('#test'));
	});

	jqUnit.test('Setting preference: position', function () {
		jqUnit.expect(9);

		$('#test').jec();
		$('#test').jecPref('position', 1);
		jqUnit.equals($('#test').jecPref('position'), 1, 'Set preference (int)');
		$('#test').jecPref('position', 1.2);
		jqUnit.equals($('#test').jecPref('position'), 1, 'Set preference (float)');
		$('#test').jecPref('position', '2');
		jqUnit.equals($('#test').jecPref('position'), 1, 'Set preference (string)');
		$('#test').jecPref('position', {});
		jqUnit.equals($('#test').jecPref('position'), 1, 'Set preference (object)');
		$('#test').jecPref('position', []);
		jqUnit.equals($('#test').jecPref('position'), 1, 'Set preference (array)');
		$('#test').jecPref('position', false);
		jqUnit.equals($('#test').jecPref('position'), 1, 'Set preference (boolean)');
		$('#test').jecPref('position', undefined);
		jqUnit.equals($('#test').jecPref('position'), 1, 'Set preference (undefined)');
		$('#test').jecPref('position', null);
		jqUnit.equals($('#test').jecPref('position'), 1, 'Set preference (null)');
		$('#test').jecPref('position', $);
		jqUnit.equals($('#test').jecPref('position'), 1, 'Set preference (function)');
		reset($('#test'));
	});

	jqUnit.test('Setting preference: classes', function () {
		jqUnit.expect(9);

		var c1 = 'c1';
		$('#test').jec();
		$('#test').jecPref('classes', [c1]);
		jqUnit.isSet($('#test').jecPref('classes'), [c1], 'Set preference (array)');
		$('#test').jecPref('classes', c1);
		jqUnit.isSet($('#test').jecPref('classes'), [c1], 'Set preference (string)');
		$('#test').jecPref('classes', 1);
		jqUnit.isSet($('#test').jecPref('classes'), [c1], 'Set preference (int)');
		$('#test').jecPref('classes', 1.2);
		jqUnit.isSet($('#test').jecPref('classes'), [c1], 'Set preference (float)');
		$('#test').jecPref('classes', {});
		jqUnit.isSet($('#test').jecPref('classes'), [c1], 'Set preference (object)');
		$('#test').jecPref('classes', false);
		jqUnit.isSet($('#test').jecPref('classes'), [c1], 'Set preference (boolean)');
		$('#test').jecPref('classes', undefined);
		jqUnit.isSet($('#test').jecPref('classes'), [c1], 'Set preference (undefined)');
		$('#test').jecPref('classes', null);
		jqUnit.isSet($('#test').jecPref('classes'), [c1], 'Set preference (null)');
		$('#test').jecPref('classes', $);
		jqUnit.isSet($('#test').jecPref('classes'), [c1], 'Set preference (function)');
		reset($('#test'));
	});

	jqUnit.test('Setting preference: styles', function () {
		jqUnit.expect(9);

		var styles = { opacity: 0.5, 'display': 'none' };

		$('#test').jec();
		$('#test').jecPref('styles', styles);
		jqUnit.equals($('#test').jecPref('styles'), styles, 'Set preference (object)');
		$('#test').jecPref('styles', []);
		jqUnit.equals($('#test').jecPref('styles'), styles, 'Set preference (array)');
		$('#test').jecPref('styles', 'width: 100px;');
		jqUnit.equals($('#test').jecPref('styles'), styles, 'Set preference (string)');
		$('#test').jecPref('styles', 1);
		jqUnit.equals($('#test').jecPref('styles'), styles, 'Set preference (int)');
		$('#test').jecPref('styles', 1.2);
		jqUnit.equals($('#test').jecPref('styles'), styles, 'Set preference (float)');
		$('#test').jecPref('styles', false);
		jqUnit.equals($('#test').jecPref('styles'), styles, 'Set preference (boolean)');
		$('#test').jecPref('styles', undefined);
		jqUnit.equals($('#test').jecPref('styles'), styles, 'Set preference (undefined)');
		$('#test').jecPref('styles', null);
		jqUnit.equals($('#test').jecPref('styles'), styles, 'Set preference (null)');
		$('#test').jecPref('styles', $);
		jqUnit.equals($('#test').jecPref('styles'), styles, 'Set preference (function)');
		reset($('#test'));
	});

	jqUnit.test('Setting preference: focusOnNewOption', function () {
		jqUnit.expect(9);

		$('#test').jec();
		$('#test').jecPref('focusOnNewOption', true);
		jqUnit.equals($('#test').jecPref('focusOnNewOption'), true, 'Set preference (boolean)');
		$('#test').jecPref('focusOnNewOption', 'true');
		jqUnit.equals($('#test').jecPref('focusOnNewOption'), true, 'Set preference (string)');
		$('#test').jecPref('focusOnNewOption', {});
		jqUnit.equals($('#test').jecPref('focusOnNewOption'), true, 'Set preference (object)');
		$('#test').jecPref('focusOnNewOption', []);
		jqUnit.equals($('#test').jecPref('focusOnNewOption'), true, 'Set preference (array)');
		$('#test').jecPref('focusOnNewOption', 1);
		jqUnit.equals($('#test').jecPref('focusOnNewOption'), true, 'Set preference (int)');
		$('#test').jecPref('focusOnNewOption', 1.2);
		jqUnit.equals($('#test').jecPref('focusOnNewOption'), true, 'Set preference (float)');
		$('#test').jecPref('focusOnNewOption', undefined);
		jqUnit.equals($('#test').jecPref('focusOnNewOption'), true, 'Set preference (undefined)');
		$('#test').jecPref('focusOnNewOption', null);
		jqUnit.equals($('#test').jecPref('focusOnNewOption'), true, 'Set preference (null)');
		$('#test').jecPref('focusOnNewOption', $);
		jqUnit.equals($('#test').jecPref('focusOnNewOption'), true, 'Set preference (function)');
		reset($('#test'));
	});

	jqUnit.test('Setting preference: useExistingOptions', function () {
		jqUnit.expect(9);

		$('#test').jec();
		$('#test').jecPref('useExistingOptions', true);
		jqUnit.equals($('#test').jecPref('useExistingOptions'), true, 'Set preference (boolean)');
		$('#test').jecPref('useExistingOptions', 'true');
		jqUnit.equals($('#test').jecPref('useExistingOptions'), true, 'Set preference (string)');
		$('#test').jecPref('useExistingOptions', {});
		jqUnit.equals($('#test').jecPref('useExistingOptions'), true, 'Set preference (object)');
		$('#test').jecPref('useExistingOptions', []);
		jqUnit.equals($('#test').jecPref('useExistingOptions'), true, 'Set preference (array)');
		$('#test').jecPref('useExistingOptions', 1);
		jqUnit.equals($('#test').jecPref('useExistingOptions'), true, 'Set preference (int)');
		$('#test').jecPref('useExistingOptions', 1.2);
		jqUnit.equals($('#test').jecPref('useExistingOptions'), true, 'Set preference (float)');
		$('#test').jecPref('useExistingOptions', undefined);
		jqUnit.equals($('#test').jecPref('useExistingOptions'), true, 'Set preference (undefined)');
		$('#test').jecPref('useExistingOptions', null);
		jqUnit.equals($('#test').jecPref('useExistingOptions'), true, 'Set preference (null)');
		$('#test').jecPref('useExistingOptions', $);
		jqUnit.equals($('#test').jecPref('useExistingOptions'), true, 'Set preference (function)');
		reset($('#test'));
	});

	jqUnit.test('Setting preference: blinkingCursor', function () {
		jqUnit.expect(9);

		$('#test').jec();
		$('#test').jecPref('blinkingCursor', true);
		jqUnit.equals($('#test').jecPref('blinkingCursor'), true, 'Set preference (boolean)');
		$('#test').jecPref('blinkingCursor', 'true');
		jqUnit.equals($('#test').jecPref('blinkingCursor'), true, 'Set preference (string)');
		$('#test').jecPref('blinkingCursor', {});
		jqUnit.equals($('#test').jecPref('blinkingCursor'), true, 'Set preference (object)');
		$('#test').jecPref('blinkingCursor', []);
		jqUnit.equals($('#test').jecPref('blinkingCursor'), true, 'Set preference (array)');
		$('#test').jecPref('blinkingCursor', 1);
		jqUnit.equals($('#test').jecPref('blinkingCursor'), true, 'Set preference (int)');
		$('#test').jecPref('blinkingCursor', 1.2);
		jqUnit.equals($('#test').jecPref('blinkingCursor'), true, 'Set preference (float)');
		$('#test').jecPref('blinkingCursor', undefined);
		jqUnit.equals($('#test').jecPref('blinkingCursor'), true, 'Set preference (undefined)');
		$('#test').jecPref('blinkingCursor', null);
		jqUnit.equals($('#test').jecPref('blinkingCursor'), true, 'Set preference (null)');
		$('#test').jecPref('blinkingCursor', $);
		jqUnit.equals($('#test').jecPref('blinkingCursor'), true, 'Set preference (function)');
		reset($('#test'));
	});

	jqUnit.test('Setting preference: blinkingCursorInterval', function () {
		jqUnit.expect(9);

		$('#test').jec();
		$('#test').jecPref('blinkingCursorInterval', 1);
		jqUnit.equals($('#test').jecPref('blinkingCursorInterval'), 1, 'Set preference (int)');
		$('#test').jecPref('blinkingCursorInterval', 1.2);
		jqUnit.equals($('#test').jecPref('blinkingCursorInterval'), 1, 'Set preference (float)');
		$('#test').jecPref('blinkingCursorInterval', '2');
		jqUnit.equals($('#test').jecPref('blinkingCursorInterval'), 1, 'Set preference (string)');
		$('#test').jecPref('blinkingCursorInterval', {});
		jqUnit.equals($('#test').jecPref('blinkingCursorInterval'), 1, 'Set preference (object)');
		$('#test').jecPref('blinkingCursorInterval', []);
		jqUnit.equals($('#test').jecPref('blinkingCursorInterval'), 1, 'Set preference (array)');
		$('#test').jecPref('blinkingCursorInterval', false);
		jqUnit.equals($('#test').jecPref('blinkingCursorInterval'), 1, 'Set preference (boolean)');
		$('#test').jecPref('blinkingCursorInterval', undefined);
		jqUnit.equals($('#test').jecPref('blinkingCursorInterval'), 1, 'Set preference (undefined)');
		$('#test').jecPref('blinkingCursorInterval', null);
		jqUnit.equals($('#test').jecPref('blinkingCursorInterval'), 1, 'Set preference (null)');
		$('#test').jecPref('blinkingCursorInterval', $);
		jqUnit.equals($('#test').jecPref('blinkingCursorInterval'), 1, 'Set preference (function)');
		reset($('#test'));
	});

	jqUnit.test('Setting preference: ignoredKeys', function () {
		jqUnit.expect(9);

		var range, parsedRange = [10, 11, 12, 13, 14, 15, 35, 55];
		range = [
			{ min: 10, max: 15 }, // (min, max) tuple
			35, 55 // number values
		];

		$('#test').jec();
		$('#test').jecPref('ignoredKeys', range);
		jqUnit.isSet($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (array)');
		$('#test').jecPref('ignoredKeys', true);
		jqUnit.isSet($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (boolean)');
		$('#test').jecPref('ignoredKeys', '');
		jqUnit.isSet($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (string)');
		$('#test').jecPref('ignoredKeys', {});
		jqUnit.isSet($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (object)');
		$('#test').jecPref('ignoredKeys', 1);
		jqUnit.isSet($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (int)');
		$('#test').jecPref('ignoredKeys', 1.2);
		jqUnit.isSet($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (float)');
		$('#test').jecPref('ignoredKeys', undefined);
		jqUnit.isSet($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (undefined)');
		$('#test').jecPref('ignoredKeys', null);
		jqUnit.isSet($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (null)');
		$('#test').jecPref('ignoredKeys', $);
		jqUnit.isSet($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (function)');
		reset($('#test'));
	});

	jqUnit.test('Setting preference: acceptedKeys', function () {
		jqUnit.expect(9);

		var range, parsedRange = [10, 11, 12, 13, 14, 15, 35, 55];
		range = [
			{ min: 10, max: 15 }, // (min, max) tuple
			35, 55 // number values
		];

		$('#test').jec();
		$('#test').jecPref('acceptedKeys', range);
		jqUnit.isSet($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (array)');
		$('#test').jecPref('acceptedKeys', true);
		jqUnit.isSet($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (boolean)');
		$('#test').jecPref('acceptedKeys', '');
		jqUnit.isSet($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (string)');
		$('#test').jecPref('acceptedKeys', {});
		jqUnit.isSet($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (object)');
		$('#test').jecPref('acceptedKeys', 1);
		jqUnit.isSet($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (int)');
		$('#test').jecPref('acceptedKeys', 1.2);
		jqUnit.isSet($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (float)');
		$('#test').jecPref('acceptedKeys', undefined);
		jqUnit.isSet($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (undefined)');
		$('#test').jecPref('acceptedKeys', null);
		jqUnit.isSet($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (null)');
		$('#test').jecPref('acceptedKeys', $);
		jqUnit.isSet($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (function)');
		reset($('#test'));
	});
    
    $('#test').hide();
    $('#gtest').hide();
});