/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: true, onevar: true, 
plusplus: true, regexp: true, undef: true, white: true, indent: 4*/
/*global $, QUnit, String, document, expect, fireunit, module, ok, same, test*/
/*members acceptedKeys, attr, blinkingCursor, blinkingCursorInterval, children, classes, css, 
display, done, eq, filter, focus, focusOnNewOption, "font-size", hasClass, hide, ignoredKeys, 
jECTimer, jec, jecKill, jecOff, jecOn, jecPref, jecValue, k1, k2, k3, k4, length, log, max, min, 
ok, opt1, opt2, opt3, optionClasses, optionStyles, position, ready, remove, replace, styles, test, 
testDone, text, useExistingOptions, val*/
$(document).ready(function () {
	
	if (typeof fireunit === "object") {
        QUnit.log = fireunit.ok;
        QUnit.done = fireunit.testDone;
	}

	// hack for html validator (ol cannot be empty)
	$('li').remove();
	
	// disable timers in order not to hang up the browser
	$.jECTimer = null;
	
	var trim = function (str) {
		return str.replace(/(^\s+)|(\s+$)/, "");
	};
	
	module('init');
	test('Editable combobox initialization', function () {
		expect(1);
		
		$('#test').jec();
		ok($('#test option.jecEditableOption').length === 1, 
            'Create combobox without any preferences');
		$('#test').jecKill();
	});
	
	test('Setting: position', function () {
		expect(13);
		
		$('#test').jec({position: 0});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            'Editable option on first position');
		$('#test').jecKill();
		
		$('#test').jec({position: 1});
		ok($('#test').children('option').eq(1).filter('.jecEditableOption').length === 1, 
            'Editable option on second position');
		$('#test').jecKill();
		
		$('#test').jec({position: 3});
		ok($('#test').children('option').eq(3).filter('.jecEditableOption').length === 1, 
            'Editable option on last position');
		$('#test').jecKill();
		
		$('#test').jec({position: 100});
		ok($('#test').children('option:last').filter('.jecEditableOption').length === 1, 
            'Editable option on last position (value greater then number of options)');
		$('#test').jecKill();
		
		$('#test').jec({position: -1});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            'Editable option on first position (negative int)');
		$('#test').jecKill();
		
		$('#test').jec({position: 1.2});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            'Editable option on first position (float)');
		$('#test').jecKill();
		
		$('#test').jec({position: '1'});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            'Editable option on first position (string)');
		$('#test').jecKill();
		
		$('#test').jec({position: true});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            'Editable option on first position (boolean)');
		$('#test').jecKill();
		
		$('#test').jec({position: null});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            'Editable option on first position (null)');
		$('#test').jecKill();
		
		$('#test').jec({position: undefined});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            'Editable option on first position (undefined)');
		$('#test').jecKill();
		
		$('#test').jec({position: {}});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            'Editable option on first position (object)');
		$('#test').jecKill();
		
		$('#test').jec({position: []});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            'Editable option on first position (array)');
		$('#test').jecKill();
		
		$('#test').jec({position: $});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            'Editable option on first position (function)');
		$('#test').jecKill();
	});
	
	test('Setting: classes', function () {
		expect(13);
		
		var idRegex = /jec\d+/, c1 = 'class1', c2 = 'class2';
		
		$('#test').jec({classes: ''});
		ok(idRegex.test($('#test').attr('class')), 
            'No extra classes (string)');
		$('#test').jecKill();
		
		$('#test').jec({classes: c1});
		ok($('#test').hasClass(c1), 
            'One extra class (string)');
		$('#test').jecKill();
		
		$('#test').jec({classes: c1 + ' ' + c2});
		ok($('#test').hasClass(c1) && $('#test').hasClass(c2), 
            'Several extra classes (string)');
		$('#test').jecKill();
		
		$('#test').jec({classes: []});
		ok(idRegex.test($('#test').attr('class')), 
            'No extra classes (array)');
		$('#test').jecKill();
		
		$('#test').jec({classes: [c1]});
		ok($('#test').hasClass(c1), 
            'One extra class (array)');
		$('#test').jecKill();
		
		$('#test').jec({classes: [c1, c2]});
		ok($('#test').hasClass(c1) && $('#test').hasClass(c2), 
            'Several extra classes (array)');
		$('#test').jecKill();
		
		$('#test').jec({classes: 1});
		ok(idRegex.test($('#test').attr('class')), 
            'No extra classes (int)');
		$('#test').jecKill();
		
		$('#test').jec({classes: 1.2});
		ok(idRegex.test($('#test').attr('class')), 
            'No extra classes (float)');
		$('#test').jecKill();
		
		$('#test').jec({classes: true});
		ok(idRegex.test($('#test').attr('class')), 
            'No extra classes (boolean)');
		$('#test').jecKill();
		
		$('#test').jec({classes: null});
		ok(idRegex.test($('#test').attr('class')), 
            'No extra classes (null)');
		$('#test').jecKill();
		
		$('#test').jec({classes: undefined});
		ok(idRegex.test($('#test').attr('class')), 
            'No extra classes (undefined)');
		$('#test').jecKill();
		
		$('#test').jec({classes: {}});
		ok(idRegex.test($('#test').attr('class')), 
            'No extra classes (object)');
		$('#test').jecKill();
		
		$('#test').jec({classes: $});
		ok(idRegex.test($('#test').attr('class')), 
            'No extra classes (function)');
		$('#test').jecKill();
	});
	
	test('Setting: optionClasses', function () {
		expect(13);
		
		var c1 = 'c1', c2 = 'c2';
		
		$('#test').jec({optionClasses: ''});
		ok(trim($('#test').children('option.jecEditableOption').attr('class')) === 
			'jecEditableOption', 'No extra classes (string)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: c1});
		ok($('#test').children('option.jecEditableOption').hasClass(c1), 
            'One extra class (string)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: c1 + ' ' + c2});
		ok($('#test').children('option.jecEditableOption').hasClass(c1) && 
            $('#test').children('option.jecEditableOption').hasClass(c2), 
            'Several extra classes (string)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: []});
		ok(trim($('#test').children('option.jecEditableOption').attr('class')) === 
			'jecEditableOption', 'No extra classes (array)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: [c1]});
		ok($('#test').children('option.jecEditableOption').hasClass(c1), 
            'One extra class (array)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: [c1, c2]});
		ok($('#test').children('option.jecEditableOption').hasClass(c1) && 
            $('#test').children('option.jecEditableOption').hasClass(c2), 
             'Several extra classes (array)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: 1});
		ok(trim($('#test').children('option.jecEditableOption').attr('class')) === 
			'jecEditableOption', 'No extra classes (int)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: 1.2});
		ok(trim($('#test').children('option.jecEditableOption').attr('class')) === 
			'jecEditableOption', 'No extra classes (float)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: true});
		ok(trim($('#test').children('option.jecEditableOption').attr('class')) === 
			'jecEditableOption', 'No extra classes (boolean)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: null});
		ok(trim($('#test').children('option.jecEditableOption').attr('class')) === 
			'jecEditableOption', 'No extra classes (null)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: undefined});
		ok(trim($('#test').children('option.jecEditableOption').attr('class')) === 
			'jecEditableOption', 'No extra classes (undefined)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: {}});
		ok(trim($('#test').children('option.jecEditableOption').attr('class')) === 
			'jecEditableOption', 'No extra classes (object)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: $});
		ok(trim($('#test').children('option.jecEditableOption').attr('class')) === 
			'jecEditableOption', 'No extra classes (function)');
		$('#test').jecKill();
	});
	
	test('Setting: styles', function () {
		expect(12);
		
		var s1 = 'opacity', v1 = '0.5', s2 = 'font-size', v2 = '30px', obj = {};
		
		$('#test').jec({styles: obj});
		same($('#test').css(s1), '1', 'No extra styles');
		$('#test').jecKill();
		
		obj[s1] = v1;
		$('#test').jec({styles: obj});
		same($('#test').css(s1), v1, 'Opacity changed');
		$('#test').jecKill();
		
		obj[s2] = v2;
		$('#test').jec({styles: obj});
		same($('#test').css(s1), v1, 'Opacity and font-size changed, checking opacity');
        same($('#test').css(s2), v2, 'Opacity and font-size changed, checking font-size');
		$('#test').jecKill();
		
		$('#test').jec({styles: 'width: 100px'});
		same($('#test').css(s1), '1', 'No extra styles (string)');
		$('#test').jecKill();
		
		$('#test').jec({styles: 0});
		same($('#test').css(s1), '1', 'No extra styles (int)');
		$('#test').jecKill();
		
		$('#test').jec({styles: 0.5});
		same($('#test').css(s1), '1', 'No extra styles (float)');
		$('#test').jecKill();
		
		$('#test').jec({styles: true});
		same($('#test').css(s1), '1', 'No extra styles (boolean)');
		$('#test').jecKill();
		
		$('#test').jec({styles: null});
		same($('#test').css(s1), '1', 'No extra styles (null)');
		$('#test').jecKill();
		
		$('#test').jec({styles: undefined});
		same($('#test').css(s1), '1', 'No extra styles (undefined)');
		$('#test').jecKill();
		
		$('#test').jec({styles: []});
		same($('#test').css(s1), '1', 'No extra styles (array)');
		$('#test').jecKill();
		
		$('#test').jec({styles: $});
		same($('#test').css(s1), '1', 'No extra styles (function)');
		$('#test').jecKill();
	});
	
	test('Setting: optionStyles', function () {
		expect(12);
		
		var s1 = 'opacity', v1 = '0.5', s2 = 'font-size', v2 = '30px', obj = {};
		
		$('#test').jec({optionStyles: obj});
		same($('#test option.jecEditableOption').css(s1), '1', 'No extra styles');
		$('#test').jecKill();
		
		obj[s1] = v1;
		$('#test').jec({optionStyles: obj});
		same($('#test option.jecEditableOption').css(s1), v1, 'Opacity changed');
		$('#test').jecKill();
		
		obj[s2] = v2;
		$('#test').jec({optionStyles: obj});
		same($('#test option.jecEditableOption').css(s1), v1, 
			'Opacity and font-size changed, checking opacity');
        same($('#test option.jecEditableOption').css(s2), v2, 
			'Opacity and font-size changed, checking font-size');
		$('#test').jecKill();
		
		$('#test').jec({styles: 'width: 100px'});
		same($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (string)');
		$('#test').jecKill();
		
		$('#test').jec({optionStyles: 0});
		same($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (int)');
		$('#test').jecKill();
		
		$('#test').jec({optionStyles: 0.5});
		same($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (float)');
		$('#test').jecKill();
		
		$('#test').jec({optionStyles: true});
		same($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (boolean)');
		$('#test').jecKill();
		
		$('#test').jec({optionStyles: null});
		same($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (null)');
		$('#test').jecKill();
		
		$('#test').jec({optionStyles: undefined});
		same($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (undefined)');
		$('#test').jecKill();
		
		$('#test').jec({optionStyles: []});
		same($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (array)');
		$('#test').jecKill();
		
		$('#test').jec({optionStyles: $});
		same($('#test option.jecEditableOption').css(s1), '1', 'No extra styles (function)');
		$('#test').jecKill();
	});
	
	test('Setting: focusOnNewOption', function () {
		expect(9);
		
		$('#test').jec({focusOnNewOption: false});
		ok($('#test option:first:not(:selected)').length === 1, 'Focus on first option');
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: true});
		ok($('#test option:first:selected').length === 1, 
            'We expect focus to be moved to editable option');
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: '1'});
		ok($('#test option:first:not(:selected)').length === 1, 'Focus on first option (string)');
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: 1});
		ok($('#test option:first:not(:selected)').length === 1, 'Focus on first option (int)');
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: 1.2});
		ok($('#test option:first:not(:selected)').length === 1, 'Focus on first option (float)');
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: null});
		ok($('#test option:first:not(:selected)').length === 1, 'Focus on first option (null)');
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: undefined});
		ok($('#test option:first:not(:selected)').length === 1, 
			'Focus on first option (undefined)');
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: {focus: true}});
		ok($('#test option:first:not(:selected)').length === 1, 'Focus on first option (object)');
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: [true]});
		ok($('#test option:first:not(:selected)').length === 1, 'Focus on first option (array)');
		$('#test').jecKill();
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
		// nothing to test here at the moment
		expect(0);
	});
	
	test('Setting: ignoredKeys', function () {
		// nothing to test here at the moment
		expect(0);
	});
	test('Setting: acceptedKeys', function () {
		// nothing to test here at the moment
		expect(0);
	});
	
	module('initJS');
	test('Editable combobox initialization', function () {
		expect(1);
		
		var combobox = $.jec();
		ok(combobox.children('option.jecEditableOption').length === 1, 
            'Create pure JS combobox without any preferences');
		combobox.jecKill();
	});
	
	test('Options', function () {
		expect(23);
		
		var op = [1, 1.2, 'v1', {k1: 'v1'}, {k2: 1, k3: 1.2, k4: 'v4'}, [], undefined, null, true],
			combobox = $.jec(op);
		
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
		combobox.jecKill();
		
		combobox = $.jec(undefined);
		ok(combobox.children('option.jecEditableOption').length === 1, 
			'Combobox created (undefined)');
		combobox.jecKill();
		
		combobox = $.jec(null);
		ok(combobox.children('option.jecEditableOption').length === 1, 'Combobox created (null)');
		combobox.jecKill();
		
		combobox = $.jec('1');
		ok(combobox.children('option.jecEditableOption').length === 1, 
			'Combobox created (string)');
		combobox.jecKill();
		
		combobox = $.jec(1);
		ok(combobox.children('option.jecEditableOption').length === 1, 'Combobox created (int)');
		combobox.jecKill();
		
		combobox = $.jec(1.2);
		ok(combobox.children('option.jecEditableOption').length === 1, 'Combobox created (float)');
		combobox.jecKill();
		
		combobox = $.jec(true);
		ok(combobox.children('option.jecEditableOption').length === 1, 
			'Combobox created (boolean)');
		combobox.jecKill();
		
		combobox = $.jec({});
		ok(combobox.children('option.jecEditableOption').length === 1, 
			'Combobox created (boolean)');
		combobox.jecKill();
	});
	
	test('Setting: position', function () {
		expect(13);
		
		var cbOptions = [{opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],	
			combobox = $.jec(cbOptions, {position: 0});
		
		ok(combobox.children('option:first.jecEditableOption').length === 1, 
            'Editable option on first position');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {position: 1});
		ok(combobox.children('option').eq(1).filter('.jecEditableOption').length === 1, 
            'Editable option on second position');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {position: 3});
		ok(combobox.children('option').eq(3).filter('.jecEditableOption').length === 1, 
            'Editable option on last position');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {position: 100});
		ok(combobox.children('option:last').filter('.jecEditableOption').length === 1, 
            'Editable option on last position (value greater then number of options)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {position: -1});
		ok(combobox.children('option:first.jecEditableOption').length === 1, 
            'Editable option on first position (negative int)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {position: 1.2});
		ok(combobox.children('option:first.jecEditableOption').length === 1, 
            'Editable option on first position (float)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {position: '1'});
		ok(combobox.children('option:first.jecEditableOption').length === 1, 
            'Editable option on first position (string)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {position: true});
		ok(combobox.children('option:first.jecEditableOption').length === 1, 
            'Editable option on first position (boolean)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {position: null});
		ok(combobox.children('option:first.jecEditableOption').length === 1, 
            'Editable option on first position (null)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {position: undefined});
		ok(combobox.children('option:first.jecEditableOption').length === 1, 
            'Editable option on first position (undefined)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {position: {}});
		ok(combobox.children('option:first.jecEditableOption').length === 1, 
            'Editable option on first position (object)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {position: []});
		ok(combobox.children('option:first.jecEditableOption').length === 1, 
            'Editable option on first position (array)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {position: $});
		ok(combobox.children('option:first.jecEditableOption').length === 1, 
            'Editable option on first position (function)');
		combobox.jecKill();
	});
	
	test('Setting: classes', function () {
		expect(13);
		
		var idRegex = /jec\d+/, c1 = 'class1', c2 = 'class2', 
			cbOptions = [{opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
			combobox = $.jec(cbOptions, {classes: ''});
		
		ok(idRegex.test(combobox.attr('class')), 
            'No extra classes (string)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {classes: c1});
		ok(combobox.hasClass(c1), 
            'One extra class (string)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {classes: c1 + ' ' + c2});
		ok(combobox.hasClass(c1) && combobox.hasClass(c2), 
            'Several extra classes (string)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {classes: []});
		ok(idRegex.test(combobox.attr('class')), 
            'No extra classes (array)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {classes: [c1]});
		ok(combobox.hasClass(c1), 
            'One extra class (array)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {classes: [c1, c2]});
		ok(combobox.hasClass(c1) && combobox.hasClass(c2), 
            'Several extra classes (array)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {classes: 1});
		ok(idRegex.test(combobox.attr('class')), 
            'No extra classes (int)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {classes: 1.2});
		ok(idRegex.test(combobox.attr('class')), 
            'No extra classes (float)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {classes: true});
		ok(idRegex.test(combobox.attr('class')), 
            'No extra classes (boolean)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {classes: null});
		ok(idRegex.test(combobox.attr('class')), 
            'No extra classes (null)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {classes: undefined});
		ok(idRegex.test(combobox.attr('class')), 
            'No extra classes (undefined)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {classes: {}});
		ok(idRegex.test(combobox.attr('class')), 
            'No extra classes (object)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {classes: $});
		ok(idRegex.test(combobox.attr('class')), 
            'No extra classes (function)');
		combobox.jecKill();
	});
	
	test('Setting: optionClasses', function () {
		expect(13);
		
		var c1 = 'c1', c2 = 'c2', cbOptions = [{opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
			combobox = $.jec(cbOptions, {optionClasses: ''});
		
		ok(trim(combobox.children('option.jecEditableOption').attr('class')) === 
			'jecEditableOption', 'No extra classes (string)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {optionClasses: c1});
		ok(combobox.children('option.jecEditableOption').hasClass(c1), 
            'One extra class (string)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {optionClasses: c1 + ' ' + c2});
		ok(combobox.children('option.jecEditableOption').hasClass(c1) && 
            combobox.children('option.jecEditableOption').hasClass(c2), 
            'Several extra classes (string)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {optionClasses: []});
		ok(trim(combobox.children('option.jecEditableOption').attr('class')) === 
			'jecEditableOption', 'No extra classes (array)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {optionClasses: [c1]});
		ok(combobox.children('option.jecEditableOption').hasClass(c1), 
            'One extra class (array)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {optionClasses: [c1, c2]});
		ok(combobox.children('option.jecEditableOption').hasClass(c1) && 
            combobox.children('option.jecEditableOption').hasClass(c2), 
             'Several extra classes (array)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {optionClasses: 1});
		ok(trim(combobox.children('option.jecEditableOption').attr('class')) === 
			'jecEditableOption', 'No extra classes (int)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {optionClasses: 1.2});
		ok(trim(combobox.children('option.jecEditableOption').attr('class')) === 
			'jecEditableOption', 'No extra classes (float)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {optionClasses: true});
		ok(trim(combobox.children('option.jecEditableOption').attr('class')) === 
			'jecEditableOption', 'No extra classes (boolean)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {optionClasses: null});
		ok(trim(combobox.children('option.jecEditableOption').attr('class')) === 
			'jecEditableOption', 'No extra classes (null)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {optionClasses: undefined});
		ok(trim(combobox.children('option.jecEditableOption').attr('class')) === 
			'jecEditableOption', 'No extra classes (undefined)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {optionClasses: {}});
		ok(trim(combobox.children('option.jecEditableOption').attr('class')) === 
			'jecEditableOption', 'No extra classes (object)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {optionClasses: $});
		ok(trim(combobox.children('option.jecEditableOption').attr('class')) === 
			'jecEditableOption', 'No extra classes (function)');
		combobox.jecKill();
	});
	
	test('Setting: styles', function () {
		expect(12);
		
		var s1 = 'opacity', v1 = '0.5', s2 = 'font-size', v2 = '30px', obj = {},
			cbOptions = [{opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
			combobox = $.jec(cbOptions, {styles: obj});
		
		same(combobox.css(s1), '1', 'No extra styles');
		combobox.jecKill();
		
		obj[s1] = v1;
		combobox = $.jec(cbOptions, {styles: obj});
		same(combobox.css(s1), v1, 'Opacity changed');
		combobox.jecKill();
		
		obj[s2] = v2;
		combobox = $.jec(cbOptions, {styles: obj});
		same(combobox.css(s1), v1, 'Opacity and font-size changed, checking opacity');
        same(combobox.css(s2), v2, 'Opacity and font-size changed, checking font-size');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {styles: 'width: 100px'});
		same(combobox.css(s1), '1', 'No extra styles (string)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {styles: 0});
		same(combobox.css(s1), '1', 'No extra styles (int)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {styles: 0.5});
		same(combobox.css(s1), '1', 'No extra styles (float)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {styles: true});
		same(combobox.css(s1), '1', 'No extra styles (boolean)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {styles: null});
		same(combobox.css(s1), '1', 'No extra styles (null)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {styles: undefined});
		same(combobox.css(s1), '1', 'No extra styles (undefined)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {styles: []});
		same(combobox.css(s1), '1', 'No extra styles (array)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {styles: $});
		same(combobox.css(s1), '1', 'No extra styles (function)');
		combobox.jecKill();
	});
	
	test('Setting: optionStyles', function () {
		expect(12);
		
		var s1 = 'opacity', v1 = '0.5', s2 = 'font-size', v2 = '30px', obj = {},
			cbOptions = [{opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
			combobox = $.jec(cbOptions, {optionStyles: obj});
		
		same(combobox.children('option.jecEditableOption').css(s1), '1', 'No extra styles');
		combobox.jecKill();
		
		obj[s1] = v1;
		combobox = $.jec(cbOptions, {optionStyles: obj});
		same(combobox.children('option.jecEditableOption').css(s1), v1, 'Opacity changed');
		combobox.jecKill();
		
		obj[s2] = v2;
		combobox = $.jec(cbOptions, {optionStyles: obj});
		same(combobox.children('option.jecEditableOption').css(s1), v1, 
			'Opacity and font-size changed, checking opacity');
        same(combobox.children('option.jecEditableOption').css(s2), v2, 
			'Opacity and font-size changed, checking font-size');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {styles: 'width: 100px'});
		same(combobox.children('option.jecEditableOption').css(s1), '1', 'No extra styles (string)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {optionStyles: 0});
		same(combobox.children('option.jecEditableOption').css(s1), '1', 'No extra styles (int)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {optionStyles: 0.5});
		same(combobox.children('option.jecEditableOption').css(s1), '1', 'No extra styles (float)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {optionStyles: true});
		same(combobox.children('option.jecEditableOption').css(s1), '1', 'No extra styles (boolean)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {optionStyles: null});
		same(combobox.children('option.jecEditableOption').css(s1), '1', 'No extra styles (null)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {optionStyles: undefined});
		same(combobox.children('option.jecEditableOption').css(s1), '1', 'No extra styles (undefined)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {optionStyles: []});
		same(combobox.children('option.jecEditableOption').css(s1), '1', 'No extra styles (array)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {optionStyles: $});
		same(combobox.children('option.jecEditableOption').css(s1), '1', 'No extra styles (function)');
		combobox.jecKill();
	});
	
	test('Setting: focusOnNewOption', function () {
		expect(9);
		
		var cbOptions = [{opt1: 'opt1', opt2: 'opt2', opt3: 'opt3'}],
			combobox = $.jec(cbOptions, {focusOnNewOption: false});
		
		ok(combobox.children('option:first:not(:selected)').length === 1, 'Focus on first option');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {focusOnNewOption: true});
		ok(combobox.children('option:first:selected').length === 1, 
            'We expect focus to be moved to editable option');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {focusOnNewOption: '1'});
		ok(combobox.children('option:first:not(:selected)').length === 1, 'Focus on first option (string)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {focusOnNewOption: 1});
		ok(combobox.children('option:first:not(:selected)').length === 1, 'Focus on first option (int)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {focusOnNewOption: 1.2});
		ok(combobox.children('option:first:not(:selected)').length === 1, 'Focus on first option (float)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {focusOnNewOption: null});
		ok(combobox.children('option:first:not(:selected)').length === 1, 'Focus on first option (null)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {focusOnNewOption: undefined});
		ok(combobox.children('option:first:not(:selected)').length === 1, 
			'Focus on first option (undefined)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {focusOnNewOption: {focus: true}});
		ok(combobox.children('option:first:not(:selected)').length === 1, 'Focus on first option (object)');
		combobox.jecKill();
		
		combobox = $.jec(cbOptions, {focusOnNewOption: [true]});
		ok(combobox.children('option:first:not(:selected)').length === 1, 'Focus on first option (array)');
		combobox.jecKill();
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
		// nothing to test here at the moment
		expect(0);
	});
	
	test('Setting: ignoredKeys', function () {
		// nothing to test here at the moment
		expect(0);
	});
	test('Setting: acceptedKeys', function () {
		// nothing to test here at the moment
		expect(0);
	});
	
	module('disable');
	test('Editable combobox deactivation', function () {
		expect(2);
		
		$('#test').jec();
		$('#test').jecOff();
		ok($('#test option').length === 3, 'Check if editable option was removed');
        ok($('#test[class*=jec]').length === 1, 'Check if id is still present');
		$('#test').jecKill();
	});
	
	module('enable');
	test('Editable combobox activation', function () {
		expect(1);
		
		$('#test').jec();
		$('#test').jecOff();
		$('#test').jecOn();
		ok($('#test option.jecEditableOption').length === 1, 'Check if editable option was added');
		$('#test').jecKill();
	});
	
	module('kill');
	test('Editable combobox destruction', function () {
		expect(2);
		
		$('#test').jec();
		$('#test').jecKill();
		ok($('#test option').length === 3, 'Check if editable option was removed');
        ok($('#test[class*=jec]').length === 0, 'Check if id was removed');
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
		$('#test').jecKill();
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
		$('#test').jecKill();
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
		
		var i, j, key, keys = [], value, defaults;
		defaults = {
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
				{min: 32, max: 126},
				{min: 191, max: 382}
			]
		};
		
		for (key in defaults) {
			if (defaults[key] !== undefined) {
				if (key === 'acceptedKeys') {
					value = defaults.acceptedKeys;
					for (i = 0; i < value.length; i += 1) {
						// min,max tuple
						if (value[i] !== null && typeof value[i] === 'object' && 
							typeof value[i].min === 'number' && 
							typeof value[i].max === 'number' && value[i].min <= value[i].max) {
							for (j = value[i].min; j <= value[i].max; j += 1) {
								keys[keys.length] = j;
							}
						// number
						} else if (typeof value[i] === 'number') {
							keys[keys.length] = value[i];
						}
					}
					same($('#test').jecPref('acceptedKeys'), keys, 'Get ' + key + ' value');
				} else {
					same($('#test').jecPref(key), defaults[key], 'Get ' + key + ' value');
				} 
			}
		}
		
		$('#test').jecKill();
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
		$('#test').jecKill();
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
		$('#test').jecKill();
	});
	
	test('Setting preference: styles', function () {
		expect(9);
		
		var styles = {display: 'none', 'font-size': '30px'};
		
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
		$('#test').jecKill();
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
		$('#test').jecKill();
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
		$('#test').jecKill();
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
		$('#test').jecKill();
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
		$('#test').jecKill();
	});
	
	test('Setting preference: ignoredKeys', function () {
		expect(9);
		
		var range, parsedRange = [10, 11, 12, 13, 14, 15, 35, 55];
		range = [
			{min: 10, max: 15}, // (min, max) tuple
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
		$('#test').jecKill();
	});
	
	test('Setting preference: acceptedKeys', function () {
		expect(9);
		
		var range, parsedRange = [10, 11, 12, 13, 14, 15, 35, 55];
		range = [
			{min: 10, max: 15}, // (min, max) tuple
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
		$('#test').jecKill();
	});
	
	$('#test').hide();
});