/*global $,document*/
/*members "1", "2", "3", after, click, jec, jecOff, jecOn, jecPref, jecValue, ready, tabs, val*/
$(document).ready(function () {
	$('#tabs').tabs();
	
	$('#demo1').jec();
	
	$('#demo2').jec();
	$('#disable').click(function () {
		if ($(this).val() === 'Disable') {
			$(this).val('Enable');
			$('#demo2').jecOff();
		} else {
			$(this).val('Disable');
			$('#demo2').jecOn();
		}
	});
	
	$('#demo3').jec();
	$('#getVal').click(function () {
		$('#value').val($('#demo3').jecValue());
	});
	$('#setVal').click(function () {
		$('#demo3').jecValue($('#value').val());
	});
	
	$('#demo4').jec();
	$('#getPref').click(function () {
		$('#pref').val($('#demo4').jecPref('position'));
	});
	$('#setPref').click(function () {
		$('#demo4').jecPref('position', Number($('#pref').val()));
	});
	
	var options, cb;
	options =  [{1: 'Alfa Romeo', 2: 'Ferrari', 3: 'Porsche'}];
	cb = $.jec(options);
	$('#tabs-5 code').after(cb);
});