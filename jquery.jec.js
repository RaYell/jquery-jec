/**
 * jQuery jEC (jQuery Editable Combobox) 0.5.4
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

/*global document, jQuery*/
(function ($) {

	// jEC Core class
	$.jecCore = {
	
		// default options
		defaults: {
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
		},
		
		// options
		options: null,
		
		//
		ieHacks: function () {
			// IE doesn't implement indexOf() method
			if ($.browser.msie && Array.prototype.indexOf === null) {
				Array.prototype.indexOf = function (object) {
	
					for (var i = 0; i < this.length; i += 1) {
						if (this[i] === object) {
							return i;
						}
					}
					return -1;
				};
			}
		},
		
		// returns key code
		getKeyCode: function (event) {
			if (typeof(event.charCode) !== 'undefined' && event.charCode !== 0) {
				return event.charCode;
			} else {
				return event.keyCode;
			}
		},
		
		// special keys codes
		specialKeys: [46, 37, 38, 39, 40],
		
		lastKeyCode: null,
		
		// sets editable option to the value of currently selected option
		setEditableOption: function (elem) {
			elem.children('option.' + $.jecCore.options.pluginClass).val(elem.children('option:selected').text());
		},
		
		// keydown event handler
		// handles keys pressed on select (backspace and delete must be handled
		// in keydown event in order to work in IE)
		jecKeyDown: function (event) {
			var keyCode, option, value;
	
			keyCode = $.jecCore.getKeyCode(event);
			$.jecCore.lastKeyCode = keyCode;

			switch (keyCode) {
			case 8:	// backspace
			case 46: // delete
				option = $(this).children('option.' + $.jecCore.options.pluginClass);
				if (option.val().length >= 1) {
					value = option.val().substring(0, option.val().length - 1);
					option.val(value).text(value).attr('selected', 'selected');
				}
				return (keyCode !== 8);
			default:
				break;
			}
		},
		
		// keypress event handler
		// handles the rest of the keys (keypress event gives more informations
		// about pressed keys)
		jecKeyPress: function (event) {
			var keyCode, keyValue, i, option, value, validKey;
	
			keyCode = $.jecCore.getKeyCode(event);

			if (keyCode !== 9) {
				// handle special keys
				for (i = 0; i < $.jecCore.specialKeys.length; i += 1) {
					if (keyCode === $.jecCore.specialKeys[i] && keyCode === $.jecCore.lastKeyCode) {
						return;
					}
				}

				// don't handle ignored keys
				if ($.jecCore.options.ignoredKeys.indexOf(keyCode) === -1) {
					// remove selection from all options
					$(this).children(':selected').removeAttr('selected');

					keyValue = '';
					// iterate through valid ranges
					for (validKey in $.jecCore.options.acceptedRanges) {
						// the range can be either a min,max tuple or exact value
						if ((typeof($.jecCore.options.acceptedRanges[validKey].exact) !== 'undefined' &&
								$.jecCore.options.acceptedRanges[validKey].exact === keyCode) ||
							(typeof($.jecCore.options.acceptedRanges[validKey].min) !== 'undefined' &&
								typeof($.jecCore.options.acceptedRanges[validKey].max) !== 'undefined' &&
								keyCode >= $.jecCore.options.acceptedRanges[validKey].min &&
								keyCode <= $.jecCore.options.acceptedRanges[validKey].max)) {
							keyValue = String.fromCharCode(keyCode);
						}
					}

					// add key value to proper option tag
					option = $(this).children('option.' + $.jecCore.options.pluginClass);
					value = option.val() + keyValue;
					option.val(value).text(value).attr('selected', 'selected');
				}
				
				return false;
			}
		},
		
		// change event handler
		jecChange: function () {
			$.jecCore.setEditableOption($(this));
		},
	
		// enable editable combobox
		enable: function (options) {

			// override passed default options
			$.jecCore.options = options;
			$.jecCore.options = $.extend($.jecCore.defaults, $.jecCore.options);
	
			$.jecCore.ieHacks();
	
			return $(this).filter('select').each(function () {
	
				var editableOption, i;
	
				// add editable option tag if not exists
				if ($(this).children($.jecCore.options.pluginClass).length === 0) {
					editableOption = $(document.createElement('option'));
					editableOption.addClass($.jecCore.options.pluginClass);
	
					// add passed CSS classes
					if (typeof($.jecCore.options.classes) === 'string') {
						editableOption.addClass($.jecCore.options.classes);
					} else if (typeof($.jecCore.options.classes) === 'object') {
						for (i = 0; i < $.jecCore.options.classes.length; i += 1) {
							editableOption.addClass($.jecCore.options.classes[i]);
						}
					}
	
					// add passed CSS styles
					if (typeof($.jecCore.options.styles) === 'object') {
						for (i = 0; i < $.jecCore.options.styles.length; i += 1) {
							editableOption.append($.jecCore.options.styles[i]);
						}
					}
	
					// insert created element on correct position
					if ($(this).children().eq($.jecCore.options.position).length !== 0) {
						$(this).children().eq($.jecCore.options.position).before(editableOption);
					} else {
						$(this).append(editableOption);
					}
				}
	
				$(this).bind('keydown', $.jecCore.jecKeyDown);
				$(this).bind('keypress', $.jecCore.jecKeyPress);
	
				// handles 'useExistingOptions = true' behavior
				if ($.jecCore.options.useExistingOptions) {
					$.jecCore.setEditableOption($(this));
					$(this).bind('change', $.jecCore.jecChange);
				}
			});
		},
		
		// disable editable combobox
		disable: function () {
			return $(this).filter('select').each(function () {
				$(this).children('option.' + $.jecCore.options.pluginClass).remove();
				$(this).unbind('keydown', $.jecCore.jecKeyDown);
				$(this).unbind('keypress', $.jecCore.jecKeyPress);
				
				if ($.jecCore.options !== null && $.jecCore.options.useExistingOptions) {
					$(this).unbind('change', $.jecCore.jecChange);
				}
			});
		},
		
		// gets or sets editable option's value
		value: function (value, setFocus) {
			if (typeof(value) === 'undefined' || value === null) {
				// get value
				return $(this).filter('select option.' + $.jecCore.options.pluginClass).val();
			} else if (typeof(value) === 'string' || typeof(value) === 'number') {
				// set value
				return $(this).filter('select').each(function () {
					var option = $(this).children('option.' + $.jecCore.options.pluginClass);
					option.val(value).text(value);
					if (typeof(setFocus) !== 'boolean' || setFocus) {
						option.attr('selected', 'selected');
					}
				});
			}
		}
	};

 	// register editableCombobox() jQuery function
	$.fn.extend({
		jec: $.jecCore.enable,
		jecOn: $.jecCore.enable,
		jecOff: $.jecCore.disable,
		jecValue: $.jecCore.value,
		// deprecated
		editableCombobox: $.jecCore.enable		
	});

})(jQuery);