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
	$.jEC = (function () {
		// variables declaration
		var defaults, options, values, specialKeys, lastKeyCode, Validators, Hacks, EventHandlers,
			Combobox, clone, typeOf;
		
		// default options
		defaults = {
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
		};
		
		// options
		options = {};
		
		// values
		values = {};
		
		// special keys codes
		specialKeys = [46, 37, 38, 39, 40];
		
		// last presses key's code
		lastKeyCode = null;
		
		// returns type of value
		typeOf = function (value) {
			var type = typeof value;
			if (type === 'object') {
				if (value === null) {
					type = 'null';
				} else if (typeof value.length === 'number' &&
					typeof value.splice === 'function' &&
					!(value.propertyIsEnumerable('length'))) {
					type = 'array';
				}
			}
			return type;
		};
		
		// clone object
		clone = function (object) {
			if (typeOf(object) !== 'object') {
				return object;
			}
			
			var key, temp = new object.constructor();
			
			for (key in object) {
				if (key !== undefined) {
					temp[key] = clone(object[key]);
				}
			}
			
			return temp;
		};
		
		// validator methods
		(Validators = function () {
			var int, empty;
			// check if value is empty (null, undefined, empty array or object)
			empty = function (value) {
				switch (typeOf(value)) {
				case 'object':
					var key;
					for (key in value) {
						if (value[key] !== undefined) {
							return false;
						}
					}
					break;
				case 'array':
					return value.length === 0;
				case 'undefined':
				case 'null':
					return true;
				}
				return false;
			};
			
			// check if value is an integer
			int = function (value) {
				return typeOf(value) === 'number' && Math.ceil(value) === Math.floor(value);
			};
			
			// Validators public members
			return {
				int		: int,
				empty	: empty
			};
		}());
		
		// browser hacks
		(Hacks = function () {
			var registerIndexOf;
			
			// register indexOf method on browsers that doesn't support it
			registerIndexOf = function () {
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
			};
			
			// Hacks public members
			return {
				registerIndexOf	: registerIndexOf
			};
		}());
		
		// event handlers
		(EventHandlers = function () {
			var getKeyCode, keyDown, keyPress, change;
			
			// returns key code
			getKeyCode = function (event) {
				if (event.charCode !== undefined && event.charCode !== 0) {
					return event.charCode;
				} else {
					return event.keyCode;
				}
			};
			
			// keydown event handler
			// handles keys pressed on select (backspace and delete must be handled
			// in keydown event in order to work in IE)
			keyDown = function (event) {
				var keyCode, option, value, opt;
				
				opt = options[$(this).attr('jec')];
				keyCode = getKeyCode(event);
				lastKeyCode = keyCode;
				
				switch (keyCode) {
				case 8:	// backspace
				case 46: // delete
					option = $(this).children('option.' + opt.pluginClass);
					if (option.val().length >= 1) {
						value = option.val().substring(0, option.val().length - 1);
						option.val(value).text(value).attr('selected', 'selected');
					}
					return (keyCode !== 8);
				default:
					break;
				}
			};
			
			// keypress event handler
			// handles the rest of the keys (keypress event gives more informations
			// about pressed keys)
			keyPress = function (event) {
				var keyCode, keyValue, i, option, value, validKey, opt;
				
				opt = options[$(this).attr('jec')];
				keyCode = getKeyCode(event);
				
				if (keyCode !== 9) {
					// handle special keys
					for (i = 0; i < specialKeys.length; i += 1) {
						if (keyCode === specialKeys[i] &&
							keyCode === lastKeyCode) {
							return;
						}
					}
					
					// don't handle ignored keys
					if (opt.ignoredKeys.indexOf(keyCode) === -1) {
						// remove selection from all options
						$(this).children(':selected').removeAttr('selected');
						
						keyValue = '';
						// iterate through valid ranges
						for (validKey in opt.acceptedRanges) {
							// the range can be either a min,max tuple or exact value
							if ((opt.acceptedRanges[validKey].exact !== undefined &&
									opt.acceptedRanges[validKey].exact === keyCode) ||
								(opt.acceptedRanges[validKey].min !== undefined &&
									opt.acceptedRanges[validKey].max !== undefined &&
									keyCode >= opt.acceptedRanges[validKey].min &&
									keyCode <= opt.acceptedRanges[validKey].max)) {
								keyValue = String.fromCharCode(keyCode);
							}
						}
						
						// add key value to proper option tag
						option = $(this).children('option.' + opt.pluginClass);
						value = option.val() + keyValue;
						option.val(value).text(value).attr('selected', 'selected');
					}
					
					return false;
				}
			};
			
			// change event handler
			change = function () {
				Combobox.setEditableOption($(this));
			};
			
			// EventHandlers public members
			return {
				keyDown: keyDown,
				keyPress: keyPress,
				change: change
			};
		}());
		
		// Combobox
		(Combobox = function () {
			var generateId, setup, setParam, setEditableOption, init, destroy, enable, disable,
				value, pref;
			
			// find unique identifier
			generateId = function () {
				while (true) {
					var random = Math.floor(Math.random() * 100000);
					
					if (options[random] === undefined) {
						return random;
					}
				}
			};
			
			// sets combobox
			setup = function (elem) {
				var opt, editableOption, i, key;
				opt = options[elem.attr('jec')];
				
				if (opt !== undefined) {
					// add editable option tag if not exists
					if (elem.children(opt.pluginClass).length === 0) {
						editableOption = $(document.createElement('option'));
						editableOption.addClass(opt.pluginClass);
						
						// add passed CSS classes
						if (typeOf(opt.classes) === 'string') {
							editableOption.addClass(opt.classes);
						} else if (typeOf(opt.classes) === 'array') {
							for (i = 0; i < opt.classes.length; i += 1) {
								editableOption.addClass(opt.classes[i]);
							}
						}
						
						// add passed CSS styles
						if (typeOf(opt.styles) === 'object') {
							for (key in opt.styles) {
								if (!(Validators.empty(opt.styles[key]))) {
									editableOption.css(key, opt.styles[key]);
								}
							}
						}
						
						// insert created element on correct position
						if (elem.children().eq(opt.position).length !== 0) {
							elem.children().eq(opt.position).before(editableOption);
						} else {
							elem.append(editableOption);
						}
						
						// handle new option's focus
						if (opt.focusOnNewOption) {
							editableOption.attr('selected', 'selected');
						}
					}
					
					elem.bind('keydown', EventHandlers.keyDown);
					elem.bind('keypress', EventHandlers.keyPress);
					
					// handles 'useExistingOptions = true' behavior
					if (opt.useExistingOptions) {
						Combobox.setEditableOption(elem);
						elem.bind('change', EventHandlers.change);
					}
				}
			};
			
			// set parameter value
			setParam = function (id, name, value, update) {
				if (typeOf(update) !== 'boolean') {
					update = false;
				}
				
				if (!(Validators.empty(id)) && !(Validators.empty(name)) && 
					!(Validators.empty(value))) {
					var opt, i, temp;
					opt = options[id];
					if (opt !== undefined) {
						switch (name) {
						case 'position':
							if (Validators.int(value)) {
								// update combobox
								if (update && opt[name] !== value) {
									temp = $('select[jec=' + id + '] option.' + opt[name]);
									if ($('select[jec=' + id + ']').children().eq(value) !== 0) {
										$('select[jec=' + id + ']').children().eq(value).
											before(temp);
									} else {
										$('select[jec=' + id + ']').append(temp);
									}
								}
								
								// save new value
								opt[name] = value;
							}
							break;
						case 'pluginClass':
							if (typeOf(value) === 'string') {
								// update combobox
								if (update) {
									$('select[jec=' + id + '] option.' + opt[name]).
										removeClass(opt[name]).addClass(value);
								}
								
								// save new value
								opt[name] = value;
							}
							break;
						case 'classes':
							if (typeOf(value) === 'string') {
								value = [value];
							}
							if (typeOf(value) === 'array') {
								// update combobox
								if (update) {
									// remove old classes
									for (i = 0; i < opt[name].length; i += 1) {
										$('select[jec=' + id + ']').removeClass(opt[name][i]);
									}
									
									// add new classes
									for (i = 0; i < value.length; i += 1) {
										$('select[jec=' + id + ']').addClass(value[i]);
									}
								}
								
								// save new value
								opt[name] = value;
							}
							break;
						case 'styles':
							if (typeOf(value) === 'object') {
								// update combobox
								if (update) {
									// remove old styles
									for (temp in opt[name]) {
										if (!(Validators.empty(opt[name][temp]))) {
											$('select[jec=' + id + '] option.' + opt.pluginClass).
												css(temp, '');
										}
									}
									
									// add new styles
									for (temp in value) {
										if (!(Validators.empty(value[temp]))) {
											$('select[jec=' + id + '] option.' + opt.pluginClass).
												css(temp, value[temp]);
										}
									}
								}
								
								// save new value
								opt[name] = value;
							}
							break;
						case 'focusOnNewOption':
							if (typeOf(value) === 'boolean') {
								opt[name] = value;
							}
							break;
						case 'useExistingOptions':
							if (typeOf(value) === 'boolean') {
								// update combobox
								if (update && value !== opt[name]) {
									temp = $('select[jec=' + id + ']');
									if (value) {
										Combobox.setEditableOption(temp);
										temp.bind('change', EventHandlers.change);
									} else {
										temp.unbind('change', EventHandlers.change);
									}
								}
								
								// save new value
								opt[name] = value;
							}
							break;
						case 'ignoredKeys':
							if (typeOf(value) === 'array') {
								temp = [];
								for (i = 0; i < value.length; i += 1) {
									if (Validators.int(value[i])) {
										temp[temp.length] = value[i];
									}
								}
								
								// save new value
								opt[name] = temp;
							}
							break;
						case 'acceptedRanges':
							if (typeOf(value) === 'array') {
								temp = [];
								for (i = 0; i < value.length; i += 1) {
									if (typeOf(value[i]) === 'object' &&
										((!(Validators.empty(value[i].min)) && 
											!(Validators.empty(value[i].max)) &&
											Validators.int(value[i].min) &&
											Validators.int(value[i].max)) ||
										(!(Validators.empty(value[i].exact)) &&
											Validators.int(value[i].exact)))) {
										temp[temp.length] = value[i];
									}
								}
								
								// save new value
								opt[name] = temp;
							}
							break;
						}
					}
				}
			};
			
			// sets editable option to the value of currently selected option
			setEditableOption = function (elem) {
				var opt = options[elem.attr('jec')];
				elem.children('option.' + opt.pluginClass).
					val(elem.children('option:selected').text());
			};
			
			// create editable combobox
			init = function (settings) {
				Hacks.registerIndexOf();
				
				return $(this).filter(':uneditable').each(function () {
					var id, key;
					id = 'id' + generateId();
					
					// override passed default options
					options[id] = clone(defaults);
					
					if (typeOf(settings) === 'object') {
						for (key in settings) {
							if (settings[key] !== undefined) {
								setParam(id, key, settings[key]);
							}
						}
					}
					
					// add unique id
					$(this).attr('jec', id);
					
					setup($(this));
				});
			};
			
			// destroys editable combobox
			destroy = function () {
				return $(this).filter(':editable').each(function () {
					$(this).jecOff();
					$(this).removeAttr('jec');
				});
			};
			
			// enable editablecombobox
			enable = function () {
				return $(this).filter(':editable').each(function () {
					setup($(this));
					var value = values[$(this).attr('jec')];
					
					if (value !== undefined) {
						$(this).jecValue(value);
					}
				});
			};
			
			// disable editable combobox
			disable = function () {
				return $(this).filter(':editable').each(function () {
					var id, opt;
					id = $(this).attr('jec');
					opt = options[id];
					values[id] = $(this).children('option.' + opt.pluginClass).val();
					
					$(this).children('option.' + opt.pluginClass).remove();
					$(this).children('option:first').attr('selected', 'selected');
					$(this).unbind('keydown', EventHandlers.keyDown);
					$(this).unbind('keypress', EventHandlers.keyPress);
					
					if (opt.useExistingOptions) {
						$(this).unbind('change', EventHandlers.change);
					}
				});
			};
			
			// gets or sets editable option's value
			value = function (value, setFocus) {
				if ($(this).filter(':editable').length > 0) {
					var opt = options[$(this).attr('jec')];
					if (Validators.empty(value)) {
						// get value
						return $(this).filter('select').children('option.' + opt.pluginClass).
							val();
					} else if (typeOf(value) === 'string' || typeOf(value) === 'number') {
						// set value
						return $(this).filter('select').each(function () {
							var option = $(this).children('option.' + opt.pluginClass);
							option.val(value).text(value);
							if (typeOf(setFocus) !== 'boolean' || setFocus) {
								option.attr('selected', 'selected');
							}
						});
					}
				}
			};
			
			// gets or sets editable option's preference
			pref = function (name, value) {
				if ($(this).filter(':editable').length > 0) {
					if (!(Validators.empty(name))) {
						if (Validators.empty(value)) {
							// get preference
							return options[$(this).attr('jec')][name];
						} else {
							// set preference
							return $(this).filter('select').each(function () {
								setParam($(this).attr('jec'), name, value, true);
							});
						}
					}
				}
			};
			
			// Combobox public members
			return {
				init				: init,
				destroy				: destroy,
				enable				: enable,
				disable				: disable,
				value				: value,
				pref				: pref,
				setEditableOption	: setEditableOption
			};
		}());
		
		// jEC public members
		return {
			init	: Combobox.init,
			enable	: Combobox.enable,
			disable	: Combobox.disable,
			destroy	: Combobox.destroy,
			value	: Combobox.value,
			pref	: Combobox.pref
		};
	}());

 	// register functions
	$.fn.extend({
		jec			: $.jEC.init,
		jecOn		: $.jEC.enable,
		jecOff		: $.jEC.disable,
		jecKill		: $.jEC.destroy,
		jecValue	: $.jEC.value,
		jecPref		: $.jEC.pref
	});
	
	// register selectors
	$.extend($.expr[':'], {
		editable	: function (a) {
			return $(a).filter('select[jec]').length !== 0;
		},
		uneditable	: function (a) {
			return $(a).filter('select:not([jec])').length !== 0;
		}
	});

}(jQuery));