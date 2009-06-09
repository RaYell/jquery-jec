/*global $,document,module,test,ok,same*/
$(document).ready(function () {
	// hack for html validator (ol cannot be empty
	$('li').remove();
	
	var defaults = {
		position: 0,
		classes: '',
		styles: {},
		pluginClass: 'jecEditableOption',
		useExistingOptions: false,
		ignoredKeys: [],
		acceptedRanges: [
			{min: 32, max: 126},
			{min: 191, max: 382}
		]
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
	test('Option: pluginClass', function () {
		var className = 'myClass', defaultClassName = 'jecEditableOption';
		$('#test').jec({pluginClass: className});
		ok($('#test option.' + className).length === 1, 
            'We expect new editable option element to be created');
		$('#test').jecKill();
		
		$('#test').jec({pluginClass: 1});
		ok($('#test option.' + defaultClassName).length === 1, 
            'We expect malformed plugin class option to be ignored (number)');
		$('#test').jecKill();
		
		$('#test').jec({pluginClass: true});
		ok($('#test option.' + defaultClassName).length === 1, 
            'We expect malformed plugin class option to be ignored (boolean)');
		$('#test').jecKill();
		
		$('#test').jec({pluginClass: null});
		ok($('#test option.' + defaultClassName).length === 1, 
            'We expect malformed plugin class option to be ignored (null)');
		$('#test').jecKill();
		
		$('#test').jec({pluginClass: undefined});
		ok($('#test option.' + defaultClassName).length === 1, 
            'We expect malformed plugin class option to be ignored (undefined)');
		$('#test').jecKill();
		
		$('#test').jec({pluginClass: {classes: className}});
		ok($('#test option.' + defaultClassName).length === 1, 
            'We expect malformed plugin class option to be ignored (object)');
		$('#test').jecKill();
		
		$('#test').jec({pluginClass: [className]});
		ok($('#test option.' + defaultClassName).length === 1, 
            'We expect malformed plugin class option to be ignored (array)');
		$('#test').jecKill();
	});
	test('Option: classes', function () {
		var defaultClassName = 'jecEditableOption', className = 'c1', otherClassName = 'c2';
		$('#test').jec({classes: ''});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            'We expect new editable option to have no extra classes');
		$('#test').jecKill();
		
		className = 'myClass';
		$('#test').jec({classes: className});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            'We expect new editable option to have one extra class (string)');
		$('#test').jecKill();
		
		$('#test').jec({classes: className + ' ' + otherClassName});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName) && 
            $('#test').children('option.jecEditableOption').hasClass(className), 
            'We expect new editable option to have several extra classes (string)');
		$('#test').jecKill();
		
		$('#test').jec({classes: []});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            'We expect new editable option to have no extra classes (array)');
		$('#test').jecKill();
		
		$('#test').jec({classes: [className]});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName) && 
            $('#test').children('option.jecEditableOption').hasClass(className), 
            'We expect new editable option to have one extra class (array)');
		$('#test').jecKill();
		
		$('#test').jec({classes: [className, otherClassName]});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName) && 
            $('#test').children('option.jecEditableOption').hasClass(className) && 
            $('#test').children('option.jecEditableOption').hasClass(otherClassName), 
            'We expect new editable option to have several extra classes (array)');
		$('#test').jecKill();
		
		$('#test').jec({classes: 10});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            'We expect malformed classes option to be ignored (number)');
		$('#test').jecKill();
		
		$('#test').jec({classes: true});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            'We expect malformed classes option to be ignored (boolean)');
		$('#test').jecKill();
		
		$('#test').jec({classes: null});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            'We expect malformed classes option to be ignored (null)');
		$('#test').jecKill();
		
		$('#test').jec({classes: undefined});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            'We expect malformed classes option to be ignored (undefined)');
		$('#test').jecKill();
		
		$('#test').jec({classes: {cl: className}});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            'We expect malformed classes option to be ignored (object)');
		$('#test').jecKill();
	});
	test('Option: styles', function () {
		var styleName = 'width', styleValue = '100px', otherStyleName = 'height', otherStyleValue = '200px', obj = {};
		
		$('#test').jec({styles: obj});
		ok($('#test').children('option.jecEditableOption').css(styleName) === 'auto', 
            'We expect new editable option to have no extra styles');
		$('#test').jecKill();
		
		obj[styleName] = styleValue;
		$('#test').jec({styles: obj});
		ok($('#test').children('option.jecEditableOption').css(styleName) === styleValue, 
            'We expect new editable option to have one extra style');
		$('#test').jecKill();
		
		obj[otherStyleName] = otherStyleValue;
		$('#test').jec({styles: obj});
		ok($('#test').children('option.jecEditableOption').css(styleName) === styleValue && 
            $('#test').children('option.jecEditableOption').css(otherStyleName) === otherStyleValue,
             'We expect new editable option to have several extra styles');
		$('#test').jecKill();
		
		$('#test').jec({styles: 'width: 100px'});
		ok($('#test').children('option.jecEditableOption').attr('style') === undefined, 'We expect malformed styles option to be ignored (string)');
		$('#test').jecKill();
		
		$('#test').jec({styles: 10});
		ok($('#test').children('option.jecEditableOption').attr('style') === undefined, 
            'We expect malformed styles option to be ignored (number)');
		$('#test').jecKill();
		
		$('#test').jec({styles: true});
		ok($('#test').children('option.jecEditableOption').attr('style') === undefined, 
            'We expect malformed styles option to be ignored (boolean)');
		$('#test').jecKill();
		
		$('#test').jec({styles: null});
		ok($('#test').children('option.jecEditableOption').attr('style') === undefined, 
            'We expect malformed styles option to be ignored (null)');
		$('#test').jecKill();
		
		$('#test').jec({styles: undefined});
		ok($('#test').children('option.jecEditableOption').attr('style') === undefined, 
            'We expect malformed styles option to be ignored (undefined)');
		$('#test').jecKill();
		
		$('#test').jec({styles: [{styles: obj}]});
		ok($('#test').children('option.jecEditableOption').attr('style') === undefined, 
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
	test('Option: acceptedRanges', function () {
		// nothing to test here at the moment
	});
	
	module('disable');
	test('Editable combobox deactivation', function () {
		$('#test').jec();
		$('#test').jecOff();
		ok($('#test option').length === 3 && $('#test').attr('jec') !== undefined, 
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
		var strValue = 'myString', intValue = 123, floatValue = 1.2, defaults;
		
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
		
		var key;
		for (key in defaults) {
			if (defaults[key] !== undefined) {
				same($('#test').jecPref(key), defaults[key], 'We expect ' + key + 
					' parameter value of ' + defaults[key] + ' to be returned');
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
	});
	
	test('Setting preference: classes', function () {
		var className = 'myClass', otherClassName = 'mySecClass';
		$('#test').jec();
		$('#test').jecPref('classes', [className]);
		same($('#test').jecPref('classes'), [className], 
			'We expect array preference value to be handled');
		$('#test').jecPref('classes', className);
		ok($('#test').jecPref('classes') === className, 
			'We expect string preference value to be handled');
		$('#test').jecPref('classes', 1);
		ok($('#test').jecPref('classes') === className, 
			'We expect number preference value to be ignored');
		$('#test').jecPref('classes', {});
		ok($('#test').jecPref('classes') === className, 
			'We expect object preference value to be ignored');
		$('#test').jecPref('classes', false);
		ok($('#test').jecPref('classes') === className, 
			'We expect boolean preference value to be ignored');
		$('#test').jecPref('classes', undefined);
		ok($('#test').jecPref('classes') === className, 
			'We expect undefined preference value to be ignored');
		$('#test').jecPref('classes', null);
		ok($('#test').jecPref('classes') === className, 
			'We expect null preference value to be ignored');
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
	});
	
	test('Setting preference: pluginClass', function () {
		var className = 'myClass';
		$('#test').jec();
		$('#test').jecPref('pluginClass', className);
		same($('#test').jecPref('pluginClass'), className, 
			'We expect string preference value to be handled');
		$('#test').jecPref('pluginClass', {});
		ok($('#test').jecPref('pluginClass') === className, 
			'We expect object preference value to be ignored');
		$('#test').jecPref('pluginClass', []);
		ok($('#test').jecPref('pluginClass') === className, 
			'We expect array preference value to be ignored');
		$('#test').jecPref('pluginClass', 1);
		ok($('#test').jecPref('pluginClass') === className, 
			'We expect number preference value to be ignored');
		$('#test').jecPref('pluginClass', false);
		ok($('#test').jecPref('pluginClass') === className, 
			'We expect boolean preference value to be ignored');
		$('#test').jecPref('pluginClass', undefined);
		ok($('#test').jecPref('pluginClass') === className, 
			'We expect undefined preference value to be ignored');
		$('#test').jecPref('pluginClass', null);
		ok($('#test').jecPref('pluginClass') === className, 
			'We expect null preference value to be ignored');
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
	});
	
	test('Setting preference: ignoredKeys', function () {
		var range = [1, 2, 3];
		$('#test').jec();
		$('#test').jecPref('ignoredKeys', range);
		same($('#test').jecPref('ignoredKeys'), range, 
			'We expect array preference value to be handled');
		$('#test').jecPref('ignoredKeys', true);
		same($('#test').jecPref('ignoredKeys'), range, 
			'We expect boolean preference value to be ignored');
		$('#test').jecPref('ignoredKeys', 'true');
		same($('#test').jecPref('ignoredKeys'), range, 
			'We expect string preference value to be ignored');
		$('#test').jecPref('ignoredKeys', {});
		same($('#test').jecPref('ignoredKeys'), range, 
			'We expect object preference value to be ignored');
		$('#test').jecPref('ignoredKeys', 1);
		same($('#test').jecPref('ignoredKeys'), range, 
			'We expect number preference value to be range');
		$('#test').jecPref('ignoredKeys', undefined);
		same($('#test').jecPref('ignoredKeys'), range, 
			'We expect undefined preference value to be ignored');
		$('#test').jecPref('ignoredKeys', null);
		same($('#test').jecPref('ignoredKeys'), range, 
			'We expect null preference value to be ignored');
	});
	
	test('Setting preference: acceptedRanges', function () {
		var range = [
			{min: 10, max: 20},
			{exact: 35}
		];
		$('#test').jec();
		$('#test').jecPref('acceptedRanges', range);
		same($('#test').jecPref('acceptedRanges'), range, 
			'We expect array preference value to be handled');
		$('#test').jecPref('acceptedRanges', true);
		same($('#test').jecPref('acceptedRanges'), range, 
			'We expect boolean preference value to be ignored');
		$('#test').jecPref('acceptedRanges', 'true');
		same($('#test').jecPref('acceptedRanges'), range, 
			'We expect string preference value to be ignored');
		$('#test').jecPref('acceptedRanges', {});
		same($('#test').jecPref('acceptedRanges'), range, 
			'We expect object preference value to be ignored');
		$('#test').jecPref('acceptedRanges', 1);
		same($('#test').jecPref('acceptedRanges'), range, 
			'We expect number preference value to be range');
		$('#test').jecPref('acceptedRanges', undefined);
		same($('#test').jecPref('acceptedRanges'), range, 
			'We expect undefined preference value to be ignored');
		$('#test').jecPref('acceptedRanges', null);
		same($('#test').jecPref('acceptedRanges'), range, 
			'We expect null preference value to be ignored');
	});
	
	$('#test').hide();
});