/**
 * jQuery jEC (jQuery Editable Combobox) 1.0.0
 * http://code.google.com/p/jquery-jec
 * http://plugins.jquery.com/project/jEC
 *
 * Copyright (c) 2008-2009 Lukasz Rajchel (lukasz@rajchel.pl | http://lukasz.rajchel.pl)
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
			focusOnNewOption: false,
			useExistingOptions: false,
			ignoredKeys: [],
			acceptedRanges: [
				{min: 32, max: 126},
				{min: 191, max: 382}
			]
		},
		
		// options
		options: {},
		
		// values
		values: {},
		
		// check if object is an array
		isArray: function (object) {
			return object !== null && typeof(object) === 'object' && 
				typeof(object.length) === 'number';
		},
		
		// check if value is an integer
		isInteger: function (number) {
			return typeof(number) === 'number' && Math.ceil(number) === Math.floor(number);
		},
		
		// register indexOf method on browsers that doesn't support it (IE)
		registerIndexOf: function () {
			if (Array.prototype.indexOf === undefined) {
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
		
		// clone object
		clone: function (obj) {
			if (obj === null || typeof(obj) !== 'object') {
				return obj;
			}
			
			var key, temp = new obj.constructor();
			
			for (key in obj) {
				if (key !== undefined) {
					temp[key] = $.jecCore.clone(obj[key]);
				}
			}
			
			return temp;
		},
		
		// returns key code
		getKeyCode: function (event) {
			if (event.charCode !== undefined && event.charCode !== 0) {
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
			var options = $.jecCore.options['id' + elem.attr('jec')];
			elem.children('option.' + options.pluginClass).val(elem.children('option:selected').text());
		},
		
		// find unique identifier
		generateId: function () {
			while (true) {
				var random = Math.floor(Math.random() * 100000);
				
				if ($.jecCore.options['id' + random] === undefined) {
					return random;
				}
			}
		},
		
		// keydown event handler
		// handles keys pressed on select (backspace and delete must be handled
		// in keydown event in order to work in IE)
		jecKeyDown: function (event) {
			var keyCode, option, value, options;
	
			options = $.jecCore.options['id' + $(this).attr('jec')];
			keyCode = $.jecCore.getKeyCode(event);
			$.jecCore.lastKeyCode = keyCode;

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
		},
		
		// keypress event handler
		// handles the rest of the keys (keypress event gives more informations
		// about pressed keys)
		jecKeyPress: function (event) {
			var keyCode, keyValue, i, option, value, validKey, options;
	
			options = $.jecCore.options['id' + $(this).attr('jec')];
			keyCode = $.jecCore.getKeyCode(event);

			if (keyCode !== 9) {
				// handle special keys
				for (i = 0; i < $.jecCore.specialKeys.length; i += 1) {
					if (keyCode === $.jecCore.specialKeys[i] && keyCode === $.jecCore.lastKeyCode) {
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
						if ((options.acceptedRanges[validKey].exact !== undefined &&
								options.acceptedRanges[validKey].exact === keyCode) ||
							(options.acceptedRanges[validKey].min !== undefined &&
								options.acceptedRanges[validKey].max !== undefined &&
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
				
				return false;
			}
		},
		
		// change event handler
		jecChange: function () {
			$.jecCore.setEditableOption($(this));
		},
		
		// sets combobox
		setup: function (elem) {
			var options, editableOption, i, key;
			options = $.jecCore.options['id' + elem.attr('jec')];
			
			if (options !== undefined) {
				// add editable option tag if not exists
				if (elem.children(options.pluginClass).length === 0) {
					editableOption = $(document.createElement('option'));
					editableOption.addClass(options.pluginClass);
	
					// add passed CSS classes
					if (typeof(options.classes) === 'string') {
						editableOption.addClass(options.classes);
					} else if (typeof(options.classes) === 'object' && $.jecCore.isArray(options.classes)) {
						for (i = 0; i < options.classes.length; i += 1) {
							editableOption.addClass(options.classes[i]);
						}
					}
	
					// add passed CSS styles
					if (typeof(options.styles) === 'object' && !($.jecCore.isArray(options.styles))) {
						for (key in options.styles) {
							if (options.styles[key] !== null && options.styles[key] !== undefined) {
								editableOption.css(key, options.styles[key]);
							}
						}
					}
	
					// insert created element on correct position
					if (elem.children().eq(options.position).length !== 0) {
						elem.children().eq(options.position).before(editableOption);
					} else {
						elem.append(editableOption);
					}
					
					// handle new option's focus
					if (options.focusOnNewOption) {
						editableOption.attr('selected', 'selected');
					}
				}
	
				elem.bind('keydown', $.jecCore.jecKeyDown);
				elem.bind('keypress', $.jecCore.jecKeyPress);
	
				// handles 'useExistingOptions = true' behavior
				if (options.useExistingOptions) {
					$.jecCore.setEditableOption(elem);
					elem.bind('change', $.jecCore.jecChange);
				}
			}
		},
	
		// create editable combobox
		init: function (settings) {
	
			$.jecCore.registerIndexOf();
	
			return $(this).filter('select:not([jec])').each(function () {
	
				var random, id, key;
				random = $.jecCore.generateId();
				id = 'id' + random;
			
				// override passed default options
				$.jecCore.options[id] = $.jecCore.clone($.jecCore.defaults);
				
				if (settings !== null && typeof(settings) === 'object') {
					for (key in settings) {
						if (settings[key] !== null && settings[key] !== undefined) {
							switch (key) {
							case 'position':
								if ($.jecCore.isInteger(settings[key])) {
									$.jecCore.options[id][key] = settings[key];
								}
								break;
							case 'pluginClass':
								if (typeof (settings[key]) === 'string') {
									$.jecCore.options[id][key] = settings[key];
								}
								break;
							case 'classes':
								if (typeof (settings[key]) === 'string' || $.jecCore.isArray(settings[key])) {
									$.jecCore.options[id][key] = settings[key];
								}
								break;
							case 'styles':
								if (typeof (settings[key]) === 'object' && !($.jecCore.isArray(settings[key]))) {
									$.jecCore.options[id][key] = settings[key];
								}
								break;
							case 'focusOnNewOption':
							case 'useExistingOptions':
								if (typeof (settings[key]) === 'boolean') {
									$.jecCore.options[id][key] = settings[key];
								}
								break;
							case 'ignoredKeys':
							case 'acceptedRanges':
								if ($.jecCore.isArray(settings[key])) {
									$.jecCore.options[id][key] = settings[key];
								}
								break;
							}
						}
					}
				}
				
				// add unique id
				$(this).attr('jec', random);
	
				$.jecCore.setup($(this));
			});
		},
		
		// destroys editable combobox
		destroy: function () {
			return $(this).filter('select[jec]').each(function () {
				$(this).jecOff();
				$(this).removeAttr('jec');
			});
		},
		
		// enable editablecombobox
		enable: function () {
			return $(this).filter('select[jec]').each(function () {
				$.jecCore.setup($(this));
				var value = $.jecCore.values['id' + $(this).attr('jec')];
				
				if (value !== undefined) {
					$(this).jecValue(value);
				}
			});
		},
		
		// disable editable combobox
		disable: function () {
			return $(this).filter('select[jec]').each(function () {
				var id, options;
				id = 'id' + $(this).attr('jec');
				options = $.jecCore.options[id];
				$.jecCore.values[id] = $(this).children('option.' + options.pluginClass).val();
				
				$(this).children('option.' + options.pluginClass).remove();
				$(this).children('option:first').attr('selected', 'selected');
				$(this).unbind('keydown', $.jecCore.jecKeyDown);
				$(this).unbind('keypress', $.jecCore.jecKeyPress);
				
				if (options !== null && options.useExistingOptions) {
					$(this).unbind('change', $.jecCore.jecChange);
				}
			});
		},
		
		// gets or sets editable option's value
		value: function (value, setFocus) {
			var options = $.jecCore.options['id' + $(this).attr('jec')];
			
			if (value === undefined || value === null) {
				// get value
				return $(this).children('option.' + options.pluginClass).val();
			} else if (typeof(value) === 'string' || typeof(value) === 'number') {
				// set value
				return $(this).filter('select').each(function () {
					var option = $(this).children('option.' + options.pluginClass);
					option.val(value).text(value);
					if (typeof(setFocus) !== 'boolean' || setFocus) {
						option.attr('selected', 'selected');
					}
				});
			}
		}
	};

 	// register jQuery functions
	$.fn.extend({
		jec: $.jecCore.init,
		jecOn: $.jecCore.enable,
		jecOff: $.jecCore.disable,
		jecKill: $.jecCore.destroy,
		jecValue: $.jecCore.value
	});

})(jQuery);