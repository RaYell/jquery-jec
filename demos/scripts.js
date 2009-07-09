/*global $, Number, document*/
/*members "1", "2", "3", after, blinkingCursor, click, jec, jecOff, jecOn, jecPref, jecValue, 
ready, useExistingOptions, val*/
$(document).ready(function () {
	$('#demo1').jec();
	
	$('#demo2').jec({useExistingOptions: true});
	
	$('#demo3').jec();
	$('#disable').click(function () {
		if ($(this).val() === 'Disable') {
			$(this).val('Enable');
			$('#demo3').jecOff();
		} else {
			$(this).val('Disable');
			$('#demo3').jecOn();
		}
	});
	
	$('#demo4').jec();
	$('#getVal').click(function () {
		$('#value').val($('#demo4').jecValue());
	});
	$('#setVal').click(function () {
		$('#demo4').jecValue($('#value').val());
	});
	
	$('#demo5').jec();
	$('#getPref').click(function () {
		$('#pref').val($('#demo5').jecPref('position'));
	});
	$('#setPref').click(function () {
		$('#demo5').jecPref('position', Number($('#pref').val()));
	});
	
	var options, cb;
	options =  [{1: 'Alfa Romeo', 2: 'Ferrari', 3: 'Porsche'}];
	cb = $.jec(options);
	$('#tabs-6 code').after(cb);
	
	$('#demo7').jec({blinkingCursor: true, blinkingCursorInterval: 500});
});