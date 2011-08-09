/**
 * jQuery jEC (jQuery Editable Combobox) 0.1
 *
 * Copyright (c) 2008 Lukasz Rajchel (lukasz@rajchel.pl | http://lukasz.rajchel.pl)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Syntax:
 * $('select').editableCombobox()
 *
 * Changelog:
 * 0.1 (2008.04.03)
 * - initial release
 */

(function($) {
 
 	// register new jQuery function
	$.fn.editableCombobox = function() {
		
		return $(this).filter('select').each(function() {
			
			// add editable option tag if not exists
			if ($(this).children('jecEditableOption').length == 0) {
				var editableOption = document.createElement('option');
				$(editableOption).addClass('jecEditableOption').prependTo(this).hide();
			}
			
			// handle keys pressed on select
			$(this).keyup(function(event) {
				switch(event.keyCode) {
					case 9: // tab
					case 13: // return
					case 16: // shift
					case 17: // ctrl
					case 18: // alt
					case 27: // escape
					case 33: // page up
					case 34: // page down
					case 35: // end
					case 36: // home
					case 37: // left
					case 38: // up
					case 39: // right
					case 40: // down
					case 45: // insert
					case 46: // delete
						break;
					case 8:	// backspace
						var option = $(this).children('option.jecEditableOption');
						if ($(option).val().length > 1) {
							// remove selection from all options
							$(this).children(':selected').removeAttr('selected');
						
							// remove last character from
							var value = $(option).val().substring(0, $(option).val().length - 1);
							$(option).val(value).text(value).attr('selected', 'selected').show();
						} else if ($(option).val().length == 1) {
							$(option).val('').text('').hide();
						}
						break;
					default:
						// remove selection from all options
						$(this).children(':selected').removeAttr('selected');
						
						// read check if char should be upper or lower case
						var keyValue = String.fromCharCode(event.keyCode);
						if (event.shiftKey) {
							keyValue = keyValue.toUpperCase();
						} else {
							keyValue = keyValue.toLowerCase();
						}
						
						// add key value to proper option tag
						var option = $(this).children('option.jecEditableOption');
						$(option).val($(option).val() + keyValue).text($(option).val()).attr('selected', 'selected').show();
						break;
				}
			});
			
			// disable browser-history-back on backspace
			$(this).keydown(function(event) {
				return (event.keyCode != 8);
			});
		});
	}

})(jQuery);