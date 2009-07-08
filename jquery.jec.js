/**
 * jQuery jEC (jQuery Editable Combobox) 1.2.0
 * http://code.google.com/p/jquery-jec
 *
 * Copyright (c) 2008-2009 Lukasz Rajchel (lukasz@rajchel.pl | http://lukasz.rajchel.pl)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Documentation	:	http://code.google.com/p/jquery-jec/wiki/Documentation
 * Changelog		:	http://code.google.com/p/jquery-jec/wiki/Changelog
 */

/*global Array, Math, String, clearInterval, document, jQuery, setInterval*/
/*members ":", Handle, Remove, Set, acceptedKeys, addClass, all, append, appendTo, attr, before, 
bind, blur, browser, ceil, change, charCode, children, classes, constructor, createElement, css, 
destroy, disable, each, editable, empty, enable, eq, expr, extend, filter, floor, fn, focus, 
focusOnNewOption, fromCharCode, getId, handleCursor, ignoredKeys, indexOf, init, initJS, int, jEC, 
jec, jecKill, jecOff, jecOn, jecPref, jECTimer, jecValue, keyCode, keyDown, keyPress, length,
match, max, min, msie, optionClasses, optionStyles, position, pref, propertyIsEnumerable, 
prototype, random, registerIndexOf, remove, removeAttr, removeClass, setEditableOption, splice, 
styles, substring, text, unbind, uneditable, useExistingOptions, val, value*/
(function ($) {

	// jEC Core class
	$.jEC = (function () {
		// variables declaration
		var pluginClass = 'jecEditableOption', cursorInterval = 1000, options = {}, values = {}, 
			lastKeyCode, defaults, Validators, Hacks, EventHandlers, Combobox, clone, 
			typeOf, activeCombobox;
		
		// default options
		defaults = {
			position: 0,
			classes: [],
			styles: {},
			optionClasses: [],
			optionStyles: {},
			focusOnNewOption: false,
			useExistingOptions: false,
			ignoredKeys: [],
			acceptedKeys: [
				{min: 32, max: 126},
				{min: 191, max: 382}
			]
		};
		
		// returns type of value
		typeOf = function (value) {
			var type = typeof value;
			if (type === 'object') {
				if (value === null) {
					type = 'null';
				} else if (typeof value.length === 'number' &&
					typeof value.splice === 'function' && !value.propertyIsEnumerable('length')) {
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
			
			var obj = new object.constructor(), key;
			
			for (key in object) {
				if (key !== undefined) {
					obj[key] = clone(object[key]);
				}
			}
			
			return obj;
		};
		
		// validator methods
		Validators = (function () {
			return {
				// check if value is an integer
				int: function (value) {
					return typeOf(value) === 'number' && Math.ceil(value) === Math.floor(value);
				},
				// check if value is empty (null, undefined, empty array or object)
				empty: function (value) {
					switch (typeOf(value)) {
					case 'object':
						for (var key in value) {
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
				}
			};
		}());
		
		// Browser hacks
		Hacks = (function () {
			return {
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
				}
			};
		}());
		
		// event handlers
		EventHandlers = (function () {
			var getKeyCode, clearCursor;
			
			// returns key code
			getKeyCode = function (event) {
				if (event.charCode !== undefined && event.charCode !== 0) {
					return event.charCode;
				} else {
					return event.keyCode;
				}
			};
			
			clearCursor = function (elem) {
				// handle editable cursor
				$(elem).children('option').each(function () {
					$(this).text($(this).val());
				});
			};
			
			// EventHandlers public members
			return {
				/// focus event handler
				/// enabled blinking cursor
				focus: function (event) {
					if ($.jECTimer === undefined && !$.browser.msie) {
						activeCombobox = $(this);
						$.jECTimer = setInterval($.jEC.handleCursor, cursorInterval);
					}
				},
				/// blur event handler
				/// disables blinking cursor
				blur: function (event) {
					if ($.jECTimer !== undefined && !$.browser.msie) {
						clearInterval($.jECTimer);
						$.jECTimer = undefined;
						activeCombobox = undefined;
						clearCursor($(this));
					}
				},
				// keydown event handler
				// handles keys pressed on select (backspace and delete must be handled
				// in keydown event in order to work in IE)
				keyDown: function (event) {
					var keyCode = getKeyCode(event), option, value;
					
					lastKeyCode = keyCode;
					
					switch (keyCode) {
					case 8:	// backspace
					case 46: // delete
						option = $(this).children('option.' + pluginClass);
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
				keyPress: function (event) {
					var keyCode = getKeyCode(event), opt = options[Combobox.getId($(this))], i, 
						option, value, specialKeys;
					
					clearCursor($(this));
					if (keyCode !== 9) {
						// special keys codes
						specialKeys = [37, 38, 39, 40, 46];
						// handle special keys
						for (i = 0; i < specialKeys.length; i += 1) {
							if (keyCode === specialKeys[i] && keyCode === lastKeyCode) {
								return false;
							}
						}
						
						// don't handle ignored keys
						if (opt.ignoredKeys.indexOf(keyCode) === -1) {
							// remove selection from all options
							$(this).children(':selected').removeAttr('selected');
							
							if (opt.acceptedKeys.indexOf(keyCode) !== -1) {
								option = $(this).children('option.' + pluginClass);
								value = option.val() + String.fromCharCode(keyCode);
								option.val(value).text(value).attr('selected', 'selected');
							}
						}
						
						return false;
					}
				},
				// change event handler
				change: function () {
					clearCursor($(this));
					var opt = options[Combobox.getId($(this))];
					if (opt.useExistingOptions) {
						Combobox.setEditableOption($(this));
					}
				}
			};
		}());
		
		// Combobox
		Combobox = (function () {
			var Parameters, EditableOption, generateId, setup;
			
			// validates and set combobox parameters
			Parameters = (function () {
				var Set, Remove, Handle;
					
				(Set = function () {
					var parseKeys = function (value) {
						var i, j, keys = [];
						if (typeOf(value) === 'array') {
							for (i = 0; i < value.length; i += 1) {
								// min,max tuple
								if (typeOf(value[i]) === 'object' && 
									!Validators.empty(value[i].min) &&
									!Validators.empty(value[i].max) &&
									Validators.int(value[i].min) && 
									Validators.int(value[i].max) &&
									value[i].min <= value[i].max) {
									for (j = value[i].min; j <= value[i].max; j += 1) {
										keys[keys.length] = j;
									}
								// number
								} else if (typeOf(value[i]) === 'number' && 
								Validators.int(value[i])) {
									keys[keys.length] = value[i];
								}
							}
						}
						return keys;
					};
					
					return {
						position: function (elem, value) {
							var id = Combobox.getId(elem), opt = options[id], optionsCount;
							if (opt !== undefined && Validators.int(value)) {
								optionsCount = 
									elem.children('option:not(.' + pluginClass + ')').length;
								if (value > optionsCount) {
									value = optionsCount;
								}
								opt.position = value;
							}
						},
						classes: function (elem, value) {
							if (typeOf(value) === 'string') {
								value = [value];
							}
							var id = Combobox.getId(elem), opt = options[id];
							if (opt !== undefined && typeOf(value) === 'array') {
								opt.classes = value;
							}
						},
						optionClasses: function (elem, value) {
							if (typeOf(value) === 'string') {
								value = [value];
							}
							var id = Combobox.getId(elem), opt = options[id];
							if (opt !== undefined && typeOf(value) === 'array') {
								opt.optionClasses = value;
							}
						},
						styles: function (elem, value) {
							var id = Combobox.getId(elem), opt = options[id];
							if (opt !== undefined && typeOf(value) === 'object') {
								opt.styles = value;
							}
						},
						optionStyles: function (elem, value) {
							var id = Combobox.getId(elem), opt = options[id];
							if (opt !== undefined && typeOf(value) === 'object') {
								opt.optionStyles = value;
							}
						},
						focusOnNewOption: function (elem, value) {
							var id = Combobox.getId(elem), opt = options[id];
							if (opt !== undefined && typeOf(value) === 'boolean') {
								opt.focusOnNewOption = value;
							}
						},
						useExistingOptions: function (elem, value) {
							var id = Combobox.getId(elem), opt = options[id];
							if (opt !== undefined && typeOf(value) === 'boolean') {
								opt.useExistingOptions = value;
							}
						},
						ignoredKeys: function (elem, value) {
							var id = Combobox.getId(elem), opt = options[id];
							if (opt !== undefined && typeOf(value) === 'array') {
								opt.ignoredKeys = parseKeys(value);
							}
						},
						acceptedKeys: function (elem, value) {
							var id = Combobox.getId(elem), opt = options[id];
							if (opt !== undefined && typeOf(value) === 'array') {
								opt.acceptedKeys = parseKeys(value);
							}
						}
					};
				}());
				
				Remove = (function () {
					var removeClasses, removeStyles;
					
					removeClasses = function (elem, classes) {
						for (var i = 0; i < classes.length; i += 1) {
							elem.removeClass(classes[i]);
						}
					};
					
					removeStyles = function (elem, styles) {
						for (var style in styles) {
							if (!Validators.empty(styles[style])) {
								elem.css(style, '');
							}
						}
					};
					
					return {
						classes: function (elem) {
							var id = Combobox.getId(elem), opt = options[id];
							if (opt !== undefined) {
								removeClasses(elem, opt.classes);
							}
						},
						optionClasses: function (elem) {
							var id = Combobox.getId(elem), opt = options[id];
							if (opt !== undefined) {
								removeClasses(elem.children('option.' + pluginClass), 
									opt.optionClasses);
							}
						},
						styles: function (elem) {
							var id = Combobox.getId(elem), opt = options[id];
							if (opt !== undefined) {
								removeStyles(elem, opt.styles);
							}
						},
						optionStyles: function (elem) {
							var id = Combobox.getId(elem), opt = options[id];
							if (opt !== undefined) {
								removeStyles(elem.children('option.' + pluginClass),
									opt.optionStyles);
							}
						},
						all: function (elem) {
							Remove.classes(elem);
							Remove.optionClasses(elem);
							Remove.styles(elem);
							Remove.optionStyles(elem);
						}
					};
				}());
				
				Handle = (function () {
					var setClasses, setStyles;
					
					setClasses = function (elem, classes) {
						for (var i = 0; i < classes.length; i += 1) {
							elem.addClass(classes[i]);
						}
					};
					
					setStyles = function (elem, styles) {
						for (var style in styles) {
							if (!Validators.empty(styles[style])) {
								elem.css(style, styles[style]);
							}
						}
					};
					
					return {
						position: function (elem) {
							var id = Combobox.getId(elem), opt = options[id], option, 
								uneditableOptions;
							if (opt !== undefined) {
								option = elem.children('option.' + pluginClass);
								uneditableOptions = 
									elem.children('option:not(.' + pluginClass + ')');
								if (opt.position < uneditableOptions.length) {
									uneditableOptions.eq(opt.position).before(option);
								} else {
									elem.append(option);
								}
							}
						},
						classes: function (elem) {
							var id = Combobox.getId(elem), opt = options[id];
							if (opt !== undefined) {
								setClasses(elem, opt.classes);
							}
						},
						optionClasses: function (elem) {
							var id = Combobox.getId(elem), opt = options[id];
							if (opt !== undefined) {
								setClasses(elem.children('option.' + pluginClass), 
									opt.optionClasses);
							}
						},
						styles: function (elem) {
							var id = Combobox.getId(elem), opt = options[id];
							if (opt !== undefined) {
								setStyles(elem, opt.styles);
							}
						},
						optionStyles: function (elem) {
							var id = Combobox.getId(elem), opt = options[id];
							if (opt !== undefined) {
								setStyles(elem.children('option.' + pluginClass),
									opt.optionStyles);
							}
						},
						focusOnNewOption: function (elem) {
							var id = Combobox.getId(elem), opt = options[id];
							elem.children('option:not(.' + pluginClass + '):first').
								attr('selected', 'selected');
							if (opt !== undefined && opt.focusOnNewOption) {
								elem.children('option.' + pluginClass).
									attr('selected', 'selected');
							}
						},
						useExistingOptions: function (elem) {
							var id = Combobox.getId(elem), opt = options[id];
							if (opt !== undefined && opt.useExistingOptions) {
								Combobox.setEditableOption(elem);
							}
						},
						all: function (elem) {
							Handle.position(elem);
							Handle.classes(elem);
							Handle.optionClasses(elem);
							Handle.styles(elem);
							Handle.optionStyles(elem);
							Handle.focusOnNewOption(elem);
							Handle.useExistingOptions(elem);
						}
					};
				}());
				
				return {
					Set		: Set,
					Remove	: Remove,
					Handle	: Handle
				};
			}());
			
			EditableOption = (function () {
				return {
					init: function (elem) {
						var editableOption = $(document.createElement('option'));
						
						editableOption.addClass(pluginClass);
						
						elem.append(editableOption);
						elem.bind('keydown', EventHandlers.keyDown);
						elem.bind('keypress', EventHandlers.keyPress);
						elem.bind('change', EventHandlers.change);
						elem.bind('focus', EventHandlers.focus);
						elem.bind('blur', EventHandlers.blur);
					},
					destroy: function (elem) {
						elem.children('option.' + pluginClass).remove();
						elem.children('option:first').attr('selected', 'selected');
						elem.unbind('keydown', EventHandlers.keyDown);
						elem.unbind('keypress', EventHandlers.keyPress);
						elem.unbind('change', EventHandlers.change);
					}
				};
			}());
			
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
				EditableOption.init(elem);
				Parameters.Handle.all(elem);
			};
			
			// Combobox public members
			return {
				// create editable combobox
				init: function (settings) {
					Hacks.registerIndexOf();
					
					return $(this).filter(':uneditable').each(function () {
						var id = 'jec' + generateId(), key;
						
						// override passed default options
						options[id] = clone(defaults);
						
						// add unique id to classes
						$(this).addClass(id);
						
						// parse keys
						Parameters.Set.ignoredKeys($(this), options[id].ignoredKeys);
						Parameters.Set.acceptedKeys($(this), options[id].acceptedKeys);
						
						if (typeOf(settings) === 'object') {
							for (key in settings) {
								if (settings[key] !== undefined) {
									switch (key) {
									case 'position':
										Parameters.Set.position($(this), settings[key]);
										break;
									case 'classes':
										Parameters.Set.classes($(this), settings[key]);
										break;
									case 'optionClasses':
										Parameters.Set.optionClasses($(this), settings[key]);
										break;
									case 'styles':
										Parameters.Set.styles($(this), settings[key]);
										break;
									case 'optionStyles':
										Parameters.Set.optionStyles($(this), settings[key]);
										break;
									case 'focusOnNewOption':
										Parameters.Set.focusOnNewOption($(this), settings[key]);
										break;
									case 'useExistingOptions':
										Parameters.Set.useExistingOptions($(this), settings[key]);
										break;
									case 'ignoredKeys':
										Parameters.Set.ignoredKeys($(this), settings[key]);
										break;
									case 'acceptedKeys':
										Parameters.Set.acceptedKeys($(this), settings[key]);
										break;
									}
								}
							}
						}
						
						setup($(this));
					});
				},
				// creates editable combobox without using existing select elements
				initJS: function (options, settings) {
					var select, i, key;
					
					select = $('<select>');
					
					if (typeOf(options) === 'array') {
						for (i = 0; i < options.length; i += 1) {
							if (typeOf(options[i]) === 'object') {
								for (key in options[i]) {
									if (typeOf(options[i][key]) === 'number' ||
										typeOf(options[i][key]) === 'string') {
										$('<option>').text(options[i][key]).attr('value', key).
											appendTo(select);
									}
								}
							} else if (typeOf(options[i]) === 'string' ||
								typeOf(options[i]) === 'number') {
								$('<option>').text(options[i]).attr('value', options[i]).
									appendTo(select);
							}
						}
					}
					
					return select.jec(settings);
				},
				// destroys editable combobox
				destroy: function () {
					return $(this).filter(':editable').each(function () {
						$(this).jecOff();
						$(this).removeClass(Combobox.getId($(this)));
					});
				},
				// enable editablecombobox
				enable: function () {
					return $(this).filter(':editable').each(function () {
						var id = Combobox.getId($(this)), value = values[id];
						
						setup($(this));
						
						if (value !== undefined) {
							$(this).jecValue(value);
						}
					});
				},
				// disable editable combobox
				disable: function () {
					return $(this).filter(':editable').each(function () {
						values[Combobox.getId($(this))] = $(this).
							children('option.' + pluginClass).val();
						Parameters.Remove.all($(this));
						EditableOption.destroy($(this));
					});
				},
				// gets or sets editable option's value
				value: function (value, setFocus) {
					if ($(this).filter(':editable').length > 0) {
						if (Validators.empty(value)) {
							// get value
							return $(this).filter('select').children('option.' + pluginClass).
								val();
						} else if (typeOf(value) === 'string' || typeOf(value) === 'number') {
							// set value
							return $(this).filter(':editable').each(function () {
								var option = $(this).children('option.' + pluginClass);
								option.val(value).text(value);
								if (typeOf(setFocus) !== 'boolean' || setFocus) {
									option.attr('selected', 'selected');
								}
							});
						}
					}
				},
				// gets or sets editable option's preference
				pref: function (name, value) {
					if ($(this).filter(':editable').length > 0) {
						if (!Validators.empty(name)) {
							if (Validators.empty(value)) {
								// get preference
								return options[Combobox.getId($(this))][name];
							} else {
								// set preference
								return $(this).filter(':editable').each(function () {
									switch (name) {
									case 'position':
										Parameters.Set.position($(this), value);
										Parameters.Handle.position($(this));
										break;
									case 'classes':
										Parameters.Remove.classes($(this));
										Parameters.Set.classes($(this), value);
										Parameters.Handle.position($(this));
										break;
									case 'optionClasses':
										Parameters.Remove.optionClasses($(this));
										Parameters.Set.optionClasses($(this), value);
										Parameters.Set.optionClasses($(this));
										break;
									case 'styles':
										Parameters.Remove.styles($(this));
										Parameters.Set.styles($(this), value);
										Parameters.Set.styles($(this));
										break;
									case 'optionStyles':
										Parameters.Remove.optionStyles($(this));
										Parameters.Set.optionStyles($(this), value);
										Parameters.Handle.optionStyles($(this));
										break;
									case 'focusOnNewOption':
										Parameters.Set.focusOnNewOption($(this), value);
										Parameters.Handle.focusOnNewOption($(this));
										break;
									case 'useExistingOptions':
										Parameters.Set.useExistingOptions($(this), value);
										Parameters.Handle.useExistingOptions($(this));
										break;
									case 'ignoredKeys':
										Parameters.Set.ignoredKeys($(this), value);
										break;
									case 'acceptedKeys':
										Parameters.Set.acceptedKeys($(this), value);
										break;
									}
								});
							}
						}
					}
				},
				// sets editable option to the value of currently selected option
				setEditableOption: function (elem) {
					elem.children('option.' + pluginClass).attr('value', elem.val()).text(elem.val()).
						attr('selected', 'selected');
				},
				// get combobox id
				getId: function (elem) {
					return elem.attr('class').match(/jec\d+/);
				},
				//handles editable cursor
				handleCursor: function () {
					if (activeCombobox !== undefined && activeCombobox !== null) {
						var elem = activeCombobox.children('option:selected'), text = elem.text();
						if (text !== elem.val() && text.substring(text.length - 1) === '|') {
							elem.text(text.substring(0, text.length - 1));
						} else {
							elem.text(text + '|');
						}
					}
				}
			};
		}());
		
		// jEC public members
		return {
			init			: Combobox.init,
			enable			: Combobox.enable,
			disable			: Combobox.disable,
			destroy			: Combobox.destroy,
			value			: Combobox.value,
			pref			: Combobox.pref,
			initJS			: Combobox.initJS,
			handleCursor	: Combobox.handleCursor
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
	
	$.extend({
		jec: $.jEC.initJS
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