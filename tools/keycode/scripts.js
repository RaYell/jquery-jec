/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, 
regexp: true, strict: true, newcap: true, immed: true, maxerr: 50, indent: 4, maxlen: 120*/
/*global $*/
/*members '1', '2', '3', after, blinkingCursor, blinkingCursorInterval, click, jec, jecOff, jecOn, jecPref, jecValue, 
maxLength, useExistingOptions, val*/
$(function () {
    $('#key').keydown(function (e) {
        $('#keydown').html('Key Down: ' + e.which);
    });
    
    $('#key').keypress(function (e) {
        $('#keypress').html('Key Press: ' + e.which);
    });
    
    $('#key').keyup(function (e) {
        $('#keyup').html('Key Up: ' + e.which);
    });
});