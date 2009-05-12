$(document).ready(function(){
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
	test("Editable combobox initialization", function() {
		$('#test').jec();
		ok($('#test option.jecEditableOption').length === 1, "We expect new editable option element to be created");
		$('#test').jecKill();
	});
	test("Option: position", function() {
		$('#test').jec({position: 0});
		ok($('#test').children('option:first.jecEditableOption').length === 1, "We expect new editable option element to be on first position");
		$('#test').jecKill();
		
		$('#test').jec({position: 1});
		ok($('#test').children('option').eq(1).filter('.jecEditableOption').length === 1, "We expect new editable option element to be on second position");
		$('#test').jecKill();
		
		$('#test').jec({position: 3});
		ok($('#test').children('option').eq(3).filter('.jecEditableOption').length === 1, "We expect new editable option element to be on last position");
		$('#test').jecKill();
		
		$('#test').jec({position: 100});
		ok($('#test').children('option:last').filter('.jecEditableOption').length === 1, "We expect new editable option element to be on last position (value greater then number of options)");
		$('#test').jecKill();
	});
	test("Option: pluginClass", function() {
		var className = 'myClass';
		$('#test').jec({pluginClass: className});
		ok($('#test option.' + className).length === 1, "We expect new editable option element to be created");
		$('#test').jecKill();
	});
	test("Option: focusOnNewOption", function() {
		$('#test').jec({focusOnNewOption: true});
		ok($('#test option:first.jecEditableOption').length === 1, "We expect focus to be moved to editable option");
		$('#test').jecKill();
	});
	test("Option: useExistingOptions", function() {
		// nothing to test here at the moment
	});
	test("Option: ignoredKeys", function() {
		// nothing to test here at the moment
	});
	test("Option: acceptedRanges", function() {
		// nothing to test here at the moment
	});
	
	module("disable");
	test("Editable combobox deactivation", function() {
		$('#test').jec();
		$('#test').jecOff();
		ok($('#test option').length === 3 && $('#test').attr('jec') !== undefined, "We expect editable combobox to be disabled");
		$('#test').jecKill();
	});
	
	module("enable");
	test("Editable combobox activation", function() {
		$('#test').jec();
		$('#test').jecOff();
		$('#test').jecOn();
		ok($('#test option.jecEditableOption').length === 1, "We expect editable combobox to be enabled");
		$('#test').jecKill();
	});
	
	module("kill");
	test("Editable combobox activation", function() {
		$('#test').jec();
		$('#test').jecKill();
		ok($('#test option').length === 3 && $('#test').attr('jec') === undefined, "We expect editable combobox to be destroyed");
	});
	
	module("value");
	test("Getting value", function() {
		$('#test').jec();
		$('#test option.jecEditableOption').text(testValue).val(testValue);
		same($('#test').jecValue(), testValue, "We expect value of " + testValue + " to be retrieved");
		$('#test').jecKill();
	});
	
	test("Setting value", function() {
		$('#test').jec();
		$('#test').jecValue(strValue);
		same($('#test').jecValue(), strValue, "We expect value of " + strValue + " to be set");
		
		$('#test').jecValue(intValue);
		same($('#test').jecValue(), intValue.toString(), "We expect value of " + intValue + " to be set");
		
		$('#test').jecValue({});
		same($('#test').jecValue(), intValue.toString(), "We expect object value to be ignored and value of " + intValue + " be still set");
		
		$('#test').jecValue([]);
		same($('#test').jecValue(), intValue.toString(), "We expect array value to be ignored and value of " + intValue + " be still set");
		
		$('#test').jecValue(null);
		same($('#test').jecValue(), intValue.toString(), "We expect null value to be ignored and value of " + intValue + " be still set");
		
		$('#test').jecValue(undefined);
		same($('#test').jecValue(), intValue.toString(), "We expect undefined value to be ignored and value of " + intValue + " be still set");
		
		$('#test').jecKill();
	});
	
	$('#test').hide();
});