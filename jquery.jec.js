/**
 * jQuery jEC (jQuery Editable Combobox) 1.1.0
 * http://code.google.com/p/jquery-jec
 *
 * Copyright (c) 2008-2009 Lukasz Rajchel (lukasz@rajchel.pl | http://lukasz.rajchel.pl)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Documentation	:	http://code.google.com/p/jquery-jec/wiki/Documentation
 * Changelog		:	http://code.google.com/p/jquery-jec/wiki/Changelog
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
			acceptedKeys: [
				{min: 32, max: 126},
				{min: 191, max: 382}
			]
		};
		
		// options
		options = {};
		
		// values
		values = {};
		
		// special keys codes
		specialKeys = [37, 38, 39, 40, 46];
		
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
			// register indexOf method on browsers that doesn't support it
			var registerIndexOf = function () {
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
				
				opt = options[Combobox.getId($(this))];
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
				var keyCode, i, option, value, opt;
				
				opt = options[Combobox.getId($(this))];
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
						
						if (opt.acceptedKeys.indexOf(keyCode) !== -1) {
							option = $(this).children('option.' + opt.pluginClass);
							value = option.val() + String.fromCharCode(keyCode);
							option.val(value).text(value).attr('selected', 'selected');
						}
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
			var Parameters, generateId, setup, setEditableOption, init, destroy, enable, disable,
				value, pref, getId;
			
			// find unique identifier
			generateId = function () {
				while (true) {
					var random = Math.floor(Math.random() * 100000);
					
					if (options[random] === undefined) {
						return random;
					}
				}
			};
			
			// get combobox id
			getId = function (elem) {
				return elem.attr('class').match(/jec\d+/);
			};
			
			// validates and set combobox parameters
			(Parameters = function () {
				var set, setPosition, setPluginClass, setClasses, setStyles, setFocusOnNewOption,
					setUseExistingOptions, setIgnoredKeys, setAcceptedKeys, parseKeys;
				
				// set position
				setPosition = function (opt, id, value, update) {
					if (Validators.int(value)) {
						// update combobox
						if (update && opt.position !== value) {
							var temp = $('select[jec=' + id + '] option.' + opt.pluginClass);
							if ($('select[jec=' + id + ']').children().eq(value) !== 0) {
								$('select[jec=' + id + ']').children().eq(value).
									before(temp);
							} else {
								$('select[jec=' + id + ']').append(temp);
							}
						}
						
						// save new value
						opt.position = value;
					}
				};
				
				// set plugin class
				setPluginClass = function (opt, id, value, update) {
					if (typeOf(value) === 'string') {
						// update combobox
						if (update) {
							$('select[jec=' + id + '] option.' + opt.pluginClass).
								removeClass(opt.pluginClass).addClass(value);
						}
						
						// save new value
						opt.pluginClass = value;
					}
				};
				
				// set classes
				setClasses = function (opt, id, value, update) {
					// convert string value to array
					if (typeOf(value) === 'string') {
						value = [value];
					}
					
					if (typeOf(value) === 'array') {
						// update combobox
						if (update) {
							var i;
							
							// remove old classes
							for (i = 0; i < opt.classes.length; i += 1) {
								$('select[jec=' + id + ']').removeClass(opt.classes[i]);
							}
							
							// add new classes
							for (i = 0; i < value.length; i += 1) {
								$('select[jec=' + id + ']').addClass(value[i]);
							}
						}
						
						// save new value
						opt.classes = value;
					}
				};
				
				// set styles
				setStyles = function (opt, id, value, update) {
					if (typeOf(value) === 'object') {
						// update combobox
						if (update) {
							var style;
							
							// remove old styles
							for (style in opt.styles) {
								if (!(Validators.empty(opt.styles[style]))) {
									$('select[jec=' + id + '] option.' + opt.pluginClass).
										css(style, '');
								}
							}
							
							// add new styles
							for (style in value) {
								if (!(Validators.empty(value[style]))) {
									$('select[jec=' + id + '] option.' + opt.pluginClass).
										css(style, value[style]);
								}
							}
						}
						
						// save new value
						opt.styles = value;
					}
				};
				
				// set focusOnNewOption
				setFocusOnNewOption = function (opt, id, value) {
					if (typeOf(value) === 'boolean') {
						opt.focusOnNewOption = value;
					}
				};
				
				// set useExistingOptions
				setUseExistingOptions = function (opt, id, value, update) {
					if (typeOf(value) === 'boolean') {
						// update combobox
						if (update && value !== opt.useExistingOptions) {
							var select = $('select[jec=' + id + ']');
							if (value) {
								Combobox.setEditableOption(select);
								select.bind('change', EventHandlers.change);
							} else {
								select.unbind('change', EventHandlers.change);
							}
						}
						
						// save new value
						opt.useExistingOptions = value;
					}
				};
				
				// parse keys collection
				parseKeys = function (value) {
					var i, j, keys = [];
					if (typeOf(value) === 'array') {
						for (i = 0; i < value.length; i += 1) {
							// min,max tuple
							if (typeOf(value[i]) === 'object' && !(Validators.empty(value[i].min)) && 
								!(Validators.empty(value[i].max)) &&
								Validators.int(value[i].min) && Validators.int(value[i].max) &&
								value[i].min <= value[i].max) {
								for (j = value[i].min; j <= value[i].max; j += 1) {
									keys[keys.length] = j;
								}
							// exact tuple
							} else if (typeOf(value[i]) === 'object' && 
								!(Validators.empty(value[i].exact)) && Validators.int(value[i].exact)) {
								keys[keys.length] = value[i].exact;
							// number
							} else if (typeOf(value[i]) === 'number' && Validators.int(value[i])) {
								keys[keys.length] = value[i];
							}
						}
					}
					return keys;
				};
				
				// set ignored keys
				setIgnoredKeys = function (opt, id, value) {
					if (typeOf(value) === 'array') {
						// save new value
						opt.ignoredKeys = parseKeys(value);
					}
				};
				
				// set accepted keys
				setAcceptedKeys = function (opt, id, value) {
					if (typeOf(value) === 'array') {
						// save new value
						opt.acceptedKeys = parseKeys(value);
					}
				};
				
				// set parameter
				set = function (id, name, value, update) {
					if (typeOf(update) !== 'boolean') {
						update = false;
					}
					
					if (!(Validators.empty(id)) && !(Validators.empty(name)) && 
						!(Validators.empty(value))) {
						var opt = options[id];
						if (opt !== undefined) {
							switch (name) {
							case 'position':
								setPosition(opt, id, value, update);
								break;
							case 'pluginClass':
								setPluginClass(opt, id, value, update);
								break;
							case 'classes':
								setClasses(opt, id, value, update);
								break;
							case 'styles':
								setStyles(opt, id, value, update);
								break;
							case 'focusOnNewOption':
								setFocusOnNewOption(opt, id, value);
								break;
							case 'useExistingOptions':
								setUseExistingOptions(opt, id, value);
								break;
							case 'ignoredKeys':
								setIgnoredKeys(opt, id, value);
								break;
							case 'acceptedKeys':
								setAcceptedKeys(opt, id, value);
								break;
							}
						}
					}
				};
				
				return {
					set: set
				};
			}());
			
			// sets combobox
			setup = function (elem) {
				var opt, editableOption, i, key;
				opt = options[Combobox.getId(elem)];
				
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
			
			// sets editable option to the value of currently selected option
			setEditableOption = function (elem) {
				elem.children('option.' + options[Combobox.getId(elem)].pluginClass).
					val(elem.children('option:selected').text());
			};
			
			// create editable combobox
			init = function (settings) {
				Hacks.registerIndexOf();
				
				return $(this).filter(':uneditable').each(function () {
					var id, key;
					id = 'jec' + generateId();
					
					// override passed default options
					options[id] = clone(defaults);
					
					// parse keys
					Parameters.set(id, 'ignoredKeys', options[id].ignoredKeys);
					Parameters.set(id, 'acceptedKeys', options[id].acceptedKeys);
					
					if (typeOf(settings) === 'object') {
						for (key in settings) {
							if (settings[key] !== undefined) {
								Parameters.set(id, key, settings[key]);
							}
						}
					}
					
					// add unique id to classes
					$(this).addClass(id);
					
					setup($(this));
				});
			};
			
			// destroys editable combobox
			destroy = function () {
				return $(this).filter(':editable').each(function () {
					$(this).jecOff();
					$(this).removeClass(Combobox.getId($(this)));
				});
			};
			
			// enable editablecombobox
			enable = function () {
				return $(this).filter(':editable').each(function () {
					setup($(this));
					var value = values[Combobox.getId($(this))];
					
					if (value !== undefined) {
						$(this).jecValue(value);
					}
				});
			};
			
			// disable editable combobox
			disable = function () {
				return $(this).filter(':editable').each(function () {
					var id, opt;
					id = Combobox.getId($(this));
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
					var opt = options[Combobox.getId($(this))];
					if (Validators.empty(value)) {
						// get value
						return $(this).filter('select').children('option.' + opt.pluginClass).
							val();
					} else if (typeOf(value) === 'string' || typeOf(value) === 'number') {
						// set value
						return $(this).filter(':editable').each(function () {
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
							return options[Combobox.getId($(this))][name];
						} else {
							// set preference
							return $(this).filter(':editable').each(function () {
								Parameters.set(Combobox.getId($(this)), name, value, true);
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
				setEditableOption	: setEditableOption,
				getId				: getId
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
			return $(a).filter('select[class*=jec]').length !== 0;
		},
		uneditable	: function (a) {
			return $(a).filter('select:not([class*=jec])').length !== 0;
		}
	});

}(jQuery));