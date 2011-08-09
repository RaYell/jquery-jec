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
		var pluginClass = 'jecEditableOption', options = {}, values = {}, lastKeyCode = null,
			defaults, Validators, Hacks, EventHandlers, Combobox, clone, typeOf;
		
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
					typeof value.splice === 'function' &&
					!value.propertyIsEnumerable('length')) {
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
		(Validators = function () {
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
		(Hacks = function () {
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
		(EventHandlers = function () {
			// returns key code
			var getKeyCode = function (event) {
				if (event.charCode !== undefined && event.charCode !== 0) {
					return event.charCode;
				} else {
					return event.keyCode;
				}
			};
			
			// EventHandlers public members
			return {
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
					
					if (keyCode !== 9) {
						// special keys codes
						specialKeys = [37, 38, 39, 40, 46];
						// handle special keys
						for (i = 0; i < specialKeys.length; i += 1) {
							if (keyCode === specialKeys[i] && keyCode === lastKeyCode) {
								return;
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
					Combobox.setEditableOption($(this));
				}
			};
		}());
		
		// Combobox
		(Combobox = function () {
			var Parameters, EditableOption, generateId, setup;
			
			// validates and set combobox parameters
			(Parameters = function () {
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
									Validators.int(value[i].min) && Validators.int(value[i].max) &&
									value[i].min <= value[i].max) {
									for (j = value[i].min; j <= value[i].max; j += 1) {
										keys[keys.length] = j;
									}
								// exact tuple
								} else if (typeOf(value[i]) === 'object' && 
									!Validators.empty(value[i].exact) && 
									Validators.int(value[i].exact)) {
									keys[keys.length] = value[i].exact;
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
						position: function (id, value) {
							var opt = options[id], optionsCount;
							if (opt !== undefined && Validators.int(value)) {
								optionsCount = 
									$('select.' + id + ' option:not(.' + pluginClass + ')').length;
								if (value > optionsCount) {
									value = optionsCount;
								}
								opt.position = value;
							}
						},
						classes: function (id, value) {
							if (typeOf(value) === 'string') {
								value = [value];
							}
							var opt = options[id];
							if (opt !== undefined && typeOf(value) === 'array') {
								opt.classes = value;
							}
						},
						optionClasses: function (id, value) {
							if (typeOf(value) === 'string') {
								value = [value];
							}
							var opt = options[id];
							if (opt !== undefined && typeOf(value) === 'array') {
								opt.optionClasses = value;
							}
						},
						styles: function (id, value) {
							var opt = options[id];
							if (opt !== undefined && typeOf(value) === 'object') {
								opt.styles = value;
							}
						},
						optionStyles: function (id, value) {
							var opt = options[id];
							if (opt !== undefined && typeOf(value) === 'object') {
								opt.optionStyles = value;
							}
						},
						focusOnNewOption: function (id, value) {
							var opt = options[id];
							if (opt !== undefined && typeOf(value) === 'boolean') {
								opt.focusOnNewOption = value;
							}
						},
						useExistingOptions: function (id, value) {
							var opt = options[id];
							if (opt !== undefined && typeOf(value) === 'boolean') {
								opt.useExistingOptions = value;
							}
						},
						ignoredKeys: function (id, value) {
							var opt = options[id];
							if (opt !== undefined && typeOf(value) === 'array') {
								opt.ignoredKeys = parseKeys(value);
							}
						},
						acceptedKeys: function (id, value) {
							var opt = options[id];
							if (opt !== undefined && typeOf(value) === 'array') {
								opt.acceptedKeys = parseKeys(value);
							}
						}
					};
				}());
				
				(Remove = function () {
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
						classes: function (id) {
							var opt = options[id];
							if (opt !== undefined) {
								removeClasses($('select.' + id), opt.classes);
							}
						},
						optionClasses: function (id) {
							var opt = options[id];
							if (opt !== undefined) {
								removeClasses($('select.' + id + ' option.' + pluginClass), 
									opt.optionClasses);
							}
						},
						styles: function (id) {
							var opt = options[id];
							if (opt !== undefined) {
								removeStyles($('select.' + id), opt.styles);
							}
						},
						optionStyles: function (id) {
							var opt = options[id];
							if (opt !== undefined) {
								removeStyles($('select.' + id + ' option.' + pluginClass),
									opt.optionStyles);
							}
						},
						all: function (id) {
							Remove.classes(id);
							Remove.optionClasses(id);
							Remove.styles(id);
							Remove.optionStyles(id);
						}
					};
				}());
				
				(Handle = function () {
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
						position: function (id) {
							var opt = options[id], option, uneditableOptions;
							if (opt !== undefined) {
								option = $('select.' + id + ' option.' + pluginClass);
								uneditableOptions = 
									$('select.' + id + ' option:not(.' + pluginClass + ')');
								if (opt.position < uneditableOptions.length) {
									uneditableOptions.eq(opt.position).before(option);
								} else {
									$('select.' + id).append(option);
								}
							}
						},
						classes: function (id) {
							var opt = options[id];
							if (opt !== undefined) {
								setClasses($('select.' + id), opt.classes);
							}
						},
						optionClasses: function (id) {
							var opt = options[id];
							if (opt !== undefined) {
								setClasses($('select.' + id + ' option.' + pluginClass), 
									opt.optionClasses);
							}
						},
						styles: function (id) {
							var opt = options[id];
							if (opt !== undefined) {
								setStyles($('select.' + id), opt.styles);
							}
						},
						optionStyles: function (id) {
							var opt = options[id];
							if (opt !== undefined) {
								setStyles($('select.' + id + ' option.' + pluginClass),
									opt.optionStyles);
							}
						},
						focusOnNewOption: function (id) {
							var opt = options[id];
							if (opt !== undefined && opt.focusOnNewOption) {
								$('select.' + id + ' option.' + pluginClass).
									attr('selected', 'selected');
							}
						},
						useExistingOptions: function (id) {
							var opt = options[id], elem;
							if (opt !== undefined) {
								elem = $('select.' + id);
								if (opt.useExistingOptions) {
									Combobox.setEditableOption(elem);
									elem.bind('change', EventHandlers.change);
								} else {
									elem.unbind('change', EventHandlers.change);
								}
							}
						},
						all: function (id) {
							Handle.position(id);
							Handle.classes(id);
							Handle.optionClasses(id);
							Handle.styles(id);
							Handle.optionStyles(id);
							Handle.focusOnNewOption(id);
							Handle.useExistingOptions(id);
						}
					};
				}());
				
				return {
					Set		: Set,
					Remove	: Remove,
					Handle	: Handle
				};
			}());
			
			(EditableOption = function () {
				return {
					init: function (id) {
						var editableOption = $(document.createElement('option')), 
							select = $('select.' + id);
						
						editableOption.addClass(pluginClass);
						
						select.append(editableOption);
						select.bind('keydown', EventHandlers.keyDown);
						select.bind('keypress', EventHandlers.keyPress);
					},
					destroy: function (id) {
						var select = $('select.' + id), opt = options[id];
						
						select.children('option.' + pluginClass).remove();
						select.children('option:first').attr('selected', 'selected');
						select.unbind('keydown', EventHandlers.keyDown);
						select.unbind('keypress', EventHandlers.keyPress);
						
						if (opt !== undefined && opt.useExistingOptions) {
							select.unbind('change', EventHandlers.change);
						}
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
			setup = function (id) {
				EditableOption.init(id);
				Parameters.Handle.all(id);
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
						Parameters.Set.ignoredKeys(id, options[id].ignoredKeys);
						Parameters.Set.acceptedKeys(id, options[id].acceptedKeys);
						
						if (typeOf(settings) === 'object') {
							for (key in settings) {
								if (settings[key] !== undefined) {
									switch (key) {
									case 'position':
										Parameters.Set.position(id, settings[key]);
										break;
									case 'classes':
										Parameters.Set.classes(id, settings[key]);
										break;
									case 'optionClasses':
										Parameters.Set.optionClasses(id, settings[key]);
										break;
									case 'styles':
										Parameters.Set.styles(id, settings[key]);
										break;
									case 'optionStyles':
										Parameters.Set.optionStyles(id, settings[key]);
										break;
									case 'focusOnNewOption':
										Parameters.Set.focusOnNewOption(id, settings[key]);
										break;
									case 'useExistingOptions':
										Parameters.Set.useExistingOptions(id, settings[key]);
										break;
									case 'ignoredKeys':
										Parameters.Set.ignoredKeys(id, settings[key]);
										break;
									case 'acceptedKeys':
										Parameters.Set.acceptedKeys(id, settings[key]);
										break;
									}
								}
							}
						}
						
						setup(id);
					});
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
						
						setup(id);
						
						if (value !== undefined) {
							$(this).jecValue(value);
						}
					});
				},
				// disable editable combobox
				disable: function () {
					return $(this).filter(':editable').each(function () {
						var id = Combobox.getId($(this));
						
						values[id] = $(this).children('option.' + pluginClass).val();
						Parameters.Remove.all(id);
						EditableOption.destroy(id);
					});
				},
				// gets or sets editable option's value
				value: function (value, setFocus) {
					if ($(this).filter(':editable').length > 0) {
						if (Validators.empty(value)) {
							// get value
							return $(this).filter(':editable').children('option.' + pluginClass).
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
									var id = Combobox.getId($(this));
									switch (name) {
									case 'position':
										Parameters.Set.position(id, value);
										Parameters.Handle.position(id);
										break;
									case 'classes':
										Parameters.Remove.classes(id);
										Parameters.Set.classes(id, value);
										Parameters.Handle.position(id);
										break;
									case 'optionClasses':
										Parameters.Remove.optionClasses(id);
										Parameters.Set.optionClasses(id, value);
										Parameters.Set.optionClasses(id);
										break;
									case 'styles':
										Parameters.Remove.styles(id);
										Parameters.Set.styles(id, value);
										Parameters.Set.styles(id);
										break;
									case 'optionStyles':
										Parameters.Remove.optionStyles(id);
										Parameters.Set.optionStyles(id, value);
										Parameters.Handle.optionStyles(id);
										break;
									case 'focusOnNewOption':
										Parameters.Set.focusOnNewOption(id, value);
										Parameters.Handle.focusOnNewOption(id);
										break;
									case 'useExistingOptions':
										Parameters.Set.useExistingOptions(id, value);
										Parameters.Handle.useExistingOptions(id);
										break;
									case 'ignoredKeys':
										Parameters.Set.ignoredKeys(id, value);
										break;
									case 'acceptedKeys':
										Parameters.Set.acceptedKeys(id, value);
										break;
									}
								});
							}
						}
					}
				},
				// sets editable option to the value of currently selected option
				setEditableOption: function (elem) {
					elem.children('option.' + pluginClass).
						val(elem.children('option:selected').text());
				},
				// get combobox id
				getId: function (elem) {
					return elem.attr('class').match(/jec\d+/);
				},
				// get or set enabled flag
				enabled: function (value) {
					if ($(this).filter(':editable').length > 0) {
						if (Validators.empty(value)) {
							// get value
							return !$(this).filter(':editable').attr('disabled');
						} else if (typeOf(value) === 'boolean') {
							// set value
							return $(this).filter(':editable').attr('disabled', !value);
						}
					}
				},
				// get or set visible flag
				visible: function (value) {
					if ($(this).filter(':editable').length > 0) {
						if (Validators.empty(value)) {
							// get value
							return $(this).filter(':editable:hidden').length === 0;
						} else if (typeOf(value) === 'boolean') {
							// set value
							if (value) {
								return $(this).filter(':editable').show();
							} else {
								return $(this).filter(':editable').hide();
							}
						}
					}
				}
			};
		}());
		
		// jEC public members
		return {
			init	: Combobox.init,
			enable	: Combobox.enable,
			disable	: Combobox.disable,
			destroy	: Combobox.destroy,
			value	: Combobox.value,
			pref	: Combobox.pref,
			enabled	: Combobox.enabled,
			visible	: Combobox.visible
		};
	}());

 	// register functions
	$.fn.extend({
		jec			: $.jEC.init,
		jecOn		: $.jEC.enable,
		jecOff		: $.jEC.disable,
		jecKill		: $.jEC.destroy,
		jecValue	: $.jEC.value,
		jecPref		: $.jEC.pref,
		jecEnabled	: $.jEC.enabled,
		jecVisible	: $.jEC.visible
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