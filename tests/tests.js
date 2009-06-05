/*global $,document,module,test,ok,same*/
$(document).ready(function () {
	// hack for html validator (ol cannot be empty
	$('li').remove();
	
	var strValue = 'myString', intValue = 123, testValue = 'myTestValue', defaults;
	
	defaults = {
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
	
	module("init");
	test("Editable combobox initialization", function () {
		$('#test').jec();
		ok($('#test option.jecEditableOption').length === 1, 
            "We expect new editable option element to be created");
		$('#test').jecKill();
	});
	test("Option: position", function () {
		$('#test').jec({position: 0});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            "We expect new editable option element to be on first position");
		$('#test').jecKill();
		
		$('#test').jec({position: 1});
		ok($('#test').children('option').eq(1).filter('.jecEditableOption').length === 1, 
            "We expect new editable option element to be on second position");
		$('#test').jecKill();
		
		$('#test').jec({position: 3});
		ok($('#test').children('option').eq(3).filter('.jecEditableOption').length === 1, 
            "We expect new editable option element to be on last position");
		$('#test').jecKill();
		
		$('#test').jec({position: 100});
		ok($('#test').children('option:last').filter('.jecEditableOption').length === 1, 
            "We expect new editable option element to be on last position (value too big)");
		$('#test').jecKill();
		
		$('#test').jec({position: 4.2});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            "We expect malformed position option to be ignored (float)");
		$('#test').jecKill();
		
		$('#test').jec({position: '1'});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            "We expect malformed position option to be ignored (string)");
		$('#test').jecKill();
		
		$('#test').jec({position: true});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            "We expect malformed position option to be ignored (boolean)");
		$('#test').jecKill();
		
		$('#test').jec({position: null});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            "We expect malformed position option to be ignored (null)");
		$('#test').jecKill();
		
		$('#test').jec({position: undefined});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            "We expect malformed position option to be ignored (undefined)");
		$('#test').jecKill();
		
		$('#test').jec({position: {pos: 1}});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            "We expect malformed position option to be ignored (object)");
		$('#test').jecKill();
		
		$('#test').jec({position: [1]});
		ok($('#test').children('option:first.jecEditableOption').length === 1, 
            "We expect malformed position option to be ignored (array)");
		$('#test').jecKill();
	});
	test("Option: pluginClass", function () {
		var className = 'myClass', defaultClassName = 'jecEditableOption';
		$('#test').jec({pluginClass: className});
		ok($('#test option.' + className).length === 1, 
            "We expect new editable option element to be created");
		$('#test').jecKill();
		
		$('#test').jec({pluginClass: 1});
		ok($('#test option.' + defaultClassName).length === 1, 
            "We expect malformed plugin class option to be ignored (number)");
		$('#test').jecKill();
		
		$('#test').jec({pluginClass: true});
		ok($('#test option.' + defaultClassName).length === 1, 
            "We expect malformed plugin class option to be ignored (boolean)");
		$('#test').jecKill();
		
		$('#test').jec({pluginClass: null});
		ok($('#test option.' + defaultClassName).length === 1, 
            "We expect malformed plugin class option to be ignored (null)");
		$('#test').jecKill();
		
		$('#test').jec({pluginClass: undefined});
		ok($('#test option.' + defaultClassName).length === 1, 
            "We expect malformed plugin class option to be ignored (undefined)");
		$('#test').jecKill();
		
		$('#test').jec({pluginClass: {classes: className}});
		ok($('#test option.' + defaultClassName).length === 1, 
            "We expect malformed plugin class option to be ignored (object)");
		$('#test').jecKill();
		
		$('#test').jec({pluginClass: [className]});
		ok($('#test option.' + defaultClassName).length === 1, 
            "We expect malformed plugin class option to be ignored (array)");
		$('#test').jecKill();
	});
	test("Option: classes", function () {
		var defaultClassName = 'jecEditableOption', className = 'c1', otherClassName = 'c2';
		$('#test').jec({classes: ''});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            "We expect new editable option to have no extra classes");
		$('#test').jecKill();
		
		className = 'myClass';
		$('#test').jec({classes: className});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            "We expect new editable option to have one extra class (string)");
		$('#test').jecKill();
		
		$('#test').jec({classes: className + ' ' + otherClassName});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName) && 
            $('#test').children('option.jecEditableOption').hasClass(className), 
            "We expect new editable option to have several extra classes (string)");
		$('#test').jecKill();
		
		$('#test').jec({classes: []});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            "We expect new editable option to have no extra classes (array)");
		$('#test').jecKill();
		
		$('#test').jec({classes: [className]});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName) && 
            $('#test').children('option.jecEditableOption').hasClass(className), 
            "We expect new editable option to have one extra class (array)");
		$('#test').jecKill();
		
		$('#test').jec({classes: [className, otherClassName]});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName) && 
            $('#test').children('option.jecEditableOption').hasClass(className) && 
            $('#test').children('option.jecEditableOption').hasClass(otherClassName), 
            "We expect new editable option to have several extra classes (array)");
		$('#test').jecKill();
		
		$('#test').jec({classes: 10});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            "We expect malformed classes option to be ignored (number)");
		$('#test').jecKill();
		
		$('#test').jec({classes: true});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            "We expect malformed classes option to be ignored (boolean)");
		$('#test').jecKill();
		
		$('#test').jec({classes: null});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            "We expect malformed classes option to be ignored (null)");
		$('#test').jecKill();
		
		$('#test').jec({classes: undefined});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            "We expect malformed classes option to be ignored (undefined)");
		$('#test').jecKill();
		
		$('#test').jec({classes: {cl: className}});
		ok($('#test').children('option.jecEditableOption').hasClass(defaultClassName), 
            "We expect malformed classes option to be ignored (object)");
		$('#test').jecKill();
	});
	test("Option: styles", function () {
		var styleName = 'width', styleValue = '100px', otherStyleName = 'height', otherStyleValue = '200px', obj = {};
		
		$('#test').jec({styles: obj});
		ok($('#test').children('option.jecEditableOption').css(styleName) === 'auto', 
            "We expect new editable option to have no extra styles");
		$('#test').jecKill();
		
		obj[styleName] = styleValue;
		$('#test').jec({styles: obj});
		ok($('#test').children('option.jecEditableOption').css(styleName) === styleValue, 
            "We expect new editable option to have one extra style");
		$('#test').jecKill();
		
		obj[otherStyleName] = otherStyleValue;
		$('#test').jec({styles: obj});
		ok($('#test').children('option.jecEditableOption').css(styleName) === styleValue && 
            $('#test').children('option.jecEditableOption').css(otherStyleName) === otherStyleValue,
             "We expect new editable option to have several extra styles");
		$('#test').jecKill();
		
		$('#test').jec({styles: 'width: 100px'});
		ok($('#test').children('option.jecEditableOption').attr('style') === undefined, "We expect malformed styles option to be ignored (string)");
		$('#test').jecKill();
		
		$('#test').jec({styles: 10});
		ok($('#test').children('option.jecEditableOption').attr('style') === undefined, 
            "We expect malformed styles option to be ignored (number)");
		$('#test').jecKill();
		
		$('#test').jec({styles: true});
		ok($('#test').children('option.jecEditableOption').attr('style') === undefined, 
            "We expect malformed styles option to be ignored (boolean)");
		$('#test').jecKill();
		
		$('#test').jec({styles: null});
		ok($('#test').children('option.jecEditableOption').attr('style') === undefined, 
            "We expect malformed styles option to be ignored (null)");
		$('#test').jecKill();
		
		$('#test').jec({styles: undefined});
		ok($('#test').children('option.jecEditableOption').attr('style') === undefined, 
            "We expect malformed styles option to be ignored (undefined)");
		$('#test').jecKill();
		
		$('#test').jec({styles: [{styles: obj}]});
		ok($('#test').children('option.jecEditableOption').attr('style') === undefined, 
            "We expect malformed styles option to be ignored (array)");
		$('#test').jecKill();
	});
	test("Option: focusOnNewOption", function () {
		$('#test').jec({focusOnNewOption: false});
		ok($('#test option:first:not(:selected)').length === 1, 
            "We expect focus to be set on first option");
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: true});
		ok($('#test option:first:selected').length === 1, 
            "We expect focus to be moved to editable option");
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: '1'});
		ok($('#test option:first:not(:selected)').length === 1, 
            "We expect malformed focus option to be ignored (string)");
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: 1});
		ok($('#test option:first:not(:selected)').length === 1, 
            "We expect malformed focus option to be ignored (number)");
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: null});
		ok($('#test option:first:not(:selected)').length === 1, 
            "We expect malformed focus option to be ignored (null)");
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: undefined});
		ok($('#test option:first:not(:selected)').length === 1, 
            "We expect malformed focus option to be ignored (undefined)");
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: {focus: true}});
		ok($('#test option:first:not(:selected)').length === 1, 
            "We expect malformed focus option to be ignored (object)");
		$('#test').jecKill();
		
		$('#test').jec({focusOnNewOption: [true]});
		ok($('#test option:first:not(:selected)').length === 1, 
            "We expect malformed focus option to be ignored (array)");
		$('#test').jecKill();
	});
	test("Option: useExistingOptions", function () {
		// nothing to test here at the moment
	});
	test("Option: ignoredKeys", function () {
		// nothing to test here at the moment
	});
	test("Option: acceptedRanges", function () {
		// nothing to test here at the moment
	});
	
	module("disable");
	test("Editable combobox deactivation", function () {
		$('#test').jec();
		$('#test').jecOff();
		ok($('#test option').length === 3 && $('#test').attr('jec') !== undefined, 
            "We expect editable combobox to be disabled");
		$('#test').jecKill();
	});
	
	module("enable");
	test("Editable combobox activation", function () {
		$('#test').jec();
		$('#test').jecOff();
		$('#test').jecOn();
		ok($('#test option.jecEditableOption').length === 1, 
            "We expect editable combobox to be enabled");
		$('#test').jecKill();
	});
	
	module("kill");
	test("Editable combobox activation", function () {
		$('#test').jec();
		$('#test').jecKill();
		ok($('#test option').length === 3 && $('#test').attr('jec') === undefined, 
            "We expect editable combobox to be destroyed");
	});
	
	module("value");
	test("Getting value", function () {
		$('#test').jec();
		$('#test option.jecEditableOption').text(testValue).val(testValue);
		same($('#test').jecValue(), testValue, 
            "We expect value of " + testValue + " to be retrieved");
		$('#test').jecKill();
	});
	
	test("Setting value", function () {
		$('#test').jec();
		$('#test').jecValue(strValue);
		same($('#test').jecValue(), strValue, "We expect value of " + strValue + " to be set");
		
		$('#test').jecValue(intValue);
		same($('#test').jecValue(), intValue.toString(), 
            "We expect value of " + intValue + " to be set");
		
		$('#test').jecValue({});
		same($('#test').jecValue(), intValue.toString(), 
            "We expect object value to be ignored and value of " + intValue + " be still set");
		
		$('#test').jecValue([]);
		same($('#test').jecValue(), intValue.toString(), 
            "We expect array value to be ignored and value of " + intValue + " be still set");
		
		$('#test').jecValue(null);
		same($('#test').jecValue(), intValue.toString(), 
            "We expect null value to be ignored and value of " + intValue + " be still set");
		
		$('#test').jecValue(undefined);
		same($('#test').jecValue(), intValue.toString(), 
            "We expect undefined value to be ignored and value of " + intValue + " be still set");
		
		$('#test').jecKill();
	});
	
	$('#test').hide();
});