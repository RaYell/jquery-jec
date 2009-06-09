/**
 * jQuery jEC (jQuery Editable Combobox) 1.1.0
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
				typeof(object.length) === 'number' && typeof(object.splice) === 'function' &&
				!(object.propertyIsEnumerable('length'));
		},
		
		// check if value is an integer
		isInteger: function (number) {
			return typeof(number) === 'number' && Math.ceil(number) === Math.floor(number);
		},
		
		// register indexOf method on browsers that doesn't support it
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
		
		// last presses key's code
		lastKeyCode: null,
		
		// sets editable option to the value of currently selected option
		setEditableOption: function (elem) {
			var options = $.jecCore.options[elem.attr('jec')];
			elem.children('option.' + options.pluginClass).
                val(elem.children('option:selected').text());
		},
		
		// find unique identifier
		generateId: function () {
			while (true) {
				var random = Math.floor(Math.random() * 100000);
				
				if ($.jecCore.options[random] === undefined) {
					return random;
				}
			}
		},
		
		// keydown event handler
		// handles keys pressed on select (backspace and delete must be handled
		// in keydown event in order to work in IE)
		jecKeyDown: function (event) {
			var keyCode, option, value, options;
	
			options = $.jecCore.options[$(this).attr('jec')];
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
	
			options = $.jecCore.options[$(this).attr('jec')];
			keyCode = $.jecCore.getKeyCode(event);

			if (keyCode !== 9) {
				// handle special keys
				for (i = 0; i < $.jecCore.specialKeys.length; i += 1) {
					if (keyCode === $.jecCore.specialKeys[i] && 
						keyCode === $.jecCore.lastKeyCode) {
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
			options = $.jecCore.options[elem.attr('jec')];
			
			if (options !== undefined) {
				// add editable option tag if not exists
				if (elem.children(options.pluginClass).length === 0) {
					editableOption = $(document.createElement('option'));
					editableOption.addClass(options.pluginClass);
	
					// add passed CSS classes
					if (typeof(options.classes) === 'string') {
						editableOption.addClass(options.classes);
					} else if (typeof(options.classes) === 'object' && 
                        $.jecCore.isArray(options.classes)) {
						for (i = 0; i < options.classes.length; i += 1) {
							editableOption.addClass(options.classes[i]);
						}
					}
	
					// add passed CSS styles
					if (typeof(options.styles) === 'object' && 
                        !($.jecCore.isArray(options.styles))) {
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
		
		// set parameter value
		setParam: function (id, name, value, update) {
			if (typeof(update) !== 'boolean') {
				update = false;
			}
			
			if (id !== undefined && id !== null && name !== undefined && name !== null &&
				value !== undefined && value !== null) {
				var options, i, temp;
				options = $.jecCore.options[id];
				if (options !== undefined) {
					switch (name) {
					case 'position':
						if ($.jecCore.isInteger(value)) {
							// update combobox
							if (update && $.jecCore.options[id][name] !== value) {
								temp = $('select[jec=' + id + '] option.' + 
									$.jecCore.options[id][name]);
								if ($('select[jec=' + id + ']').children().eq(value) !== 0) {
									$('select[jec=' + id + ']').children().eq(value).before(temp);
								} else {
									$('select[jec=' + id + ']').append(temp);
								}
							}
							
							// save new value
							$.jecCore.options[id][name] = value;
						}
						break;
					case 'pluginClass':
						if (typeof(value) === 'string') {
							// update combobox
							if (update) {
								$('select[jec=' + id + '] option.' + $.jecCore.options[id][name]).
									removeClass($.jecCore.options[id][name]).addClass(value);
							}
							
							// save new value
							$.jecCore.options[id][name] = value;
						}
						break;
					case 'classes':
						if (typeof(value) === 'string') {
							value = [value];
						}
						if ($.jecCore.isArray(value)) {
							// update combobox
							if (update) {
								// remove old classes
								for (i = 0; i < $.jecCore.options[id][name].length; i += 1) {
									$('select[jec=' + id + ']').
										removeClass($.jecCore.options[id][name][i]);
								}
								
								// add new classes
								for (i = 0; i < value.length; i += 1) {
									$('select[jec=' + id + ']').addClass(value[i]);
								}
							}
							
							// save new value
							$.jecCore.options[id][name] = value;
						}
						break;
					case 'styles':
						if (typeof(value) === 'object' && !($.jecCore.isArray(value))) {
							// update combobox
							if (update) {
								// remove old styles
								for (temp in $.jecCore.options[id][name]) {
									if ($.jecCore.options[id][name][temp] !== null && 
										$.jecCore.options[id][name][temp] !== undefined) {
										$('select[jec=' + id + '] option.' + 
											$.jecCore.options[id].pluginClass).css(temp, '');
									}
								}
								
								// add new styles
								for (temp in value) {
									if (value[temp] !== null && value[temp] !== undefined) {
										$('select[jec=' + id + '] option.' + 
											$.jecCore.options[id].pluginClass).
											css(temp, value[temp]);
									}
								}
							}
							
							// save new value
							$.jecCore.options[id][name] = value;
						}
						break;
					case 'focusOnNewOption':
						if (typeof(value) === 'boolean') {
							$.jecCore.options[id][name] = value;
						}
						break;
					case 'useExistingOptions':
						if (typeof(value) === 'boolean') {
							// update combobox
							if (update && value !== $.jecCore.options[id][name]) {
								temp = $('select[jec=' + id + ']');
								if (value) {
									$.jecCore.setEditableOption(temp);
									temp.bind('change', $.jecCore.jecChange);
								} else {
									temp.unbind('change', $.jecCore.jecChange);
								}
							}
							
							// save new value
							$.jecCore.options[id][name] = value;
						}
						break;
					case 'ignoredKeys':
						if ($.jecCore.isArray(value)) {
							temp = [];
							for (i = 0; i < value.length; i += 1) {
								if ($.jecCore.isInteger(value[i])) {
									temp[temp.length] = value[i];
								}
							}
							
							// save new value
							$.jecCore.options[id][name] = temp;
						}
						break;
					case 'acceptedRanges':
						if ($.jecCore.isArray(value)) {
							temp = [];
							for (i = 0; i < value.length; i += 1) {
								if (value[i] !== null && typeof(value[i]) === 'object' &&
									!($.jecCore.isArray(value[i])) &&
									((value[i].min !== undefined && value[i].max !== undefined &&
										$.jecCore.isInteger(value[i].min) &&
										$.jecCore.isInteger(value[i].max)) ||
									(value[i].exact !== undefined && 
										$.jecCore.isInteger(value[i].exact)))) {
									temp[temp.length] = value[i];
								}
							}
							
							// save new value
							$.jecCore.options[id][name] = temp;
						}
						break;
					}
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
						if (settings[key] !== undefined) {
							$.jecCore.setParam(id, key, settings[key]);
						}
					}
				}
				
				// add unique id
				$(this).attr('jec', id);
	
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
				var value = $.jecCore.values[$(this).attr('jec')];
				
				if (value !== undefined) {
					$(this).jecValue(value);
				}
			});
		},
		
		// disable editable combobox
		disable: function () {
			return $(this).filter('select[jec]').each(function () {
				var id, options;
				id = $(this).attr('jec');
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
			if ($(this).filter('select[jec]').length > 0) {
				var options = $.jecCore.options[$(this).attr('jec')];
				if (value === undefined || value === null) {
					// get value
					return $(this).filter('select').children('option.' + options.pluginClass).
						val();
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
		},
		
		// gets or sets editable option's preference
		pref: function (name, value) {
			if ($(this).filter('select[jec]').length > 0) {
				if (name !== undefined && name !== null) {
					if (value === undefined || value === null) {
						// get preference
						return $.jecCore.options[$(this).attr('jec')][name];
					} else {
						// set preference
						return $(this).filter('select').each(function () {
							$.jecCore.setParam($(this).attr('jec'), name, value, true);
						});
					}
				}
			}
		}
	};

 	// register jQuery functions
	$.fn.extend({
		jec			: $.jecCore.init,
		jecOn		: $.jecCore.enable,
		jecOff		: $.jecCore.disable,
		jecKill		: $.jecCore.destroy,
		jecValue	: $.jecCore.value,
		jecPref		: $.jecCore.pref
	});

})(jQuery);