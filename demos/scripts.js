/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, 
bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 50, indent: 4*/
/*global $, Number*/
/*members "1", "2", "3", after, blinkingCursor, blinkingCursorInterval, click, jec, jecOff, jecOn, 
jecPref, jecValue, useExistingOptions, val*/
'use strict';
$(function () {
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
    $('#demo-6 code').after(cb);
    
    $('#demo7').jec({blinkingCursor: true, blinkingCursorInterval: 500});
});