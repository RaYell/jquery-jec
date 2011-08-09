/**
 * jQuery jEC (jQuery Editable Combobox) 0.2.2
 * http://code.google.com/p/jquery-jec
 * http://plugins.jquery.com/project/jEC
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
 * $(selectors).editableCombobox([options])
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
 * - object filters - keycode filters describing how non-alphanumerical characters should be
 *		treated
 * - object altFilers - keycode filters describing how non-alphanumerical characters
 *		with alt key should be treated
 * - object ctrlFilers - keycode filters describing how non-alphanumerical characters
 *		with ctrl key should be treated
 * - object shiftFilers - keycode filters describing how non-alphanumerical characters
 *		with shift key should be treated
 * - object altCtrlFilers - keycode filters describing how non-alphanumerical characters
 *		with alt and ctrl keys should be treated
 * - object altShiftFilers - keycode filters describing how non-alphanumerical characters
 *		with alt and shift keys should be treated
 * - object ctrlShiftFilers - keycode filters describing how non-alphanumerical characters
 *		with ctrl and shift keys should be treated
 * - object altCtrlShiftFilers - keycode filters describing how non-alphanumerical characters
 *		with alt and ctrl and shift keys should be treated
 *
 * Changelog:
 * 0.2.2 (2008.04.14)
 * - keycode filtering options added
 *
 * 0.2.1 (2008.04.10)
 * - code optimization 
 *
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
			position: 0,
			classes: '',
			styles: {},
			pluginClass: 'jecEditableOption',
			filters: {
				96: 0, // numpad 0
				97: 1, // numpad 1
				98: 2, // numpad 2
				99: 3, // numpad 3
				100: 4, // numpad 4
				101: 5, // numpad 5
				102: 6, // numpad 6
				103: 7, // numpad 7
				104: 8, // numpad 8
				105: 9, // numpad 9
				106: '*', // multiply
				107: '=', // equal lign
				109: '-', // subtract
				110: '.', // decimal point
				111: '/', // divide
				186: ';', // semi-colon
				187: '=', // equal sign
				188: ',', // comma
				189: '-', // dash
				190: '.', // period
				191: '/', // forward slash
				192: '`', // grave accent
				219: '[', // open bracket
				220: '\\', // back slash
				221: ']', // close braket
				222: '\'' // single quote
			},
			altFilters: {},
			ctrlFilters: {},
			shiftFilters: {
				48: ')', // 0
				49: '!', // 1
				50: '@', // 2
				51: '#', // 3
				52: '$', // 4
				53: '%', // 5
				54: '^', // 6
				55: '&', // 7
				56: '*', // 8
				57: '(', // 9
				109: '_', // underscore
				186: ':', // colon
				188: '<', // left chevron
				190: '>', // right chevron
				191: '?', // question mark
				192: '~', // tilde
				219: '{', // left brace
				220: '|', // pipe
				221: '}', // right brace
				222: '"' // double quote
			},
			altCtrlFilters: {},
			altShiftFilters: {},
			ctrlShiftFilters: {},
			altCtrlShiftFilters: {}
		};
		
		// options
		var options = $.extend(defaults, options);
		
		return $(this).filter('select').each(function() {
			
			// add editable option tag if not exists
			if ($(this).children(options.pluginClass).length == 0) {
				var editableOption = $(document.createElement('option'));
				editableOption.addClass(options.pluginClass).hide();
				
				// add passed CSS classes
				if (typeof(options.classes) == 'string') {
					editableOption.addClass(options.classes);
				} else if (typeof(options.classes) == 'object') {
					for (var i = 0; i < options.classes.length; i++) {
						editableOption.addClass(options.classes[i]);
					}
				}
				
				// add passed CSS styles
				if (typeof(options.styles) == 'object') {
					for (var i = 0; i < options.styles.length; i++) {
						editableOption.append(options.styles[i]);
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
					case 13: // enter
					case 16: // shift
					case 17: // ctrl
					case 18: // alt
					case 19: // pause/break
					case 20: // caps lock
					case 27: // escape
					case 33: // page up
					case 34: // page down
					case 35: // end
					case 36: // home
					case 37: // left arrow
					case 38: // up arrow
					case 39: // right arrow
					case 40: // down arrow
					case 45: // insert
					case 46: // delete
					case 91: // left window
					case 92: // right window
					case 93: // select
					case 112: // f1
					case 113: // f2
					case 114: // f3
					case 115: // f4
					case 116: // f5
					case 117: // f6
					case 118: // f7
					case 119: // f8
					case 120: // f9
					case 121: // f10
					case 122: // f11
					case 123: // f12
					case 144: // num lock
					case 145: // scroll lock
						// ignore
						break;
					case 8:	// backspace
						var option = $(this).children('option.' + options.pluginClass);
						if (option.val().length > 1) {
							// remove selection from all options
							$(this).children(':selected').removeAttr('selected');
						
							// remove last character
							var value = option.val().substring(0, option.val().length - 1);
							option.val(value).text(value).attr('selected', 'selected').show();
						} else if (option.val().length == 1) {
							option.val('').text('').hide();
						}
						break;
					default:
						// remove selection from all options
						$(this).children(':selected').removeAttr('selected');
						
						// filter key code
						if (event.altKey && event.ctrlKey && event.shiftKey && options.altCtrlShiftFilters[event.keyCode] != null) {
							keyValue = options.altCtrlShiftFilters[event.keyCode];
						} else if (event.altKey && event.ctrlKey && options.altCtrlFilters[event.keyCode] != null) {
							keyValue = options.altCtrlFilters[event.keyCode];
						} else if (event.altKey && event.shiftKey && options.altShiftFilters[event.keyCode] != null) {
							keyValue = options.altShiftFilters[event.keyCode];
						} else if (event.ctrlKey && event.shiftKey && options.ctrlShiftFilters[event.keyCode] != null) {
							keyValue = options.ctrlShiftFilters[event.keyCode];
						} else if (event.altKey && options.altFilters[event.keyCode] != null) {
							keyValue = options.altFilters[event.keyCode];
						} else if (event.ctrlKey && options.ctrlFilters[event.keyCode] != null) {
							keyValue = options.ctrlFilters[event.keyCode];
						} else if (event.shiftKey && options.shiftFilters[event.keyCode] != null) {
							keyValue = options.shiftFilters[event.keyCode];
						} else if (options.filters[event.keyCode] != null) {
							keyValue = options.filters[event.keyCode];
						} else {
							// read check if char should be upper or lower case
							var keyValue = String.fromCharCode(event.keyCode);
							if (event.shiftKey) {
								keyValue = keyValue.toUpperCase();
							} else {
								keyValue = keyValue.toLowerCase();
							}
						}
						
						// add key value to proper option tag
						var option = $(this).children('option.' + options.pluginClass);
						var value = option.val() + keyValue;
						option.val(value).text(value).attr('selected', 'selected').show();
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