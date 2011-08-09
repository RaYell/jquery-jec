/**
 * jQuery jEC (jQuery Editable Combobox) 0.3.0
 * http://code.google.com/p/jquery-jec
 * http://plugins.jquery.com/project/jEC
 *
 * Copyright (c) 2008 Lukasz Rajchel (lukasz@rajchel.pl | http://lukasz.rajchel.pl)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Documentation	:	http://code.google.com/p/jquery-jec/wiki/Documentation
 * Changelog:		:	http://code.google.com/p/jquery-jec/wiki/Changelog
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
				48: ')', // right parenthesis
				49: '!', // exclamation mark
				50: '@', // at
				51: '#', // hash
				52: '$', // dollar sign
				53: '%', // percent sign
				54: '^', // caret
				55: '&', // ampersand
				56: '*', // asterisk
				57: '(', // left parenthesis
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
			altCtrlShiftFilters: {},
			ignoredKeys: [
				9, // tab
				13, // enter
				16, // shift
				17, // ctrl
				18, // alt
				19, // pause/break
				20, // caps lock
				27, // escape
				33, // page up
				34, // page down
				35, // end
				36, // home
				37, // left arrow
				38, // up arrow
				39, // right arrow
				40, // down arrow
				45, // insert
				46, // delete
				91, // left window
				92, // right window
				93, // select
				112, // f1
				113, // f2
				114, // f3
				115, // f4
				116, // f5
				117, // f6
				118, // f7
				119, // f8
				120, // f9
				121, // f10
				122, // f11
				123, // f12
				144, // num lock
				145 // scroll lock
			]
		};

		// options
		var options = $.extend(defaults, options);

		// IE doesn't implement indexOf() method
		if ($.browser.msie) {
			Array.prototype.indexOf = function(object) {
				for (var i = 0; i < this.length; i++) {
					if (this[i] == object) {
						return i;
					}
				}
				return -1;
			}
		}

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
						// don't handle ignored keys
						if (options.ignoredKeys.indexOf(event.keyCode) == -1) {
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
						}
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