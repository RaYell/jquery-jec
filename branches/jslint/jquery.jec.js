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

 	// register editableCombobox() jQuery function
	$.fn.editableCombobox = function (options) {

		// default options
		var defaults = {
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

		// override passed default options
		options = $.extend(defaults, options);

		// IE doesn't implement indexOf() method
		if ($.browser.msie) {
			Array.prototype.indexOf = function (object) {

				for (var i = 0; i < this.length; i += 1) {
					if (this[i] === object) {
						return i;
					}
				}
				return -1;
			};
		}

		return $(this).filter('select').each(function () {

			var editableOption, i, lastKeyCode, specialKeys, getKeyCode, setEditableOption;

			// add editable option tag if not exists
			if ($(this).children(options.pluginClass).length === 0) {
				editableOption = $(document.createElement('option'));
				editableOption.addClass(options.pluginClass);

				// add passed CSS classes
				if (typeof(options.classes) === 'string') {
					editableOption.addClass(options.classes);
				} else if (typeof(options.classes) === 'object') {
					for (i = 0; i < options.classes.length; i += 1) {
						editableOption.addClass(options.classes[i]);
					}
				}

				// add passed CSS styles
				if (typeof(options.styles) === 'object') {
					for (i = 0; i < options.styles.length; i += 1) {
						editableOption.append(options.styles[i]);
					}
				}

				// insert created element on correct position
				if ($(this).children().eq(options.position).length !== 0) {
					$(this).children().eq(options.position).before(editableOption);
				} else {
					$(this).append(editableOption);
				}
			}

			// special keys codes
			specialKeys = [46, 37, 38, 39, 40];

			// returns key code
			getKeyCode = function (event) {
				if (typeof(event.charCode) !== 'undefined' && event.charCode !== 0) {
					return event.charCode;
				} else {
					return event.keyCode;
				}
			};

			// sets editable option to the value of currently selected option
			setEditableOption = function (elem) {
				elem.children('option.' + options.pluginClass).val(elem.children('option:selected').text());
			};

			// handles keys pressed on select (backspace and delete must be handled
			// in keydown event in order to work in IE)
			$(this).keydown(function (event) {

				var keyCode, option, value;

				keyCode = getKeyCode(event);
				lastKeyCode = keyCode;

				switch (keyCode) {
				case 8:	// backspace
				case 46: // delete
					option = $(this).children('option.' + options.pluginClass);
					if (option.val().length >= 1) {
						value = option.val().substring(0, option.val().length - 1);
						option.val(value).text(value).attr('selected', 'selected');
					}
					return (keyCode !== 8);
				default:
					break;
				}
			});

			// handles the rest of the keys (keypress event gives more informations
			// about pressed keys)
			$(this).keypress(function (event) {

				var keyCode, keyValue, i, option, value, validKey;

				keyCode = getKeyCode(event);

				if (keyCode !== 9) {
					// handle special keys
					for (i = 0; i < specialKeys.length; i += 1) {
						if (keyCode === specialKeys[i] && keyCode === lastKeyCode) {
							return;
						}
					}

					// don't handle ignored keys
					if (options.ignoredKeys.indexOf(keyCode) === -1) {
						// remove selection from all options
						$(this).children(':selected').removeAttr('selected');

						keyValue = '';
						// iterate through valid ranges
						for (validKey in options.acceptedRanges) {
							// the range can be either a min,max tuple or exact value
							if ((typeof(options.acceptedRanges[validKey].exact) !== 'undefined' &&
									options.acceptedRanges[validKey].exact === keyCode) ||
								(typeof(options.acceptedRanges[validKey].min) !== 'undefined' &&
									typeof(options.acceptedRanges[validKey].max) !== 'undefined' &&
									keyCode >= options.acceptedRanges[validKey].min &&
									keyCode <= options.acceptedRanges[validKey].max)) {
								keyValue = String.fromCharCode(keyCode);
							}
						}

						// add key value to proper option tag
						option = $(this).children('option.' + options.pluginClass);
						value = option.val() + keyValue;
						option.val(value).text(value).attr('selected', 'selected');
					}
				}
				
				return false;
			});

			// handles 'useExistingOptions = true' behavior
			if (options.useExistingOptions) {
				setEditableOption($(this));
				$(this).change(function () {
					setEditableOption($(this));
				});
			}
		});
	};

})(jQuery);