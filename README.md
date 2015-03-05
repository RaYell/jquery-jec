[![Bower version](https://badge.fury.io/bo/jquery-jec.svg)](http://badge.fury.io/bo/jquery-jec)
[![Build Status](https://travis-ci.org/RaYell/jquery-jec.svg?branch=master)](https://travis-ci.org/RaYell/jquery-jec)
[![Coverage Status](https://coveralls.io/repos/RaYell/jquery-jec/badge.png?branch=master)](https://coveralls.io/r/RaYell/jquery-jec?branch=master)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

### Requirements

jQuery 1.7+ library is required to use this extension. It can be downloaded from [jQuery Web Page](http://jquery.com).

### Setup

Install the library using Bower

```
bower install jquery-jec --save
```

Import plugin file after importing the jQuery library.

```html
<script src="bower_components/jquery-jec/src/jquery-jec.min.js"></script>
```

### Syntax

#### jec([settings])

```javascript
$(selector).jec([settings])
```

Initializes editable combobox. Will ignore all non-```<select>``` elements and elements already initialized.

##### Parameters
| **Type** | **Name** | **Description** | **Default value** | **Added in** |
| -------- | -------- | --------------- | ----------------- | ------------ |
| ```object``` | ```settings``` | plugin settings | ```{}``` | 1.0 |

##### Options
| **Type** | **Name** | **Description** | **Default value** | **Added in** |
| -------- | -------- | --------------- | ----------------- | ------------ |
| ```int``` | ```position``` | index of editable option to be inserted in select | ```0``` | 1.0 |
| ```bool``` | ```ignoreOptGroups``` | ignores option groups when placing editable option if set to ```true``` | ```false``` | 1.3 |
| ```int``` | ```maxLength``` | max input length | ```255``` | 1.3 |
| ```string```, ```array``` | ```classes``` | additional classes to be added | ```[]``` | 1.0 |
| ```object``` | ```styles``` | additional CSS properties to be set | ``` {} ``` | 1.0 |
| ```string```, ```array``` | ```optionClasses``` | additional classes to be added to editable option element | ```[]``` | 1.1 |
| ```object``` | ```optionStyles``` | additional CSS properties to be set for editable option element | ``` {} ``` | 1.1 |
| ```bool``` | ```triggerChangeEvent``` | triggers change event on ```select``` everytime user types if set to ```true``` | ```false``` | 1.3 |
| ```bool``` | ```focusOnNewOption``` | moves focus to newly created option element if set to ```true``` | ```false``` | 1.0 |
| _bool_ | ```useExistingOptions``` | uses selected ```<option>``` text as a base for editable option if set to ```true```, otherwise editable option base is empty string | ```false``` | 1.0 |
| ```array``` | ```ignoredKeys``` | ignored key codes, values in array can the either a ``` {min: MIN_VALUE, max: MAX_VALUE} ```, ``` {exact: VALUE} ``` value or integers | ``` [] ``` | 1.0 |
| ```array``` | ```acceptedKeys``` | accepted key codes, values in array can the either a ``` {min: MIN_VALUE, max: MAX_VALUE} ```, ``` {exact: VALUE} ``` value or integers | ``` [{min:32, max:126}, {min:191, max:382}] ``` | 1.1 |

##### Notes
  * while all other preferences can be changed on runtime using ```jecPref()``` method, changing ```focusOnNewOption``` has no effect on plugin behaviour because this preference is used only when the combobox is initialized
  * ```ignoredKeys``` have higher priority then ```acceptedKeys``` which means if there is the same key code in both arrays then it will be ignored

##### Returned Value
This method returns jQuery object collection with objects which are initialized editable comboboxes.

#### jecOn()
```javascript
$(selector).jecOn();
```

Enables previously  disabled editable combobox. Will ignore all non-```<select>``` elements and elements that were not initialized. This will not remove the ```<select>``` element but it will start behaving like an ordinary ```<select>```.

##### Returned Value
This method returns jQuery object collection with objects which are enabled editable comboboxes.

#### jecOff()
```javascript
$(selector).jecOff();
```

Disables previously enabled editable combobox. Will ignore all non-```<select>``` elements and elements that were not initialized. This will not remove the ```<select>``` element but it will need to be enabled if it is to be used as editable combobox again.

##### Returned Value
This method returns jQuery object collection with objects which are disabled editable comboboxes.

#### jecKill()
```javascript
$(selector).jecKill();
```

Destroys editable combobox. Will ignore all non-```<select>``` elements and elements that were not initialized. This will not remove the ```<select>``` element but it will need to be initialized again if it is to be used as editable combobox again.

##### Returned Value
This method returns jQuery object collection with objects which are destroyed editable comboboxes.

#### jecValue()
```javascript
$(selector).jecValue();
```

Gets the value and text of editable option.

#### jecValue(value[, setFocus])
```javascript
$(selector).jecValue(value[, setFocus]);
```

Sets the value and text of editable option.

##### Parameters
| **Type** | **Name** | **Description** | **Default value** |
| -------- | -------- | --------------- | ----------------- | ------------ |
| ```string```, ```number``` | ```value``` | value to be set |  |
| ```bool``` | ```setFocus``` | moves focus to editable option if set to ```true``` | ```true``` |

##### Returned Value
This method returns jQuery object collection with objects which values has been changed.

#### jecPref(name)
```javascript
$(selector).jecPref(name);
```

Added in 1.1.0

Gets the specified preference value.

##### Parameters
| **Type** | **Name** | **Description** | **Default value** |
| -------- | -------- | --------------- | ----------------- |
| ```string``` | ```name``` | preference name | |

##### Returned Value
This method returns preference value of type specific to given preference. More details on preference types can be found on ```jec()``` section.

#### jecPref(name, value)
```javascript
$(selector).jecValue(name, value);
```

Sets the value of the specified preference. Value type must match allowed value type for specific preference. 

##### Parameters
| **Type** | **Name** | **Description** | **Default value** |
| -------- | -------- | --------------- | ----------------- |
| ```string``` | ```name``` | preference name | _N/A_ |
| ```any``` | ```value``` | value to be set | ```null``` |

##### Returned Value
This method returns jQuery object collection with objects which preferences has been changed.

#### $.jec([options[, settings]])
```javascript
$.jec([options[, settings]])
```

Added in 1.2.0

Initializes editable combobox from scratch. It will create ```select``` element and ```option```-child elements based on the passed values.

##### Parameters
| **Type** | **Name** | **Description** | **Default value** | **Added in** |
| -------- | -------- | --------------- | ----------------- | ------------ |
| ```array``` | ```options``` | default options, values in array can be either an objects, strings or numbers | ```[]``` | 1.2 |
| ```object``` | ```settings``` | plugin settings | ``` {} ``` | 1.2 |

##### Notes
  * if object will be passed as an element of ```options``` array all its keys will be transferred to predefined options where key will be used as a ```<option>``` value and value will be ```<option>``` text. If value will be of type object then new optgroup will be created.
  * if strings or numbers will be passed as an elements of ```options``` array they will become both values and texts of the predefined ```<option>``` elements that will be created by the plugin
  * ```settings``` are exactly the same as for ```jec()``` method

##### Options
| **Type** | **Name** | **Description** | **Default value** | **Added in** |
| -------- | -------- | --------------- | ----------------- | ------------ |
| ```int``` | ```position``` | index of editable option to be inserted in select | ```0``` | 1.2 |
| ```bool``` | ```ignoreOptGroups``` | ignores option groups when placing editable option if set to ```true``` | ```false``` | 1.3 |
| ```int``` | ```maxLength``` | max input length | ```255``` | 1.3 |
| ```string```, ```array``` | ```classes``` | additional classes to be added | ```[]``` | 1.2 |
| ```object``` | ```styles``` | additional CSS properties to be set | ``` {} ``` | 1.2 |
| ```string```, ```array``` | ```optionClasses``` | additional classes to be added to editable option element | ```[]``` | 1.2 |
| ```object``` | ```optionStyles``` | additional CSS properties to be set for editable option element | ``` {} ``` | 1.2 |
| ```bool``` | ```triggerChangeEvent``` | triggers change event on ```select``` everytime user types if set to ```true``` | ```false``` | 1.3 |
| ```bool``` | ```focusOnNewOption``` | moves focus to newly created option element if set to ```true``` | ```false``` | 1.2 |
| ```bool``` | ```useExistingOptions``` | uses selected ```<option>``` text as a base for editable option if set to ```true```, otherwise editable option base is empty string | ```false``` | 1.2 |
| ```array``` | ```ignoredKeys``` | ignored key codes, values in array can be either a ``` {min: MIN_VALUE, max: MAX_VALUE} ```, ``` {exact: VALUE} ``` value or integers | ``` [] ``` | 1.2 |
| ```array``` | ```acceptedKeys``` | accepted key codes, values in array can be either a ``` {min: MIN_VALUE, max: MAX_VALUE} ```, ``` {exact: VALUE} ``` value or integers | ``` [{min:32, max:126}, {min:191, max:382}] ``` | 1.2 |

##### Notes
  * while all other preferences can be changed on runtime using ```jecPref()``` method, changing ```focusOnNewOption``` has no effect on plugin behaviour because this preference is used only when the combobox is initialized
  * ```ignoredKeys``` have higher priority then ```acceptedKeys``` which means if there is the same key code in both arrays then it will be ignored

##### Returned Value
This method returns jQuery object with initialized editable comboboxes.

### Selectors

#### :editable
```javascript
$(':editable');
```

Added in 1.1.0

Returns editable ```<select>``` elements.

#### :uneditable
```javascript
$(':uneditable');
```

Added in 1.1.0 

Returns uneditable ```<select>``` elements.

### Examples
#### #1 Change every ```select``` element to editable combobox.
```javascript
$('select').jec();
```

#### #2 Change every ```select``` element to editable combobox using existing ```option``` values.
```javascript
$('select').jec({'useExistingOptions': true});
```

### Known Issues
#### Some combobox operations may not work
This plugin doesn't implement new control for editable comboboxes. It uses existing select controls and keyboard events to emulate the behavior of a typical combobox. Therefore some operations you can usually perform on regular comboboxes may not work here. For example you cannot cut, copy or paste text to and from jEC's combobox. You also cannot use undo and redo operations.

#### List expanding on WebKit browsers
Expanding the list of combobox options in a browser that uses WebKit as a rendering engine (like Safari or Chrome) and typing anything to change editable option's value will not work. Instead the browser will try to match your keystrokes with existing items. If you want to type to populate a custom value you must make sure that the list is folded.

#### Plugin not working on mobile devices
On some mobile devices (like an iPhone) plugin will not work since they implement comboboxes in a different way then normal browsers so there might not be a possibility to type with the ```<select>``` box selected.

### Links
* [IncompatibleChanges](https://github.com/RaYell/jquery-jec/wiki/Incompatible-Changes)
* [Changelog](https://github.com/RaYell/jquery-jec/wiki/Changelog)
* [Demo](http://jsfiddle.net/RaYell/n96RF)
