/**
 * jQuery jEC (jQuery Editable Combobox) 0.2
 *
 * Copyright (c) 2008 Lukasz Rajchel (lukasz@rajchel.pl | http://lukasz.rajchel.pl)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * This plugin changes any select box into editable ComboBox by adding a new option
 * element to keep the value entered by keyboard. This will only work on select
 * elements. Every other elements will be ignored.
 *
 * Syntax:
 * $(elements).editableCombobox([options])
 *
 * Parameters:
 * - object options plugin specific options
 *
 * Options:
 * - int position - index of editable option to be inserted in select (default 0)
 * - string|array classes - additional CSS classes to be added to editable option element
 * 		(default '')
 * - object styles - additional CSS properties to be set for editable option
 * 		element (default '')
 * - string pluginClass	- name of plugin class, should be overwritten only if default 
 * 		plugin class is in use (default: 'jecEditableOption')
 *
 * Changelog:
 * 0.2 (2008.04.04)
 * - options added
 *
 * 0.1 (2008.04.03)
 * - initial release
 */

(function($) {
 
 	// register new jQuery function
	$.fn.editableCombobox = function(options) {
	
		// default options
		var defaults = {
			'position': 0,
			'classes': '',
			'styles': {},
			'pluginClass': 'jecEditableOption'
		};
		
		var options = $.extend(defaults, options);
		
		return $(this).filter('select').each(function() {
			
			// add editable option tag if not exists
			if ($(this).children(options.pluginClass).length == 0) {
				var editableOption = document.createElement('option');
				$(editableOption).addClass(options.pluginClass).hide();
				
				// add passed CSS classes
				if (typeof(options.classes) == 'string') {
					$(editableOption).addClass(options.classes);
				} else if (typeof(options.classes) == 'object') {
					for (var i = 0; i < options.classes.length; i++) {
						$(editableOption).addClass(options.classes[i]);
					}
				}
				
				// add passed CSS styles
				if (typeof(options.styles) == 'object') {
					for (var i = 0; i < options.styles.length; i++) {
						$(editableOption).append(options.styles[i]);
					}
				}
				
				// insert created element on correct position
				if ($(this).children().eq(options.position).length != 0) {
					$(this).children().eq(options.position).before(editableOption);
				} else {
					$(this).append(editableOption);
				}
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
						var option = $(this).children('option.' + options.pluginClass);
						if ($(option).val().length > 1) {
							// remove selection from all options
							$(this).children(':selected').removeAttr('selected');
						
							// remove last character
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
						var option = $(this).children('option.' + options.pluginClass);
						$(option).val($(option).val() + keyValue).text($(option).val()).attr('selected', 'selected').show();
						break;
				}
			});
			
			// disable browser-history-back on backspace
			$(this).keydown(function(event) {
				return (event.keyCode != 8);
			});
		});
	};

})(jQuery);