/*global $,document,module,test,ok,same*/
$(document).ready(function () {
	// hack for html validator (ol cannot be empty
	$('li').remove();
	
	var defaults, range, parsedRange, styleEmpty;
	
	defaults = {
		position: 0,
		classes: [],
		styles: {},
		optionClasses: [],
		optionStyles: {},
		useExistingOptions: false,
		ignoredKeys: [],
		acceptedKeys: [
			{min: 32, max: 126},
			{min: 191, max: 382}
		]
	};
	
	range = [
		{min: 10, max: 15}, // min,max tuple
		{exact: 35}, // exact value
		55 // number value
	];
	
	parsedRange = [10, 11, 12, 13, 14, 15, 35, 55];
	
	styleEmpty = function (value) {
		return value === 'auto' || value === '0px' || value === 'intrinsic';
	};
	
	module('init');
	test('Editable combobox initialization', function () {
		$('#test').jec();
		ok($('#test option.jecEditableOption').length === 1, 
            'We expect new editable option element to be created');
		$('#test').jecKill();
	});
	
	test('Option: position', function () {
		$('#test').jec({position: 0});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            'We expect new editable option element to be on first position');
		$('#test').jecKill();
		
		$('#test').jec({position: 1});
		ok($('#test').children('option').eq(1).filter('.jecEditableOption').length === 1, 
            'We expect new editable option element to be on second position');
		$('#test').jecKill();
		
		$('#test').jec({position: 3});
		ok($('#test').children('option').eq(3).filter('.jecEditableOption').length === 1, 
            'We expect new editable option element to be on last position');
		$('#test').jecKill();
		
		$('#test').jec({position: 100});
		ok($('#test').children('option:last').filter('.jecEditableOption').length === 1, 
            'We expect new editable option element to be on last position (value too big)');
		$('#test').jecKill();
		
		$('#test').jec({position: 4.2});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            'We expect malformed position option to be ignored (float)');
		$('#test').jecKill();
		
		$('#test').jec({position: '1'});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            'We expect malformed position option to be ignored (string)');
		$('#test').jecKill();
		
		$('#test').jec({position: true});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            'We expect malformed position option to be ignored (boolean)');
		$('#test').jecKill();
		
		$('#test').jec({position: null});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            'We expect malformed position option to be ignored (null)');
		$('#test').jecKill();
		
		$('#test').jec({position: undefined});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            'We expect malformed position option to be ignored (undefined)');
		$('#test').jecKill();
		
		$('#test').jec({position: {pos: 1}});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            'We expect malformed position option to be ignored (object)');
		$('#test').jecKill();
		
		$('#test').jec({position: [1]});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            'We expect malformed position option to be ignored (array)');
		$('#test').jecKill();
	});
	
	test('Option: classes', function () {
		var idRegex = /jec\d+/, className = 'c12', otherClassName = 'c2';
		$('#test').jec({classes: ''});
		ok(idRegex.test($('#test').attr('class')), 
            'We expect new editable option to have no extra classes');
		$('#test').jecKill();
		
		$('#test').jec({classes: className});
		ok($('#test').hasClass(className), 
            'We expect new editable option to have one extra class (string)');
		$('#test').jecKill();
		
		$('#test').jec({classes: className + ' ' + otherClassName});
		ok($('#test').hasClass(className) && $('#test').hasClass(otherClassName), 
            'We expect new editable option to have several extra classes (string)');
		$('#test').jecKill();
		
		$('#test').jec({classes: []});
		ok(idRegex.test($('#test').attr('class')), 
            'We expect new editable option to have no extra classes (array)');
		$('#test').jecKill();
		
		$('#test').jec({classes: [className]});
		ok($('#test').hasClass(className), 
            'We expect new editable option to have one extra class (array)');
		$('#test').jecKill();
		
		$('#test').jec({classes: [className, otherClassName]});
		ok($('#test').hasClass(className) && $('#test').hasClass(otherClassName), 
            'We expect new editable option to have several extra classes (array)');
		$('#test').jecKill();
		
		$('#test').jec({classes: 10});
		ok(idRegex.test($('#test').attr('class')), 
            'We expect malformed classes option to be ignored (number)');
		$('#test').jecKill();
		
		$('#test').jec({classes: true});
		ok(idRegex.test($('#test').attr('class')), 
            'We expect malformed classes option to be ignored (boolean)');
		$('#test').jecKill();
		
		$('#test').jec({classes: null});
		ok(idRegex.test($('#test').attr('class')), 
            'We expect malformed classes option to be ignored (null)');
		$('#test').jecKill();
		
		$('#test').jec({classes: undefined});
		ok(idRegex.test($('#test').attr('class')), 
            'We expect malformed classes option to be ignored (undefined)');
		$('#test').jecKill();
		
		$('#test').jec({classes: {cl: className}});
		ok(idRegex.test($('#test').attr('class')), 
            'We expect malformed classes option to be ignored (object)');
		$('#test').jecKill();
	});
	
	test('Option: optionClasses', function () {
		var defaultClassName = 'jecEditableOption', className = 'c1', otherClassName = 'c2';
		$('#test').jec({optionClasses: ''});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            'We expect new editable option to have no extra classes');
		$('#test').jecKill();
		
		className = 'myClass';
		$('#test').jec({optionClasses: className});
		ok($('#test').children('option.jecEditableOption').hasClass(className), 
            'We expect new editable option to have one extra class (string)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: className + ' ' + otherClassName});
		ok($('#test').children('option.jecEditableOption').hasClass(className) && 
            $('#test').children('option.jecEditableOption').hasClass(otherClassName), 
            'We expect new editable option to have several extra classes (string)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: []});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            'We expect new editable option to have no extra classes (array)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: [className]});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName) && 
            $('#test').children('option.jecEditableOption').hasClass(className), 
            'We expect new editable option to have one extra class (array)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: [className, otherClassName]});
		ok($('#test').children('option.jecEditableOption').hasClass(className) && 
            $('#test').children('option.jecEditableOption').hasClass(otherClassName), 
            'We expect new editable option to have several extra classes (array)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: 10});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            'We expect malformed classes option to be ignored (number)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: true});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            'We expect malformed classes option to be ignored (boolean)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: null});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            'We expect malformed classes option to be ignored (null)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: undefined});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            'We expect malformed classes option to be ignored (undefined)');
		$('#test').jecKill();
		
		$('#test').jec({optionClasses: {cl: className}});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            'We expect malformed classes option to be ignored (object)');
		$('#test').jecKill();
	});
	
	test('Option: styles', function () {
		var styleName = 'width', styleValue = '100px', otherStyleName = 'height', 
			otherStyleValue = '200px', obj = {};
		
		$('#test').jec({styles: obj});
		ok(styleEmpty($('#test').css(styleName)),
            'We expect new editable option to have no extra styles');
		$('#test').jecKill();
		
		obj[styleName] = styleValue;
		$('#test').jec({styles: obj});
		ok($('#test').css(styleName) === styleValue, 
            'We expect new editable option to have one extra style');
		$('#test').jecKill();
		
		obj[otherStyleName] = otherStyleValue;
		$('#test').jec({styles: obj});
		ok($('#test').css(styleName) === styleValue && 
            $('#test').css(otherStyleName) === otherStyleValue,
             'We expect new editable option to have several extra styles');
		$('#test').jecKill();
		
		$('#test').jec({styles: 'width: 100px'});
		ok(styleEmpty($('#test').css(styleName)),
			'We expect malformed styles option to be ignored (string)');
		$('#test').jecKill();
		
		$('#test').jec({styles: 10});
		ok(styleEmpty($('#test').css(styleName)),
            'We expect malformed styles option to be ignored (number)');
		$('#test').jecKill();
		
		$('#test').jec({styles: true});
		ok(styleEmpty($('#test').css(styleName)),
            'We expect malformed styles option to be ignored (boolean)');
		$('#test').jecKill();
		
		$('#test').jec({styles: null});
		ok(styleEmpty($('#test').css(styleName)),
            'We expect malformed styles option to be ignored (null)');
		$('#test').jecKill();
		
		$('#test').jec({styles: undefined});
		ok(styleEmpty($('#test').css(styleName)),
            'We expect malformed styles option to be ignored (undefined)');
		$('#test').jecKill();
		
		$('#test').jec({styles: [{styles: obj}]});
		ok(styleEmpty($('#test').css(styleName)),
            'We expect malformed styles option to be ignored (array)');
		$('#test').jecKill();
	});
	
	test('Option: optionStyles', function () {
		var styleName = 'width', styleValue = '100px', otherStyleName = 'height', 
			otherStyleValue = '200px', obj = {};
		
		$('#test').jec({optionStyles: obj});
		ok(styleEmpty($('#test').children('option.jecEditableOption').css(styleName)), 
            'We expect new editable option to have no extra styles');
		$('#test').jecKill();
		
		obj[styleName] = styleValue;
		$('#test').jec({optionStyles: obj});
		ok($('#test').children('option.jecEditableOption').css(styleName) === styleValue, 
            'We expect new editable option to have one extra style');
		$('#test').jecKill();
		
		obj[otherStyleName] = otherStyleValue;
		$('#test').jec({optionStyles: obj});
		ok($('#test').children('option.jecEditableOption').css(styleName) === styleValue && 
            $('#test').children('option.jecEditableOption').css(otherStyleName) === otherStyleValue,
             'We expect new editable option to have several extra styles');
		$('#test').jecKill();
		
		$('#test').jec({optionStyles: 'width: 100px'});
		ok(styleEmpty($('#test').children('option.jecEditableOption').css(styleName)),
			'We expect malformed styles option to be ignored (string)');
		$('#test').jecKill();
		
		$('#test').jec({optionStyles: 10});
		ok(styleEmpty($('#test').children('option.jecEditableOption').css(styleName)),
            'We expect malformed styles option to be ignored (number)');
		$('#test').jecKill();
		
		$('#test').jec({optionStyles: true});
		ok(styleEmpty($('#test').children('option.jecEditableOption').css(styleName)),
            'We expect malformed styles option to be ignored (boolean)');
		$('#test').jecKill();
		
		$('#test').jec({optionStyles: null});
		ok(styleEmpty($('#test').children('option.jecEditableOption').css(styleName)),
            'We expect malformed styles option to be ignored (null)');
		$('#test').jecKill();
		
		$('#test').jec({optionStyles: undefined});
		ok(styleEmpty($('#test').children('option.jecEditableOption').css(styleName)),
            'We expect malformed styles option to be ignored (undefined)');
		$('#test').jecKill();
		
		$('#test').jec({optionStyles: [{styles: obj}]});
		ok(styleEmpty($('#test').children('option.jecEditableOption').css(styleName)),
            'We expect malformed styles option to be ignored (array)');
		$('#test').jecKill();
	});
	
	test('Option: focusOnNewOption', function () {
		$('#test').jec({focusOnNewOption: false});
		ok($('#test option:first:not(:selected)').length === 1, 
            'We expect focus to be set on first option');
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: true});
		ok($('#test option:first:selected').length === 1, 
            'We expect focus to be moved to editable option');
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: '1'});
		ok($('#test option:first:not(:selected)').length === 1, 
            'We expect malformed focus option to be ignored (string)');
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: 1});
		ok($('#test option:first:not(:selected)').length === 1, 
            'We expect malformed focus option to be ignored (number)');
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: null});
		ok($('#test option:first:not(:selected)').length === 1, 
            'We expect malformed focus option to be ignored (null)');
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: undefined});
		ok($('#test option:first:not(:selected)').length === 1, 
            'We expect malformed focus option to be ignored (undefined)');
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: {focus: true}});
		ok($('#test option:first:not(:selected)').length === 1, 
            'We expect malformed focus option to be ignored (object)');
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: [true]});
		ok($('#test option:first:not(:selected)').length === 1, 
            'We expect malformed focus option to be ignored (array)');
		$('#test').jecKill();
	});
	
	test('Option: useExistingOptions', function () {
		// nothing to test here at the moment
	});
	
	test('Option: ignoredKeys', function () {
		// nothing to test here at the moment
	});
	test('Option: acceptedKeys', function () {
		// nothing to test here at the moment
	});
	
	module('disable');
	test('Editable combobox deactivation', function () {
		$('#test').jec();
		$('#test').jecOff();
		ok($('#test option').length === 3 && $('#test[class*=jec]').length === 1, 
            'We expect editable combobox to be disabled');
		$('#test').jecKill();
	});
	
	module('enable');
	test('Editable combobox activation', function () {
		$('#test').jec();
		$('#test').jecOff();
		$('#test').jecOn();
		ok($('#test option.jecEditableOption').length === 1, 
            'We expect editable combobox to be enabled');
		$('#test').jecKill();
	});
	
	module('kill');
	test('Editable combobox destruction', function () {
		$('#test').jec();
		$('#test').jecKill();
		ok($('#test option').length === 3 && $('#test').attr('jec') === undefined, 
            'We expect editable combobox to be destroyed');
	});
	
	module('value');
	test('Getting value', function () {
		var testValue = 'myTestValue';
		$('#test').jec();
		$('#test option.jecEditableOption').text(testValue).val(testValue);
		same($('#test').jecValue(), testValue, 
            'We expect value of ' + testValue + ' to be retrieved');
		$('#test').jecKill();
	});
	
	test('Setting value', function () {
		var strValue = 'myString', intValue = 123, floatValue = 1.2;
		
		$('#test').jec();
		$('#test').jecValue(strValue);
		same($('#test').jecValue(), strValue, 'We expect value of ' + strValue + ' to be set');
		
		$('#test').jecValue(floatValue);
		same($('#test').jecValue(), floatValue.toString(), 
            'We expect value of ' + floatValue + ' to be set');
		
		$('#test').jecValue(intValue);
		same($('#test').jecValue(), intValue.toString(), 
            'We expect value of ' + intValue + ' to be set');
		
		$('#test').jecValue({});
		same($('#test').jecValue(), intValue.toString(), 
            'We expect object value to be ignored and value of ' + intValue + ' be still set');
		
		$('#test').jecValue([]);
		same($('#test').jecValue(), intValue.toString(), 
            'We expect array value to be ignored and value of ' + intValue + ' be still set');
		
		$('#test').jecValue(null);
		same($('#test').jecValue(), intValue.toString(), 
            'We expect null value to be ignored and value of ' + intValue + ' be still set');
		
		$('#test').jecValue(undefined);
		same($('#test').jecValue(), intValue.toString(), 
            'We expect undefined value to be ignored and value of ' + intValue + ' be still set');
            
        $('#test').jecValue(true);
		same($('#test').jecValue(), intValue.toString(), 
            'We expect boolean value to be ignored and value of ' + intValue + ' be still set');
		
		$('#test').jecKill();
	});
	
	module('pref');
	test('Getting preference', function () {
		$('#test').jec();
		ok($('#test').jecPref() === undefined, 'We expect empty preference to return nothing');
		
		ok($('#test').jecPref(undefined) === undefined, 
			'We expect null preference to return nothing');
		
		ok($('#test').jecPref(null) === undefined, 'We expect null preference to return nothing');
		
		ok($('#test').jecPref([]) === undefined, 'We expect array preference to return nothing');
		
		ok($('#test').jecPref({}) === undefined, 'We expect object preference to return nothing');
		
		ok($('#test').jecPref(1) === undefined, 'We expect number preference to return nothing');
		
		ok($('#test').jecPref('dummy') === undefined, 
			'We expect not-existing string preference to return nothing');
		
		var i, j, key, keys = [], value;
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
						// exact tuple
						} else if (value[i] !== null && typeof value[i] === 'object' && 
							typeof value[i].exact === 'number') {
							keys[keys.length] = value[i].exact;
						// number
						} else if (typeof value[i] === 'number') {
							keys[keys.length] = value[i];
						}
					}
					same($('#test').jecPref('acceptedKeys'), keys, 'We expect ' + key + 
						' parameter value of ' + keys + ' to be returned');
				} else {
					same($('#test').jecPref(key), defaults[key], 'We expect ' + key + 
						' parameter value of ' + defaults[key] + ' to be returned');
				} 
			}
		}
		
		$('#test').jecKill();
	});
	
	test('Setting preference: position', function () {
		$('#test').jec();
		$('#test').jecPref('position', 1);
		same($('#test').jecPref('position'), 1, 'We expect preference to have value of 1');
		$('#test').jecPref('position', 1.2);
		ok($('#test').jecPref('position') === 1, 'We expect float preference value to be ignored');
		$('#test').jecPref('position', '2');
		ok($('#test').jecPref('position') === 1, 'We expect string preference value to be ignored');
		$('#test').jecPref('position', {});
		ok($('#test').jecPref('position') === 1, 'We expect object preference value to be ignored');
		$('#test').jecPref('position', []);
		ok($('#test').jecPref('position') === 1, 'We expect array preference value to be ignored');
		$('#test').jecPref('position', false);
		ok($('#test').jecPref('position') === 1, 
			'We expect boolean preference value to be ignored');
		$('#test').jecPref('position', undefined);
		ok($('#test').jecPref('position') === 1, 
			'We expect undefined preference value to be ignored');
		$('#test').jecPref('position', null);
		ok($('#test').jecPref('position') === 1, 
			'We expect null preference value to be ignored');
		$('#test').jecKill();
	});
	
	test('Setting preference: classes', function () {
		var className = 'myClass', classArr = [className];
		$('#test').jec();
		$('#test').jecPref('classes', classArr);
		same($('#test').jecPref('classes'), classArr, 
			'We expect array preference value to be handled');
		$('#test').jecPref('classes', className);
		same($('#test').jecPref('classes'), classArr, 
			'We expect string preference value to be handled');
		$('#test').jecPref('classes', 1);
		same($('#test').jecPref('classes'), classArr, 
			'We expect number preference value to be ignored');
		$('#test').jecPref('classes', {});
		same($('#test').jecPref('classes'), classArr, 
			'We expect object preference value to be ignored');
		$('#test').jecPref('classes', false);
		same($('#test').jecPref('classes'), classArr, 
			'We expect boolean preference value to be ignored');
		$('#test').jecPref('classes', undefined);
		same($('#test').jecPref('classes'), classArr, 
			'We expect undefined preference value to be ignored');
		$('#test').jecPref('classes', null);
		same($('#test').jecPref('classes'), classArr, 
			'We expect null preference value to be ignored');
		$('#test').jecKill();
	});
	
	test('Setting preference: styles', function () {
		var styles = {width: '100px', height: '200px'};
		$('#test').jec();
		$('#test').jecPref('styles', styles);
		same($('#test').jecPref('styles'), styles, 
			'We expect object preference value to be handled');
		$('#test').jecPref('styles', []);
		ok($('#test').jecPref('styles') === styles, 
			'We expect array preference value to be ignored');
		$('#test').jecPref('styles', 'width: 100px;');
		ok($('#test').jecPref('styles') === styles, 
			'We expect string preference value to be ignored');
		$('#test').jecPref('styles', 1);
		ok($('#test').jecPref('styles') === styles, 
			'We expect number preference value to be ignored');
		$('#test').jecPref('styles', false);
		ok($('#test').jecPref('styles') === styles, 
			'We expect boolean preference value to be ignored');
		$('#test').jecPref('styles', undefined);
		ok($('#test').jecPref('styles') === styles, 
			'We expect undefined preference value to be ignored');
		$('#test').jecPref('styles', null);
		ok($('#test').jecPref('styles') === styles, 
			'We expect null preference value to be ignored');
		$('#test').jecKill();
	});
	
	test('Setting preference: focusOnNewOption', function () {
		$('#test').jec();
		$('#test').jecPref('focusOnNewOption', true);
		same($('#test').jecPref('focusOnNewOption'), true, 
			'We expect boolean preference value to be handled');
		$('#test').jecPref('focusOnNewOption', 'true');
		ok($('#test').jecPref('focusOnNewOption') === true, 
			'We expect string preference value to be ignored');
		$('#test').jecPref('focusOnNewOption', {});
		ok($('#test').jecPref('focusOnNewOption') === true, 
			'We expect object preference value to be ignored');
		$('#test').jecPref('focusOnNewOption', []);
		ok($('#test').jecPref('focusOnNewOption') === true, 
			'We expect array preference value to be ignored');
		$('#test').jecPref('focusOnNewOption', 1);
		ok($('#test').jecPref('focusOnNewOption') === true, 
			'We expect number preference value to be ignored');
		$('#test').jecPref('focusOnNewOption', undefined);
		ok($('#test').jecPref('focusOnNewOption') === true, 
			'We expect undefined preference value to be ignored');
		$('#test').jecPref('focusOnNewOption', null);
		ok($('#test').jecPref('focusOnNewOption') === true, 
			'We expect null preference value to be ignored');
		$('#test').jecKill();
	});
	
	test('Setting preference: useExistingOptions', function () {
		$('#test').jec();
		$('#test').jecPref('useExistingOptions', true);
		same($('#test').jecPref('useExistingOptions'), true, 
			'We expect boolean preference value to be handled');
		$('#test').jecPref('useExistingOptions', 'true');
		ok($('#test').jecPref('useExistingOptions') === true, 
			'We expect string preference value to be ignored');
		$('#test').jecPref('useExistingOptions', {});
		ok($('#test').jecPref('useExistingOptions') === true, 
			'We expect object preference value to be ignored');
		$('#test').jecPref('useExistingOptions', []);
		ok($('#test').jecPref('useExistingOptions') === true, 
			'We expect array preference value to be ignored');
		$('#test').jecPref('useExistingOptions', 1);
		ok($('#test').jecPref('useExistingOptions') === true, 
			'We expect number preference value to be ignored');
		$('#test').jecPref('useExistingOptions', undefined);
		ok($('#test').jecPref('useExistingOptions') === true, 
			'We expect undefined preference value to be ignored');
		$('#test').jecPref('useExistingOptions', null);
		ok($('#test').jecPref('useExistingOptions') === true, 
			'We expect null preference value to be ignored');
		$('#test').jecKill();
	});
	
	test('Setting preference: ignoredKeys', function () {
		$('#test').jec();
		$('#test').jecPref('ignoredKeys', range);
		same($('#test').jecPref('ignoredKeys'), parsedRange, 
			'We expect array preference value to be handled');
		$('#test').jecPref('ignoredKeys', true);
		same($('#test').jecPref('ignoredKeys'), parsedRange, 
			'We expect boolean preference value to be ignored');
		$('#test').jecPref('ignoredKeys', 'true');
		same($('#test').jecPref('ignoredKeys'), parsedRange, 
			'We expect string preference value to be ignored');
		$('#test').jecPref('ignoredKeys', {});
		same($('#test').jecPref('ignoredKeys'), parsedRange, 
			'We expect object preference value to be ignored');
		$('#test').jecPref('ignoredKeys', 1);
		same($('#test').jecPref('ignoredKeys'), parsedRange, 
			'We expect number preference value to be range');
		$('#test').jecPref('ignoredKeys', undefined);
		same($('#test').jecPref('ignoredKeys'), parsedRange, 
			'We expect undefined preference value to be ignored');
		$('#test').jecPref('ignoredKeys', null);
		same($('#test').jecPref('ignoredKeys'), parsedRange, 
			'We expect null preference value to be ignored');
		$('#test').jecKill();
	});
	
	test('Setting preference: acceptedKeys', function () {
		$('#test').jec();
		$('#test').jecPref('acceptedKeys', range);
		same($('#test').jecPref('acceptedKeys'), parsedRange, 
			'We expect array preference value to be handled');
		$('#test').jecPref('acceptedKeys', true);
		same($('#test').jecPref('acceptedKeys'), parsedRange, 
			'We expect boolean preference value to be ignored');
		$('#test').jecPref('acceptedKeys', 'true');
		same($('#test').jecPref('acceptedKeys'), parsedRange, 
			'We expect string preference value to be ignored');
		$('#test').jecPref('acceptedKeys', {});
		same($('#test').jecPref('acceptedKeys'), parsedRange, 
			'We expect object preference value to be ignored');
		$('#test').jecPref('acceptedKeys', 1);
		same($('#test').jecPref('acceptedKeys'), parsedRange, 
			'We expect number preference value to be range');
		$('#test').jecPref('acceptedKeys', undefined);
		same($('#test').jecPref('acceptedKeys'), parsedRange, 
			'We expect undefined preference value to be ignored');
		$('#test').jecPref('acceptedKeys', null);
		same($('#test').jecPref('acceptedKeys'), parsedRange, 
			'We expect null preference value to be ignored');
		$('#test').jecKill();
	});
	
	$('#test').hide();
});