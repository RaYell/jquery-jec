/*jslint indent: 4, maxlen: 120*/
/*global describe, it, require, global, $, chai, beforeEach, afterEach*/
var assert, jsdom, jquery, wind;
if (typeof require === 'function') {
    assert = require('chai').assert;
    jsdom = require('jsdom');
    jquery = require('jquery');
    wind = jsdom.jsdom('<html><body><div id="fixtures"></div></body></html>').createWindow();

    global.jQuery = jquery(wind);
    global.document = wind.document;
    global.$ = global.jQuery;
    require('../src/jquery-jec');
} else {
    assert = chai.assert;
}

beforeEach(function () {
    var select1 = '<select id="test"><option>opt1</option><option selected>opt2</option>' +
        '<option>opt3</option></select>',
        select2 = '<select id="gtest" class="hidden"><option>opt1</option>' +
        '<optgroup label="Group 1"><option selected>opt2</option>' +
        '<option>opt3</option></optgroup><optgroup label="Group 2">' +
        '<option>opt4</option></optgroup><option>opt5</option></select>';
    $('#fixtures').append(select1).append(select2);
});

afterEach(function () {
    $('#fixtures').empty();
});

describe('JEC', function () {
    'use strict';
    var key = function (elem, code) {
            var list = ['keydown', 'keypress', 'keyup'];
            $.each(list, function () {
                var e = $.Event(this, {
                    keyCode: code
                });
                elem.trigger(e);
            });
        };

    describe('Combobox initialization', function () {
        it('should create a new combobox', function () {
            var elem = $('#test').jec();
            assert.notEqual(elem.data('jecId'), undefined);
            assert.notEqual(elem.data('jecId'), null);
        });
    });

    describe('Keyboard', function () {
        it('should behave correctly with keyboard', function () {
            var elem = $('#test').jec(),
                option = elem.children('option.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), 'H');
            key(elem, 105);
            assert.equal(option.val(), 'Hi');
            key(elem, 32);
            assert.equal(option.val(), 'Hi ');
            key(elem, 33);
            assert.equal(option.val(), 'Hi !');
            key(elem, 8);
            assert.equal(option.val(), 'Hi ');
            key(elem, 46);
            assert.equal(option.val(), 'Hi');
        });
    });

    describe('Setting position', function () {
        it('should set the editable option on the specific position', function () {
            var position = 1,
                elem = $('#test').jec({
                    position: position
                });
            assert.equal(elem.children('option').eq(position).hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the last position', function () {
            var elem = $('#test').jec({
                position: 3
            });
            assert.equal(elem.children('option:last').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the last position (big value)', function () {
            var elem = $('#test').jec({
                position: 100
            });
            assert.equal(elem.children('option:last').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring negative value', function () {
            var elem = $('#test').jec({
                position: -1
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring float value', function () {
            var elem = $('#test').jec({
                position: 2.2
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring string value', function () {
            var elem = $('#test').jec({
                position: '1'
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring boolean value', function () {
            var elem = $('#test').jec({
                position: true
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring undefined value', function () {
            var elem = $('#test').jec({
                position: undefined
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring null value', function () {
            var elem = $('#test').jec({
                position: null
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring object value', function () {
            var elem = $('#test').jec({
                position: {
                    position: 1
                }
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring array value', function () {
            var elem = $('#test').jec({
                position: [1]
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring function value', function () {
            var elem = $('#test').jec({
                position: function () {
                    return 1;
                }
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
    });

    describe('Setting max length', function () {
        it('should set the max length to 2', function () {
            var i,
                length = 2,
                elem = $('#test').jec({
                    maxLength: length
                });
            for (i = 0; i < length + 1; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
        it('should ignore too big max length value', function () {
            var i,
                length = 260,
                elem = $('#test').jec({
                    maxLength: -1
                });
            for (i = 0; i < length; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), 255);
        });
        it('should ignore invalid negative max length value', function () {
            var i,
                length = 10,
                elem = $('#test').jec({
                    maxLength: -1
                });
            for (i = 0; i < length; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
        it('should ignore invalid float max length value', function () {
            var i,
                length = 10,
                elem = $('#test').jec({
                    maxLength: 1.2
                });
            for (i = 0; i < length; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
        it('should ignore invalid string max length value', function () {
            var i,
                length = 10,
                elem = $('#test').jec({
                    maxLength: '1'
                });
            for (i = 0; i < length; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
        it('should ignore invalid boolean max length value', function () {
            var i,
                length = 10,
                elem = $('#test').jec({
                    maxLength: true
                });
            for (i = 0; i < length; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
        it('should ignore invalid undefined max length value', function () {
            var i,
                length = 10,
                elem = $('#test').jec({
                    maxLength: undefined
                });
            for (i = 0; i < length; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
        it('should ignore invalid null max length value', function () {
            var i,
                length = 10,
                elem = $('#test').jec({
                    maxLength: null
                });
            for (i = 0; i < length; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
        it('should ignore invalid object max length value', function () {
            var i,
                length = 10,
                elem = $('#test').jec({
                    maxLength: {
                        maxLength: 1
                    }
                });
            for (i = 0; i < length; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
        it('should ignore invalid array max length value', function () {
            var i,
                length = 10,
                elem = $('#test').jec({
                    maxLength: [1]
                });
            for (i = 0; i < length; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
        it('should ignore invalid function max length value', function () {
            var i,
                length = 10,
                elem = $('#test').jec({
                    maxLength: function () {
                        return 1;
                    }
                });
            for (i = 0; i < length; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
    });

    describe('Setting classes', function () {
        it('should not set any additional classes given as empty string', function () {
            var elem = $('#test').jec({
                classes: ''
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should set an additional class given as string', function () {
            var className = 'myClass1',
                elem = $('#test').jec({
                    classes: className
                });
            assert.lengthOf(elem.attr('class').split(/\s+/), 1);
            assert.equal(elem.hasClass(className), true);
        });
        it('should set multiple additional class given as string', function () {
            var className1 = 'myClass1',
                className2 = 'myClass2',
                elem = $('#test').jec({
                    classes: className1 + ' ' + className2
                });
            assert.lengthOf(elem.attr('class').split(/\s+/), 2);
            assert.equal(elem.hasClass(className1), true);
            assert.equal(elem.hasClass(className2), true);
        });
        it('should not set any additional classes given as empty array', function () {
            var elem = $('#test').jec({
                classes: []
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should set an additional class given as array', function () {
            var className = 'myClass1',
                elem = $('#test').jec({
                    classes: [className]
                });
            assert.lengthOf(elem.attr('class').split(/\s+/), 1);
            assert.equal(elem.hasClass(className), true);
        });
        it('should set multiple additional class given as array', function () {
            var className1 = 'myClass1',
                className2 = 'myClass2',
                elem = $('#test').jec({
                    classes: [className1, className2]
                });
            assert.lengthOf(elem.attr('class').split(/\s+/), 2);
            assert.equal(elem.hasClass(className1), true);
            assert.equal(elem.hasClass(className2), true);
        });
        it('should fail to set any additional classes given as int', function () {
            var elem = $('#test').jec({
                classes: 1
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should fail to set any additional classes given as float', function () {
            var elem = $('#test').jec({
                classes: 1.2
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should fail to set any additional classes given as boolean', function () {
            var elem = $('#test').jec({
                classes: true
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should fail to set any additional classes given as undefined', function () {
            var elem = $('#test').jec({
                classes: undefined
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should fail to set any additional classes given as null', function () {
            var elem = $('#test').jec({
                classes: null
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should fail to set any additional classes given as object', function () {
            var elem = $('#test').jec({
                classes: {
                    classes: 'myClass1'
                }
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should fail to set any additional classes given as function', function () {
            var elem = $('#test').jec({
                classes: function () {
                    return 'myClass';
                }
            });
            assert.equal(elem.attr('class'), undefined);
        });
    });

    describe('Setting option classes', function () {
        it('should not set any additional classes given as empty string', function () {
            var elem = $('#test').jec({
                optionClasses: ''
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should set an additional class given as string', function () {
            var className = 'myClass1',
                elem = $('#test').jec({
                    optionClasses: className
                }),
                option = elem.children('.jecEditableOption');
            assert.lengthOf(option.attr('class').split(/\s+/), 2);
            assert.equal(option.hasClass(className), true);
        });
        it('should set multiple additional class given as string', function () {
            var className1 = 'myClass1',
                className2 = 'myClass2',
                elem = $('#test').jec({
                    optionClasses: className1 + ' ' + className2
                }),
                option = elem.children('.jecEditableOption');
            assert.lengthOf(option.attr('class').split(/\s+/), 3);
            assert.equal(option.hasClass(className1), true);
            assert.equal(option.hasClass(className2), true);
        });
        it('should not set any additional classes given as empty array', function () {
            var elem = $('#test').jec({
                optionClasses: []
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should set an additional class given as array', function () {
            var className = 'myClass1',
                elem = $('#test').jec({
                    optionClasses: [className]
                }),
                option = elem.children('.jecEditableOption');
            assert.lengthOf(option.attr('class').split(/\s+/), 2);
            assert.equal(option.hasClass(className), true);
        });
        it('should set multiple additional class given as array', function () {
            var className1 = 'myClass1',
                className2 = 'myClass2',
                elem = $('#test').jec({
                    optionClasses: [className1, className2]
                }),
                option = elem.children('.jecEditableOption');
            assert.lengthOf(option.attr('class').split(/\s+/), 3);
            assert.equal(option.hasClass(className1), true);
            assert.equal(option.hasClass(className2), true);
        });
        it('should fail to set any additional classes given as int', function () {
            var elem = $('#test').jec({
                optionClasses: 1
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should fail to set any additional classes given as float', function () {
            var elem = $('#test').jec({
                optionClasses: 1.2
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should fail to set any additional classes given as boolean', function () {
            var elem = $('#test').jec({
                optionClasses: true
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should fail to set any additional classes given as undefined', function () {
            var elem = $('#test').jec({
                optionClasses: undefined
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should fail to set any additional classes given as null', function () {
            var elem = $('#test').jec({
                optionClasses: null
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should fail to set any additional classes given as object', function () {
            var elem = $('#test').jec({
                optionClasses: {
                    optionClasses: 'myClass1'
                }
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should fail to set any additional classes given as function', function () {
            var elem = $('#test').jec({
                optionClasses: function () {
                    return 'myClass';
                }
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
    });

    describe('Setting styles', function () {
        it('should not set any additional styles given as empty object', function () {
            var elem = $('#test').jec({
                styles: {}
            });
            assert.equal(elem.css('opacity'), 1);
        });
        it('should change the opacity to 0.5', function () {
            var opacity = 0.5,
                elem = $('#test').jec({
                    styles: {
                        opacity: opacity
                    }
                });
            assert.equal(elem.css('opacity'), opacity);
        });
        it('should change the opacity to 0.5 and display to none', function () {
            var opacity = 0.5,
                display = 'none',
                elem = $('#test').jec({
                    styles: {
                        opacity: opacity,
                        display: display
                    }
                });
            assert.equal(elem.css('opacity'), opacity);
            assert.equal(elem.css('display'), display);
        });
        it('should not set any additional styles given as string', function () {
            var elem = $('#test').jec({
                styles: 'opacity: 0.5;'
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as int', function () {
            var elem = $('#test').jec({
                styles: 1
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as float', function () {
            var elem = $('#test').jec({
                styles: 1.2
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as undefined', function () {
            var elem = $('#test').jec({
                styles: undefined
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as null', function () {
            var elem = $('#test').jec({
                styles: null
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as boolean', function () {
            var elem = $('#test').jec({
                styles: true
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as array', function () {
            var elem = $('#test').jec({
                styles: ['opacity: 0.5;']
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as function', function () {
            var elem = $('#test').jec({
                styles: function () {
                    return 'opacity: 0.5;';
                }
            });
            assert.equal(elem.attr('style'), undefined);
        });
    });

    describe('Setting option styles', function () {
        it('should not set any additional styles given as empty object', function () {
            var elem = $('#test').jec({
                optionStyles: {}
            });
            assert.equal(elem.children('.jecEditableOption').css('opacity'), 1);
        });
        it('should change the opacity to 0.5', function () {
            var opacity = 0.5,
                elem = $('#test').jec({
                    optionStyles: {
                        opacity: opacity
                    }
                });
            assert.equal(elem.children('.jecEditableOption').css('opacity'), opacity);
        });
        it('should change the opacity to 0.5 and display to none', function () {
            var opacity = 0.5,
                display = 'none',
                elem = $('#test').jec({
                    optionStyles: {
                        opacity: opacity,
                        display: display
                    }
                }),
                option = elem.children('.jecEditableOption');
            assert.equal(option.css('opacity'), opacity);
            assert.equal(option.css('display'), display);
        });
        it('should not set any additional styles given as string', function () {
            var elem = $('#test').jec({
                optionStyles: 'opacity: 0.5;'
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as int', function () {
            var elem = $('#test').jec({
                optionStyles: 1
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as float', function () {
            var elem = $('#test').jec({
                optionStyles: 1.2
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as undefined', function () {
            var elem = $('#test').jec({
                optionStyles: undefined
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as null', function () {
            var elem = $('#test').jec({
                optionStyles: null
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as boolean', function () {
            var elem = $('#test').jec({
                optionStyles: true
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as array', function () {
            var elem = $('#test').jec({
                optionStyles: ['opacity: 0.5;']
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as function', function () {
            var elem = $('#test').jec({
                optionStyles: function () {
                    return 'opacity: 0.5;';
                }
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
    });
    describe('Setting trigger change event handler', function () {
        it('should respect attached change event handler', function () {
            var val = 0,
                handler = function () {
                    val = 1;
                },
                elem = $('#test').on('change', handler).jec({
                    triggerChangeEvent: true
                });
            key(elem, 72);
            assert.equal(val, 1);
            elem.off('change', handler);
        });
        it('should ignore change event handler', function () {
            var val = 0,
                handler = function () {
                    val = 1;
                },
                elem = $('#test').on('change', handler).jec({
                    triggerChangeEvent: false
                });
            key(elem, 72);
            assert.equal(val, 0);
            elem.off('change', handler);
        });
        it('should ignore setting change event handler flag given as string', function () {
            var val = 0,
                handler = function () {
                    val = 1;
                },
                elem = $('#test').on('change', handler).jec({
                    triggerChangeEvent: 'true'
                });
            key(elem, 72);
            assert.equal(val, 0);
            elem.off('change', handler);
        });
        it('should ignore setting change event handler flag given as int', function () {
            var val = 0,
                handler = function () {
                    val = 1;
                },
                elem = $('#test').on('change', handler).jec({
                    triggerChangeEvent: 1
                });
            key(elem, 72);
            assert.equal(val, 0);
            elem.off('change', handler);
        });
        it('should ignore setting change event handler flag given as float', function () {
            var val = 0,
                handler = function () {
                    val = 1;
                },
                elem = $('#test').on('change', handler).jec({
                    triggerChangeEvent: 1.2
                });
            key(elem, 72);
            assert.equal(val, 0);
            elem.off('change', handler);
        });
        it('should ignore setting change event handler flag given as undefined', function () {
            var val = 0,
                handler = function () {
                    val = 1;
                },
                elem = $('#test').on('change', handler).jec({
                    triggerChangeEvent: undefined
                });
            key(elem, 72);
            assert.equal(val, 0);
            elem.off('change', handler);
        });
        it('should ignore setting change event handler flag given as null', function () {
            var val = 0,
                handler = function () {
                    val = 1;
                },
                elem = $('#test').on('change', handler).jec({
                    triggerChangeEvent: null
                });
            key(elem, 72);
            assert.equal(val, 0);
            elem.off('change', handler);
        });
        it('should ignore setting change event handler flag given as object', function () {
            var val = 0,
                handler = function () {
                    val = 1;
                },
                elem = $('#test').on('change', handler).jec({
                    triggerChangeEvent: {
                        triggerChangeEvent: true
                    }
                });
            key(elem, 72);
            assert.equal(val, 0);
            elem.off('change', handler);
        });
        it('should ignore setting change event handler flag given as array', function () {
            var val = 0,
                handler = function () {
                    val = 1;
                },
                elem = $('#test').on('change', handler).jec({
                    triggerChangeEvent: [true]
                });
            key(elem, 72);
            assert.equal(val, 0);
            elem.off('change', handler);
        });
        it('should ignore setting change event handler flag given as function', function () {
            var val = 0,
                handler = function () {
                    val = 1;
                },
                elem = $('#test').on('change', handler).jec({
                    triggerChangeEvent: function () {
                        return true;
                    }
                });
            key(elem, 72);
            assert.equal(val, 0);
            elem.off('change', handler);
        });
    });
    describe('Setting focus on new option', function () {
        it('should move the focus to the new option', function () {
            var elem = $('#test').jec({
                focusOnNewOption: true
            });
            assert.equal(elem.val(), '');
        });
        it('should leave the focus on the original place', function () {
            var elem = $('#test').jec({
                focusOnNewOption: false
            });
            assert.equal(elem.val(), 'opt2');
        });
        it('should ignore the invalid string value', function () {
            var elem = $('#test').jec({
                focusOnNewOption: 'true'
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid int value', function () {
            var elem = $('#test').jec({
                focusOnNewOption: 1
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid float value', function () {
            var elem = $('#test').jec({
                focusOnNewOption: 1.2
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid undefined value', function () {
            var elem = $('#test').jec({
                focusOnNewOption: undefined
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid null value', function () {
            var elem = $('#test').jec({
                focusOnNewOption: null
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid object value', function () {
            var elem = $('#test').jec({
                focusOnNewOption: {
                    focusOnNewOption: true
                }
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid array value', function () {
            var elem = $('#test').jec({
                focusOnNewOption: [true]
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid function value', function () {
            var elem = $('#test').jec({
                focusOnNewOption: function () {
                    return true;
                }
            });
            assert.notEqual(elem.val(), '');
        });
    });
    describe('Setting use existing options', function () {
        it('should properly handle use existing options flag', function () {
            var elem = $('#test').jec({
                useExistingOptions: true
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), 'opt1');
            elem.children('option:eq(2)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), 'opt2');
            elem.children('option:last').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), 'opt3');
        });
        it('should ignore value given as string', function () {
            var elem = $('#test').jec({
                useExistingOptions: 'true'
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
        it('should ignore value given as int', function () {
            var elem = $('#test').jec({
                useExistingOptions: 1
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
        it('should ignore value given as float', function () {
            var elem = $('#test').jec({
                useExistingOptions: 1.2
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
        it('should ignore value given as undefined', function () {
            var elem = $('#test').jec({
                useExistingOptions: undefined
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
        it('should ignore value given as null', function () {
            var elem = $('#test').jec({
                useExistingOptions: null
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
        it('should ignore value given as array', function () {
            var elem = $('#test').jec({
                useExistingOptions: [true]
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
        it('should ignore value given as object', function () {
            var elem = $('#test').jec({
                useExistingOptions: {
                    useExistingOptions: true
                }
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
        it('should ignore value given as function', function () {
            var elem = $('#test').jec({
                useExistingOptions: function () {
                    return true;
                }
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
    });
    describe('Setting ignored keys', function () {
        it('should properly handle ignored keys', function () {
            var elem = $('#test').jec({
                ignoredKeys: [72, {
                    min: 73,
                    max: 75
                }]
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), '');
            key(elem, 74);
            assert.equal(option.val(), '');
            key(elem, 76);
            assert.equal(option.val(), 'L');
        });
        it('should ignore setting ignored keys given as string', function () {
            var elem = $('#test').jec({
                ignoredKeys: '76'
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 76);
            assert.equal(option.val(), 'L');
        });
        it('should ignore setting ignored keys given as int', function () {
            var elem = $('#test').jec({
                ignoredKeys: 76
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 76);
            assert.equal(option.val(), 'L');
        });
        it('should ignore setting ignored keys given as float', function () {
            var elem = $('#test').jec({
                ignoredKeys: 76.1
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 76);
            assert.equal(option.val(), 'L');
        });
        it('should ignore setting ignored keys given as boolean', function () {
            var elem = $('#test').jec({
                ignoredKeys: true
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 76);
            assert.equal(option.val(), 'L');
        });
        it('should ignore setting ignored keys given as undefined', function () {
            var elem = $('#test').jec({
                ignoredKeys: undefined
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 76);
            assert.equal(option.val(), 'L');
        });
        it('should ignore setting ignored keys given as null', function () {
            var elem = $('#test').jec({
                ignoredKeys: null
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 76);
            assert.equal(option.val(), 'L');
        });
        it('should ignore setting ignored keys given as object', function () {
            var elem = $('#test').jec({
                ignoredKeys: {
                    ignoredKeys: [76]
                }
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 76);
            assert.equal(option.val(), 'L');
        });
        it('should ignore setting ignored keys given as function', function () {
            var elem = $('#test').jec({
                ignoredKeys: function () {
                    return 76;
                }
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 76);
            assert.equal(option.val(), 'L');
        });
    });
    describe('Setting accepted keys', function () {
        it('should properly handle accepted keys', function () {
            var elem = $('#test').jec({
                acceptedKeys: [72, {
                    min: 73,
                    max: 75
                }]
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), 'H');
            key(elem, 74);
            assert.equal(option.val(), 'HJ');
            key(elem, 76);
            assert.equal(option.val(), 'HJ');
        });
        it('should ignore setting accepted keys given as string', function () {
            var elem = $('#test').jec({
                acceptedKeys: '76'
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), 'H');
        });
        it('should ignore setting accepted keys given as int', function () {
            var elem = $('#test').jec({
                acceptedKeys: 76
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), 'H');
        });
        it('should ignore setting accepted keys given as float', function () {
            var elem = $('#test').jec({
                acceptedKeys: 76.1
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), 'H');
        });
        it('should ignore setting accepted keys given as undefined', function () {
            var elem = $('#test').jec({
                acceptedKeys: undefined
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), 'H');
        });
        it('should ignore setting accepted keys given as null', function () {
            var elem = $('#test').jec({
                acceptedKeys: null
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), 'H');
        });
        it('should ignore setting accepted keys given as boolean', function () {
            var elem = $('#test').jec({
                acceptedKeys: true
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), 'H');
        });
        it('should ignore setting accepted keys given as object', function () {
            var elem = $('#test').jec({
                acceptedKeys: {
                    acceptedKeys: [76]
                }
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), 'H');
        });
        it('should ignore setting accepted keys given as function', function () {
            var elem = $('#test').jec({
                acceptedKeys: function () {
                    return 76;
                }
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), 'H');
        });
    });
    describe('Setting ignore option groups', function () {
        it('should correctly position editable option', function () {
            var elem = $('#gtest').jec({
                ignoreOptGroups: false,
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should correctly position editable option inside the option group', function () {
            var elem = $('#gtest').jec({
                ignoreOptGroups: true,
                position: 1
            });
            assert.equal(elem.children('optgroup:first').children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid string value', function () {
            var elem = $('#gtest').jec({
                ignoreOptGroups: 'true',
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid int value', function () {
            var elem = $('#gtest').jec({
                ignoreOptGroups: 1,
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid float value', function () {
            var elem = $('#gtest').jec({
                ignoreOptGroups: 1.2,
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid undefined value', function () {
            var elem = $('#gtest').jec({
                ignoreOptGroups: undefined,
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid object value', function () {
            var elem = $('#gtest').jec({
                ignoreOptGroups: {
                    ignoreOptGroups: true
                },
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid array value', function () {
            var elem = $('#gtest').jec({
                ignoreOptGroups: [true],
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid function value', function () {
            var elem = $('#gtest').jec({
                ignoreOptGroups: function () {
                    return true;
                },
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid null value', function () {
            var elem = $('#gtest').jec({
                ignoreOptGroups: null,
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
    });
});

describe('JEC (init with JS)', function () {
    'use strict';
    var key = function (elem, code) {
            var list = ['keydown', 'keypress', 'keyup'];
            $.each(list, function () {
                var e = $.Event(this, {
                    keyCode: code
                });
                elem.trigger(e);
            });
        };

    describe('Combobox initialization', function () {
        it('should create a new combobox', function () {
            var elem = $.jec();
            assert.notEqual(elem.data('jecId'), undefined);
            assert.notEqual(elem.data('jecId'), null);
        });
    });

    describe('Options', function () {
        it('should create combobox', function () {
            var op = [
                1,
                1.2,
                'v1',
                {
                    k1: 'v1'
                },
                {
                    k2: 1,
                    k3: 1.2,
                    k4: 'v4'
                },
                [],
                undefined,
                null,
                true,
                {
                    g1: [
                        2.3,
                        2,
                        {
                            k5: 'v5',
                            k6: 3
                        },
                        'v6',
                        undefined,
                        null,
                        true
                    ]
                }
            ],
                elem = $.jec(op),
                getObjectKeys = function (obj) {
                    var keys = [],
                        objKey;
                    for (objKey in obj) {
                        if (obj.hasOwnProperty(objKey)) {
                            keys.push(objKey);
                        }
                    }
                    return keys;
                },
                og = op[9][getObjectKeys(op[9])[0]];

            assert.notEqual(elem.data('jecId'), undefined);
            assert.notEqual(elem.data('jecId'), null);

            assert.equal(elem.children('option:eq(1)').val(), op[0].toString());
            assert.equal(elem.children('option:eq(1)').text(), op[0].toString());
            assert.equal(elem.children('option:eq(2)').val(), op[1].toString());
            assert.equal(elem.children('option:eq(2)').text(), op[1].toString());
            assert.equal(elem.children('option:eq(3)').val(), op[2]);
            assert.equal(elem.children('option:eq(3)').text(), op[2]);
            assert.equal(elem.children('option:eq(4)').val(), getObjectKeys(op[3])[0]);
            assert.equal(elem.children('option:eq(4)').text(), op[3][getObjectKeys(op[3])[0]]);
            assert.equal(elem.children('option:eq(5)').val(), getObjectKeys(op[4])[0]);
            assert.equal(elem.children('option:eq(5)').text(), op[4][getObjectKeys(op[4])[0]]);
            assert.equal(elem.children('option:eq(6)').val(), getObjectKeys(op[4])[1]);
            assert.equal(elem.children('option:eq(6)').text(), op[4][getObjectKeys(op[4])[1]]);
            assert.equal(elem.children('option:eq(7)').val(), getObjectKeys(op[4])[2]);
            assert.equal(elem.children('option:eq(7)').text(), op[4][getObjectKeys(op[4])[2]]);
            assert.lengthOf(elem.children('option'), 8);

            assert.lengthOf(elem.children('optgroup'), 1);
            assert.equal(elem.children('optgroup').attr('label'), getObjectKeys(op[9])[0]);
            assert.lengthOf(elem.find('optgroup option'), 5);
            assert.equal(elem.find('optgroup option:eq(0)').val(), og[0]);
            assert.equal(elem.find('optgroup option:eq(0)').text(), og[0]);
            assert.equal(elem.find('optgroup option:eq(1)').val(), og[1]);
            assert.equal(elem.find('optgroup option:eq(1)').text(), og[1]);
            assert.equal(elem.find('optgroup option:eq(2)').val(), getObjectKeys(og[2])[0]);
            assert.equal(elem.find('optgroup option:eq(2)').text(), og[2][getObjectKeys(og[2])[0]]);
            assert.equal(elem.find('optgroup option:eq(3)').val(), getObjectKeys(og[2])[1]);
            assert.equal(elem.find('optgroup option:eq(3)').text(), og[2][getObjectKeys(og[2])[1]]);
            assert.equal(elem.find('optgroup option:eq(4)').val(), og[3]);
            assert.equal(elem.find('optgroup option:eq(4)').text(), og[3]);
        });

        it('should ignore options given as undefined', function () {
            var elem = $.jec(undefined);
            assert.lengthOf(elem.children('.jecEditableOption'), 1);
            assert.lengthOf(elem.children(':not(.jecEditableOption)'), 0);
        });

        it('should ignore options given as null', function () {
            var elem = $.jec(null);
            assert.lengthOf(elem.children('.jecEditableOption'), 1);
            assert.lengthOf(elem.children(':not(.jecEditableOption)'), 0);
        });

        it('should ignore options given as string', function () {
            var elem = $.jec('');
            assert.lengthOf(elem.children('.jecEditableOption'), 1);
            assert.lengthOf(elem.children(':not(.jecEditableOption)'), 0);
        });

        it('should ignore options given as int', function () {
            var elem = $.jec(1);
            assert.lengthOf(elem.children('.jecEditableOption'), 1);
            assert.lengthOf(elem.children(':not(.jecEditableOption)'), 0);
        });

        it('should ignore options given as float', function () {
            var elem = $.jec(1.2);
            assert.lengthOf(elem.children('.jecEditableOption'), 1);
            assert.lengthOf(elem.children(':not(.jecEditableOption)'), 0);
        });

        it('should ignore options given as boolean', function () {
            var elem = $.jec(true);
            assert.lengthOf(elem.children('.jecEditableOption'), 1);
            assert.lengthOf(elem.children(':not(.jecEditableOption)'), 0);
        });

        it('should ignore options given as object', function () {
            var elem = $.jec({
                k1: 'v1'
            });
            assert.lengthOf(elem.children('.jecEditableOption'), 1);
            assert.lengthOf(elem.children(':not(.jecEditableOption)'), 0);
        });
    });

    describe('Keyboard', function () {
        it('should behave correctly with keyboard', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']),
                option = elem.children('option.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), 'H');
            key(elem, 105);
            assert.equal(option.val(), 'Hi');
            key(elem, 32);
            assert.equal(option.val(), 'Hi ');
            key(elem, 33);
            assert.equal(option.val(), 'Hi !');
            key(elem, 8);
            assert.equal(option.val(), 'Hi ');
            key(elem, 46);
            assert.equal(option.val(), 'Hi');
        });
    });

    describe('Setting position', function () {
        it('should set the editable option on the specific position', function () {
            var position = 1,
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    position: position
                });
            assert.equal(elem.children('option').eq(position).hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the last position', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                position: 3
            });
            assert.equal(elem.children('option:last').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the last position (big value)', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                position: 100
            });
            assert.equal(elem.children('option:last').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring negative value', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                position: -1
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring float value', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                position: 2.2
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring string value', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                position: '1'
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring boolean value', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                position: true
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring undefined value', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                position: undefined
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring null value', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                position: null
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring object value', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                position: {
                    position: 1
                }
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring array value', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                position: [1]
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring function value', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                position: function () {
                    return 1;
                }
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
    });

    describe('Setting max length', function () {
        it('should set the max length to 2', function () {
            var i,
                length = 2,
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    maxLength: length
                });
            for (i = 0; i < length + 1; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
        it('should ignore too big max length value', function () {
            var i,
                length = 260,
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    maxLength: -1
                });
            for (i = 0; i < length; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), 255);
        });
        it('should ignore invalid negative max length value', function () {
            var i,
                length = 10,
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    maxLength: -1
                });
            for (i = 0; i < length; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
        it('should ignore invalid float max length value', function () {
            var i,
                length = 10,
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    maxLength: 1.2
                });
            for (i = 0; i < length; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
        it('should ignore invalid string max length value', function () {
            var i,
                length = 10,
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    maxLength: '1'
                });
            for (i = 0; i < length; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
        it('should ignore invalid boolean max length value', function () {
            var i,
                length = 10,
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    maxLength: true
                });
            for (i = 0; i < length; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
        it('should ignore invalid undefined max length value', function () {
            var i,
                length = 10,
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    maxLength: undefined
                });
            for (i = 0; i < length; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
        it('should ignore invalid null max length value', function () {
            var i,
                length = 10,
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    maxLength: null
                });
            for (i = 0; i < length; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
        it('should ignore invalid object max length value', function () {
            var i,
                length = 10,
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    maxLength: {
                        maxLength: 1
                    }
                });
            for (i = 0; i < length; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
        it('should ignore invalid array max length value', function () {
            var i,
                length = 10,
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    maxLength: [1]
                });
            for (i = 0; i < length; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
        it('should ignore invalid function max length value', function () {
            var i,
                length = 10,
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    maxLength: function () {
                        return 1;
                    }
                });
            for (i = 0; i < length; i += 1) {
                key(elem, 72);
            }
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
    });

    describe('Setting classes', function () {
        it('should not set any additional classes given as empty string', function () {

            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                classes: ''
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should set an additional class given as string', function () {
            var className = 'myClass1',
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    classes: className
                });
            assert.lengthOf(elem.attr('class').split(/\s+/), 1);
            assert.equal(elem.hasClass(className), true);
        });
        it('should set multiple additional class given as string', function () {
            var className1 = 'myClass1',
                className2 = 'myClass2',
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    classes: className1 + ' ' + className2
                });
            assert.lengthOf(elem.attr('class').split(/\s+/), 2);
            assert.equal(elem.hasClass(className1), true);
            assert.equal(elem.hasClass(className2), true);
        });
        it('should not set any additional classes given as empty array', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                classes: []
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should set an additional class given as array', function () {
            var className = 'myClass1',
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    classes: [className]
                });
            assert.lengthOf(elem.attr('class').split(/\s+/), 1);
            assert.equal(elem.hasClass(className), true);
        });
        it('should set multiple additional class given as array', function () {
            var className1 = 'myClass1',
                className2 = 'myClass2',
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    classes: [className1, className2]
                });
            assert.lengthOf(elem.attr('class').split(/\s+/), 2);
            assert.equal(elem.hasClass(className1), true);
            assert.equal(elem.hasClass(className2), true);
        });
        it('should fail to set any additional classes given as int', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                classes: 1
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should fail to set any additional classes given as float', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                classes: 1.2
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should fail to set any additional classes given as boolean', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                classes: true
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should fail to set any additional classes given as undefined', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                classes: undefined
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should fail to set any additional classes given as null', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                classes: null
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should fail to set any additional classes given as object', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                classes: {
                    classes: 'myClass1'
                }
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should fail to set any additional classes given as function', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                classes: function () {
                    return 'myClass';
                }
            });
            assert.equal(elem.attr('class'), undefined);
        });
    });

    describe('Setting option classes', function () {
        it('should not set any additional classes given as empty string', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                optionClasses: ''
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should set an additional class given as string', function () {
            var className = 'myClass1',
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    optionClasses: className
                }),
                option = elem.children('.jecEditableOption');
            assert.lengthOf(option.attr('class').split(/\s+/), 2);
            assert.equal(option.hasClass(className), true);
        });
        it('should set multiple additional class given as string', function () {
            var className1 = 'myClass1',
                className2 = 'myClass2',
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    optionClasses: className1 + ' ' + className2
                }),
                option = elem.children('.jecEditableOption');
            assert.lengthOf(option.attr('class').split(/\s+/), 3);
            assert.equal(option.hasClass(className1), true);
            assert.equal(option.hasClass(className2), true);
        });
        it('should not set any additional classes given as empty array', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                optionClasses: []
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should set an additional class given as array', function () {
            var className = 'myClass1',
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    optionClasses: [className]
                }),
                option = elem.children('.jecEditableOption');
            assert.lengthOf(option.attr('class').split(/\s+/), 2);
            assert.equal(option.hasClass(className), true);
        });
        it('should set multiple additional class given as array', function () {
            var className1 = 'myClass1',
                className2 = 'myClass2',
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    optionClasses: [className1, className2]
                }),
                option = elem.children('.jecEditableOption');
            assert.lengthOf(option.attr('class').split(/\s+/), 3);
            assert.equal(option.hasClass(className1), true);
            assert.equal(option.hasClass(className2), true);
        });
        it('should fail to set any additional classes given as int', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                optionClasses: 1
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should fail to set any additional classes given as float', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                optionClasses: 1.2
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should fail to set any additional classes given as boolean', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                optionClasses: true
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should fail to set any additional classes given as undefined', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                optionClasses: undefined
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should fail to set any additional classes given as null', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                optionClasses: null
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should fail to set any additional classes given as object', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                optionClasses: {
                    optionClasses: 'myClass1'
                }
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should fail to set any additional classes given as function', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                optionClasses: function () {
                    return 'myClass';
                }
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
    });

    describe('Setting styles', function () {
        it('should not set any additional styles given as empty object', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                styles: {}
            });
            assert.equal(elem.css('opacity'), 1);
        });
        it('should change the opacity to 0.5', function () {
            var opacity = 0.5,
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    styles: {
                        opacity: opacity
                    }
                });
            assert.equal(elem.css('opacity'), opacity);
        });
        it('should change the opacity to 0.5 and display to none', function () {
            var opacity = 0.5,
                display = 'none',
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    styles: {
                        opacity: opacity,
                        display: display
                    }
                });
            assert.equal(elem.css('opacity'), opacity);
            assert.equal(elem.css('display'), display);
        });
        it('should not set any additional styles given as string', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                styles: 'opacity: 0.5;'
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as int', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                styles: 1
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as float', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                styles: 1.2
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as undefined', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                styles: undefined
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as null', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                styles: null
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as boolean', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                styles: true
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as array', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                styles: ['opacity: 0.5;']
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as function', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                styles: function () {
                    return 'opacity: 0.5;';
                }
            });
            assert.equal(elem.attr('style'), undefined);
        });
    });

    describe('Setting option styles', function () {
        it('should not set any additional styles given as empty object', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                optionStyles: {}
            });
            assert.equal(elem.children('.jecEditableOption').css('opacity'), 1);
        });
        it('should change the opacity to 0.5', function () {
            var opacity = 0.5,
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    optionStyles: {
                        opacity: opacity
                    }
                });
            assert.equal(elem.children('.jecEditableOption').css('opacity'), opacity);
        });
        it('should change the opacity to 0.5 and display to none', function () {
            var opacity = 0.5,
                display = 'none',
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    optionStyles: {
                        opacity: opacity,
                        display: display
                    }
                }),
                option = elem.children('.jecEditableOption');
            assert.equal(option.css('opacity'), opacity);
            assert.equal(option.css('display'), display);
        });
        it('should not set any additional styles given as string', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                optionStyles: 'opacity: 0.5;'
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as int', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                optionStyles: 1
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as float', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                optionStyles: 1.2
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as undefined', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                optionStyles: undefined
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as null', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                optionStyles: null
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as boolean', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                optionStyles: true
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as array', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                optionStyles: ['opacity: 0.5;']
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as function', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                optionStyles: function () {
                    return 'opacity: 0.5;';
                }
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
    });
    describe('Setting trigger change event handler', function () {
        it('should respect attached change event handler', function () {
            var val = 0,
                handler = function () {
                    val = 1;
                },
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    triggerChangeEvent: true
                }).on('change', handler);
            key(elem, 72);
            assert.equal(val, 1);
            elem.off('change', handler);
        });
        it('should ignore change event handler', function () {
            var val = 0,
                handler = function () {
                    val = 1;
                },
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    triggerChangeEvent: false
                }).on('change', handler);
            key(elem, 72);
            assert.equal(val, 0);
            elem.off('change', handler);
        });
        it('should ignore setting change event handler flag given as string', function () {
            var val = 0,
                handler = function () {
                    val = 1;
                },
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    triggerChangeEvent: 'true'
                }).on('change', handler);
            key(elem, 72);
            assert.equal(val, 0);
            elem.off('change', handler);
        });
        it('should ignore setting change event handler flag given as int', function () {
            var val = 0,
                handler = function () {
                    val = 1;
                },
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    triggerChangeEvent: 1
                }).on('change', handler);
            key(elem, 72);
            assert.equal(val, 0);
            elem.off('change', handler);
        });
        it('should ignore setting change event handler flag given as float', function () {
            var val = 0,
                handler = function () {
                    val = 1;
                },
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    triggerChangeEvent: 1.2
                }).on('change', handler);
            key(elem, 72);
            assert.equal(val, 0);
            elem.off('change', handler);
        });
        it('should ignore setting change event handler flag given as undefined', function () {
            var val = 0,
                handler = function () {
                    val = 1;
                },
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    triggerChangeEvent: undefined
                }).on('change', handler);
            key(elem, 72);
            assert.equal(val, 0);
            elem.off('change', handler);
        });
        it('should ignore setting change event handler flag given as null', function () {
            var val = 0,
                handler = function () {
                    val = 1;
                },
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    triggerChangeEvent: null
                }).on('change', handler);
            key(elem, 72);
            assert.equal(val, 0);
            elem.off('change', handler);
        });
        it('should ignore setting change event handler flag given as object', function () {
            var val = 0,
                handler = function () {
                    val = 1;
                },
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    triggerChangeEvent: {
                        triggerChangeEvent: true
                    }
                }).on('change', handler);
            key(elem, 72);
            assert.equal(val, 0);
            elem.off('change', handler);
        });
        it('should ignore setting change event handler flag given as array', function () {
            var val = 0,
                handler = function () {
                    val = 1;
                },
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    triggerChangeEvent: [true]
                }).on('change', handler);
            key(elem, 72);
            assert.equal(val, 0);
            elem.off('change', handler);
        });
        it('should ignore setting change event handler flag given as function', function () {
            var val = 0,
                handler = function () {
                    val = 1;
                },
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    triggerChangeEvent: function () {
                        return true;
                    }
                }).on('change', handler);
            key(elem, 72);
            assert.equal(val, 0);
            elem.off('change', handler);
        });
    });
    describe('Setting focus on new option', function () {
        it('should move the focus to the new option', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                focusOnNewOption: true
            });
            assert.equal(elem.val(), '');
        });
        it('should leave the focus on the original place', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                focusOnNewOption: false
            });
            assert.equal(elem.val(), 'opt1');
        });
        it('should ignore the invalid string value', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                focusOnNewOption: 'true'
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid int value', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                focusOnNewOption: 1
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid float value', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                focusOnNewOption: 1.2
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid undefined value', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                focusOnNewOption: undefined
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid null value', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                focusOnNewOption: null
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid object value', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                focusOnNewOption: {
                    focusOnNewOption: true
                }
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid array value', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                focusOnNewOption: [true]
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid function value', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                focusOnNewOption: function () {
                    return true;
                }
            });
            assert.notEqual(elem.val(), '');
        });
    });
    describe('Setting use existing options', function () {
        it('should properly handle use existing options flag', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                useExistingOptions: true
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), 'opt1');
            elem.children('option:eq(2)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), 'opt2');
            elem.children('option:last').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), 'opt3');
        });
        it('should ignore value given as string', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                useExistingOptions: 'true'
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
        it('should ignore value given as int', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                useExistingOptions: 1
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
        it('should ignore value given as float', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                useExistingOptions: 1.2
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
        it('should ignore value given as undefined', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                useExistingOptions: undefined
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
        it('should ignore value given as null', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                useExistingOptions: null
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
        it('should ignore value given as array', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                useExistingOptions: [true]
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
        it('should ignore value given as object', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                useExistingOptions: {
                    useExistingOptions: true
                }
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
        it('should ignore value given as function', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                useExistingOptions: function () {
                    return true;
                }
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
    });
    describe('Setting ignored keys', function () {
        it('should properly handle ignored keys', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                ignoredKeys: [72, {
                    min: 73,
                    max: 75
                }]
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), '');
            key(elem, 74);
            assert.equal(option.val(), '');
            key(elem, 76);
            assert.equal(option.val(), 'L');
        });
        it('should ignore setting ignored keys given as string', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                ignoredKeys: '76'
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 76);
            assert.equal(option.val(), 'L');
        });
        it('should ignore setting ignored keys given as int', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                ignoredKeys: 76
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 76);
            assert.equal(option.val(), 'L');
        });
        it('should ignore setting ignored keys given as float', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                ignoredKeys: 76.1
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 76);
            assert.equal(option.val(), 'L');
        });
        it('should ignore setting ignored keys given as boolean', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                ignoredKeys: true
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 76);
            assert.equal(option.val(), 'L');
        });
        it('should ignore setting ignored keys given as undefined', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                ignoredKeys: undefined
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 76);
            assert.equal(option.val(), 'L');
        });
        it('should ignore setting ignored keys given as null', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                ignoredKeys: null
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 76);
            assert.equal(option.val(), 'L');
        });
        it('should ignore setting ignored keys given as object', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                ignoredKeys: {
                    ignoredKeys: [76]
                }
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 76);
            assert.equal(option.val(), 'L');
        });
        it('should ignore setting ignored keys given as function', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                ignoredKeys: function () {
                    return 76;
                }
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 76);
            assert.equal(option.val(), 'L');
        });
    });
    describe('Setting accepted keys', function () {
        it('should properly handle accepted keys', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                acceptedKeys: [72, {
                    min: 73,
                    max: 75
                }]
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), 'H');
            key(elem, 74);
            assert.equal(option.val(), 'HJ');
            key(elem, 76);
            assert.equal(option.val(), 'HJ');
        });
        it('should ignore setting accepted keys given as string', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                acceptedKeys: '76'
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), 'H');
        });
        it('should ignore setting accepted keys given as int', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                acceptedKeys: 76
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), 'H');
        });
        it('should ignore setting accepted keys given as float', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                acceptedKeys: 76.1
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), 'H');
        });
        it('should ignore setting accepted keys given as undefined', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                acceptedKeys: undefined
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), 'H');
        });
        it('should ignore setting accepted keys given as null', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                acceptedKeys: null
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), 'H');
        });
        it('should ignore setting accepted keys given as boolean', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                acceptedKeys: true
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), 'H');
        });
        it('should ignore setting accepted keys given as object', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                acceptedKeys: {
                    acceptedKeys: [76]
                }
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), 'H');
        });
        it('should ignore setting accepted keys given as function', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3'], {
                acceptedKeys: function () {
                    return 76;
                }
            }),
                option = elem.children('.jecEditableOption');
            key(elem, 72);
            assert.equal(option.val(), 'H');
        });
    });
    describe('Setting ignore option groups', function () {
        it('should correctly position editable option', function () {
            var elem = $.jec(['opt1', {
                gr1: ['opt2', 'opt3'],
                gr2: ['opt4', 'opt5']
            }], {
                ignoreOptGroups: false,
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should correctly position editable option inside the option group', function () {
            var elem = $.jec(['opt1', {
                gr1: ['opt2', 'opt3'],
                gr2: ['opt4', 'opt5']
            }], {
                ignoreOptGroups: true,
                position: 1
            });
            assert.equal(elem.children('optgroup:first').children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid string value', function () {
            var elem = $.jec(['opt1', {
                gr1: ['opt2', 'opt3'],
                gr2: ['opt4', 'opt5']
            }], {
                ignoreOptGroups: 'true',
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid int value', function () {
            var elem = $.jec(['opt1', {
                gr1: ['opt2', 'opt3'],
                gr2: ['opt4', 'opt5']
            }], {
                ignoreOptGroups: 1,
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid float value', function () {
            var elem = $.jec(['opt1', {
                gr1: ['opt2', 'opt3'],
                gr2: ['opt4', 'opt5']
            }], {
                ignoreOptGroups: 1.2,
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid undefined value', function () {
            var elem = $.jec(['opt1', {
                gr1: ['opt2', 'opt3'],
                gr2: ['opt4', 'opt5']
            }], {
                ignoreOptGroups: undefined,
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid object value', function () {
            var elem = $.jec(['opt1', {
                gr1: ['opt2', 'opt3'],
                gr2: ['opt4', 'opt5']
            }], {
                ignoreOptGroups: {
                    ignoreOptGroups: true
                },
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid array value', function () {
            var elem = $.jec(['opt1', {
                gr1: ['opt2', 'opt3'],
                gr2: ['opt4', 'opt5']
            }], {
                ignoreOptGroups: [true],
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid function value', function () {
            var elem = $.jec(['opt1', {
                gr1: ['opt2', 'opt3'],
                gr2: ['opt4', 'opt5']
            }], {
                ignoreOptGroups: function () {
                    return true;
                },
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid null value', function () {
            var elem = $.jec(['opt1', {
                gr1: ['opt2', 'opt3'],
                gr2: ['opt4', 'opt5']
            }], {
                ignoreOptGroups: null,
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
    });
});

describe('Retrieving value', function () {
    'use strict';
    describe('JEC', function () {
        it('should retrieve the editable value', function () {
            var elem = $('#test').jec(),
                val = 'v1';
            elem.children('.jecEditableOption').text(val).val(val);
            assert.equal(elem.jecValue(), val);
        });
    });

    describe('JEC (init with JS)', function () {
        it('should retrieve the editable value', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']),
                val = 'v1';
            elem.children('.jecEditableOption').text(val).val(val);
            assert.equal(elem.jecValue(), val);
        });
    });
});

describe('Setting value', function () {
    'use strict';
    describe('JEC', function () {
        it('should set the editable value', function () {
            var elem = $('#test').jec(),
                val = 'v1';
            elem.jecValue(val);
            assert.equal(elem.children('.jecEditableOption').text(), val);
            assert.equal(elem.children('.jecEditableOption').val(), val);
        });
    });

    describe('JEC (init with JS)', function () {
        it('should set the editable value given as string', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']),
                val = 'v1';
            elem.jecValue(val);
            assert.equal(elem.children('.jecEditableOption').text(), val);
            assert.equal(elem.children('.jecEditableOption').val(), val);
        });
        it('should set the editable value given as int', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']),
                val = 1;
            elem.jecValue(val);
            assert.equal(elem.children('.jecEditableOption').text(), val);
            assert.equal(elem.children('.jecEditableOption').val(), val);
        });
        it('should set the editable value given as float', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']),
                val = 1.2;
            elem.jecValue(val);
            assert.equal(elem.children('.jecEditableOption').text(), val);
            assert.equal(elem.children('.jecEditableOption').val(), val);
        });
        it('should fail to set the editable value given as undefined', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']);
            elem.jecValue(undefined);
            assert.equal(elem.children('.jecEditableOption').text(), '');
            assert.equal(elem.children('.jecEditableOption').val(), '');
        });
        it('should fail to set the editable value given as null', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']);
            elem.jecValue(null);
            assert.equal(elem.children('.jecEditableOption').text(), '');
            assert.equal(elem.children('.jecEditableOption').val(), '');
        });
        it('should fail to set the editable value given as boolean', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']);
            elem.jecValue(true);
            assert.equal(elem.children('.jecEditableOption').text(), '');
            assert.equal(elem.children('.jecEditableOption').val(), '');
        });
        it('should fail to set the editable value given as object', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']);
            elem.jecValue({});
            assert.equal(elem.children('.jecEditableOption').text(), '');
            assert.equal(elem.children('.jecEditableOption').val(), '');
        });
        it('should fail to set the editable value given as array', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']);
            elem.jecValue([]);
            assert.equal(elem.children('.jecEditableOption').text(), '');
            assert.equal(elem.children('.jecEditableOption').val(), '');
        });
        it('should fail to set the editable value given as function', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']);
            elem.jecValue(function () {
                return 'v1';
            });
            assert.equal(elem.children('.jecEditableOption').text(), '');
            assert.equal(elem.children('.jecEditableOption').val(), '');
        });
    });
});

describe('Getting preference', function () {
    'use strict';
    describe('JEC', function () {
        it('should retrieve the preference', function () {
            var elem = $('#test').jec(),
                defaults = {
                    position: 0,
                    classes: [],
                    styles: {},
                    optionClasses: [],
                    optionStyles: {},
                    focusOnNewOption: false,
                    useExistingOptions: false,
                    ignoredKeys: [],
                    acceptedKeys: [[32, 126], [191, 382]]
                },
                acceptedKeys = [],
                i;

            assert.equal(elem.jecPref('position'), defaults.position);
            assert.deepEqual(elem.jecPref('classes'), defaults.classes);
            assert.deepEqual(elem.jecPref('styles'), defaults.styles);
            assert.deepEqual(elem.jecPref('optionClasses'), defaults.optionClasses);
            assert.deepEqual(elem.jecPref('optionStyles'), defaults.optionStyles);
            assert.equal(elem.jecPref('focusOnNewOption'), defaults.focusOnNewOption);
            assert.equal(elem.jecPref('useExistingOptions'), defaults.useExistingOptions);
            assert.deepEqual(elem.jecPref('ignoredKeys'), defaults.ignoredKeys);

            for (i = defaults.acceptedKeys[0][0]; i <= defaults.acceptedKeys[0][1]; i += 1) {
                acceptedKeys.push(i);
            }
            for (i = defaults.acceptedKeys[1][0]; i <= defaults.acceptedKeys[1][1]; i += 1) {
                acceptedKeys.push(i);
            }

            assert.deepEqual(elem.jecPref('acceptedKeys'), acceptedKeys);
        });
    });

    describe('JEC (init with JS)', function () {
        it('should retrieve the preference', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']),
                defaults = {
                    position: 0,
                    classes: [],
                    styles: {},
                    optionClasses: [],
                    optionStyles: {},
                    focusOnNewOption: false,
                    useExistingOptions: false,
                    ignoredKeys: [],
                    acceptedKeys: [[32, 126], [191, 382]]
                },
                acceptedKeys = [],
                i;

            assert.equal(elem.jecPref('position'), defaults.position);
            assert.deepEqual(elem.jecPref('classes'), defaults.classes);
            assert.deepEqual(elem.jecPref('styles'), defaults.styles);
            assert.deepEqual(elem.jecPref('optionClasses'), defaults.optionClasses);
            assert.deepEqual(elem.jecPref('optionStyles'), defaults.optionStyles);
            assert.equal(elem.jecPref('focusOnNewOption'), defaults.focusOnNewOption);
            assert.equal(elem.jecPref('useExistingOptions'), defaults.useExistingOptions);
            assert.deepEqual(elem.jecPref('ignoredKeys'), defaults.ignoredKeys);

            for (i = defaults.acceptedKeys[0][0]; i <= defaults.acceptedKeys[0][1]; i += 1) {
                acceptedKeys.push(i);
            }
            for (i = defaults.acceptedKeys[1][0]; i <= defaults.acceptedKeys[1][1]; i += 1) {
                acceptedKeys.push(i);
            }

            assert.deepEqual(elem.jecPref('acceptedKeys'), acceptedKeys);
        });
    });
});

describe('Setting preference', function () {
    'use strict';
    describe('JEC', function () {
        describe('Position', function () {
            it('should set the position', function () {
                var elem = $('#test').jec(),
                    position = 1;
                elem.jecPref('position', position);
                assert.equal(elem.jecPref('position'), position);
            });
            it('should ignore position given as float', function () {
                var elem = $('#test').jec();
                elem.jecPref('position', 1.2);
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as string', function () {
                var elem = $('#test').jec();
                elem.jecPref('position', '1');
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as undefined', function () {
                var elem = $('#test').jec();
                elem.jecPref('position', undefined);
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as null', function () {
                var elem = $('#test').jec();
                elem.jecPref('position', null);
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as boolean', function () {
                var elem = $('#test').jec();
                elem.jecPref('position', true);
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as object', function () {
                var elem = $('#test').jec();
                elem.jecPref('position', {
                    position: {
                        position: 1
                    }
                });
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as array', function () {
                var elem = $('#test').jec();
                elem.jecPref('position', [1]);
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as function', function () {
                var elem = $('#test').jec();
                elem.jecPref('position', function () {
                    return 1;
                });
                assert.equal(elem.jecPref('position'), 0);
            });
        });

        describe('Max length', function () {
            it('should set the max length', function () {
                var elem = $('#test').jec(),
                    maxLength = 3;
                elem.jecPref('maxLength', maxLength);
                assert.equal(elem.jecPref('maxLength'), maxLength);
            });
            it('should ignore negative length', function () {
                var elem = $('#test').jec();
                elem.jecPref('maxLength', -1);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore too big length', function () {
                var elem = $('#test').jec();
                elem.jecPref('maxLength', 260);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as float', function () {
                var elem = $('#test').jec();
                elem.jecPref('maxLength', 1.2);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as string', function () {
                var elem = $('#test').jec();
                elem.jecPref('maxLength', '1');
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as undefined', function () {
                var elem = $('#test').jec();
                elem.jecPref('maxLength', undefined);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as null', function () {
                var elem = $('#test').jec();
                elem.jecPref('maxLength', null);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as boolean', function () {
                var elem = $('#test').jec();
                elem.jecPref('maxLength', true);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as object', function () {
                var elem = $('#test').jec();
                elem.jecPref('maxLength', {
                    maxLength: 1
                });
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as array', function () {
                var elem = $('#test').jec();
                elem.jecPref('maxLength', [1]);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as function', function () {
                var elem = $('#test').jec();
                elem.jecPref('maxLength', function () {
                    return 1;
                });
                assert.equal(elem.jecPref('maxLength'), 255);
            });
        });

        describe('Classes', function () {
            it('should set the classes given as string', function () {
                var elem = $('#test').jec(),
                    classes = 'myClass1';
                elem.jecPref('classes', classes);
                assert.deepEqual(elem.jecPref('classes'), [classes]);
            });
            it('should set multiple classes given as string', function () {
                var elem = $('#test').jec(),
                    classes = 'myClass1 myClass2';
                elem.jecPref('classes', classes);
                assert.deepEqual(elem.jecPref('classes'), classes.split(/\s+/));
            });
            it('should set the classes given as array', function () {
                var elem = $('#test').jec(),
                    classes = ['myClass1', 'myClass2'];
                elem.jecPref('classes', classes);
                assert.deepEqual(elem.jecPref('classes'), classes);
            });
            it('should ignore classes given as int', function () {
                var elem = $('#test').jec();
                elem.jecPref('classes', 1);
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as float', function () {
                var elem = $('#test').jec();
                elem.jecPref('classes', 1.2);
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as undefined', function () {
                var elem = $('#test').jec();
                elem.jecPref('classes', undefined);
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as null', function () {
                var elem = $('#test').jec();
                elem.jecPref('classes', null);
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as boolean', function () {
                var elem = $('#test').jec();
                elem.jecPref('classes', true);
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as object', function () {
                var elem = $('#test').jec();
                elem.jecPref('classes', {
                    classes: 1
                });
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as function', function () {
                var elem = $('#test').jec();
                elem.jecPref('classes', function () {
                    return 1;
                });
                assert.equal(elem.jecPref('classes'), 0);
            });
        });

        describe('Styles', function () {
            it('should set the styles', function () {
                var elem = $('#test').jec(),
                    styles = {
                        opacity: 0.5,
                        'display': 'none'
                    };
                elem.jecPref('styles', styles);
                assert.deepEqual(elem.jecPref('styles'), styles);
            });
            it('should ignore styles given as string', function () {
                var elem = $('#test').jec();
                elem.jecPref('styles', 'opacity: 0.5');
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as int', function () {
                var elem = $('#test').jec();
                elem.jecPref('styles', 1);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as float', function () {
                var elem = $('#test').jec();
                elem.jecPref('styles', 1.2);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as undefined', function () {
                var elem = $('#test').jec();
                elem.jecPref('styles', undefined);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as null', function () {
                var elem = $('#test').jec();
                elem.jecPref('styles', null);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as boolean', function () {
                var elem = $('#test').jec();
                elem.jecPref('styles', true);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as array', function () {
                var elem = $('#test').jec();
                elem.jecPref('styles', ['opacity: 0.5']);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as function', function () {
                var elem = $('#test').jec();
                elem.jecPref('styles', function () {
                    return 1;
                });
                assert.deepEqual(elem.jecPref('styles'), {});
            });
        });

        describe('Option classes', function () {
            it('should set the option classes given as string', function () {
                var elem = $('#test').jec(),
                    optionClasses = 'myClass1';
                elem.jecPref('optionClasses', optionClasses);
                assert.deepEqual(elem.jecPref('optionClasses'), [optionClasses]);
            });
            it('should set multiple option classes given as string', function () {
                var elem = $('#test').jec(),
                    optionClasses = 'myClass1 myClass2';
                elem.jecPref('optionClasses', optionClasses);
                assert.deepEqual(elem.jecPref('optionClasses'), optionClasses.split(/\s+/));
            });
            it('should set the option classes given as array', function () {
                var elem = $('#test').jec(),
                    optionClasses = ['myClass1', 'myClass2'];
                elem.jecPref('optionClasses', optionClasses);
                assert.deepEqual(elem.jecPref('optionClasses'), optionClasses);
            });
            it('should ignore option classes given as int', function () {
                var elem = $('#test').jec();
                elem.jecPref('optionClasses', 1);
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as float', function () {
                var elem = $('#test').jec();
                elem.jecPref('optionClasses', 1.2);
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as undefined', function () {
                var elem = $('#test').jec();
                elem.jecPref('optionClasses', undefined);
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as null', function () {
                var elem = $('#test').jec();
                elem.jecPref('optionClasses', null);
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as boolean', function () {
                var elem = $('#test').jec();
                elem.jecPref('optionClasses', true);
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as object', function () {
                var elem = $('#test').jec();
                elem.jecPref('optionClasses', {
                    optionClasses: 1
                });
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as function', function () {
                var elem = $('#test').jec();
                elem.jecPref('optionClasses', function () {
                    return 1;
                });
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
        });

        describe('Option styles', function () {
            it('should set the styles', function () {
                var elem = $('#test').jec(),
                    optionStyles = {
                        opacity: 0.5,
                        'display': 'none'
                    };
                elem.jecPref('optionStyles', optionStyles);
                assert.deepEqual(elem.jecPref('optionStyles'), optionStyles);
            });
            it('should ignore option styles given as string', function () {
                var elem = $('#test').jec();
                elem.jecPref('optionStyles', 'opacity: 0.5');
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as int', function () {
                var elem = $('#test').jec();
                elem.jecPref('optionStyles', 1);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as float', function () {
                var elem = $('#test').jec();
                elem.jecPref('optionStyles', 1.2);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as undefined', function () {
                var elem = $('#test').jec();
                elem.jecPref('optionStyles', undefined);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as null', function () {
                var elem = $('#test').jec();
                elem.jecPref('optionStyles', null);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as boolean', function () {
                var elem = $('#test').jec();
                elem.jecPref('optionStyles', true);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as array', function () {
                var elem = $('#test').jec();
                elem.jecPref('optionStyles', ['opacity: 0.5']);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as function', function () {
                var elem = $('#test').jec();
                elem.jecPref('optionStyles', function () {
                    return 1;
                });
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
        });

        describe('Focus on new option', function () {
            it('should set the focus on new option', function () {
                var elem = $('#test').jec(),
                    focusOnNewOption = true;
                elem.jecPref('focusOnNewOption', focusOnNewOption);
                assert.equal(elem.jecPref('focusOnNewOption'), focusOnNewOption);
            });
            it('should ignore focus on new option given as int', function () {
                var elem = $('#test').jec();
                elem.jecPref('focusOnNewOption', 1);
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as float', function () {
                var elem = $('#test').jec();
                elem.jecPref('focusOnNewOption', 1.2);
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as string', function () {
                var elem = $('#test').jec();
                elem.jecPref('focusOnNewOption', '1');
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as undefined', function () {
                var elem = $('#test').jec();
                elem.jecPref('focusOnNewOption', undefined);
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as null', function () {
                var elem = $('#test').jec();
                elem.jecPref('focusOnNewOption', null);
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as object', function () {
                var elem = $('#test').jec();
                elem.jecPref('focusOnNewOption', {
                    focusOnNewOption: {
                        focusOnNewOption: true
                    }
                });
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as array', function () {
                var elem = $('#test').jec();
                elem.jecPref('focusOnNewOption', [true]);
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as function', function () {
                var elem = $('#test').jec();
                elem.jecPref('focusOnNewOption', function () {
                    return true;
                });
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
        });

        describe('Use existing options', function () {
            it('should set the use existing options', function () {
                var elem = $('#test').jec(),
                    useExistingOptions = true;
                elem.jecPref('useExistingOptions', useExistingOptions);
                assert.equal(elem.jecPref('useExistingOptions'), useExistingOptions);
            });
            it('should ignore use existing options given as int', function () {
                var elem = $('#test').jec();
                elem.jecPref('useExistingOptions', 1);
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as float', function () {
                var elem = $('#test').jec();
                elem.jecPref('useExistingOptions', 1.2);
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as string', function () {
                var elem = $('#test').jec();
                elem.jecPref('useExistingOptions', '1');
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as undefined', function () {
                var elem = $('#test').jec();
                elem.jecPref('useExistingOptions', undefined);
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as null', function () {
                var elem = $('#test').jec();
                elem.jecPref('useExistingOptions', null);
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as object', function () {
                var elem = $('#test').jec();
                elem.jecPref('useExistingOptions', {
                    useExistingOptions: {
                        useExistingOptions: true
                    }
                });
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as array', function () {
                var elem = $('#test').jec();
                elem.jecPref('useExistingOptions', [true]);
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as function', function () {
                var elem = $('#test').jec();
                elem.jecPref('useExistingOptions', function () {
                    return true;
                });
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
        });

        describe('Ignored keys', function () {
            it('should set the ignored keys', function () {
                var elem = $('#test').jec(),
                    ignoredKeys = [
                        {
                            min: 10,
                            max: 15
                        },
                        35,
                        55
                    ];
                elem.jecPref('ignoredKeys', ignoredKeys);
                assert.deepEqual(elem.jecPref('ignoredKeys'), [10, 11, 12, 13, 14, 15, 35, 55]);
            });
            it('should ignore ignored keys given as int', function () {
                var elem = $('#test').jec();
                elem.jecPref('ignoredKeys', 1);
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as float', function () {
                var elem = $('#test').jec();
                elem.jecPref('ignoredKeys', 1.2);
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as string', function () {
                var elem = $('#test').jec();
                elem.jecPref('ignoredKeys', '1');
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as undefined', function () {
                var elem = $('#test').jec();
                elem.jecPref('ignoredKeys', undefined);
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as null', function () {
                var elem = $('#test').jec();
                elem.jecPref('ignoredKeys', null);
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as object', function () {
                var elem = $('#test').jec();
                elem.jecPref('ignoredKeys', {
                    ignoredKeys: {
                        ignoredKeys: true
                    }
                });
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as bool', function () {
                var elem = $('#test').jec();
                elem.jecPref('ignoredKeys', true);
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as function', function () {
                var elem = $('#test').jec();
                elem.jecPref('ignoredKeys', function () {
                    return true;
                });
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
        });

        describe('Accepted keys', function () {
            var i,
                keys = [];
            for (i = 32; i <= 126; i += 1) {
                keys.push(i);
            }
            for (i = 191; i <= 382; i += 1) {
                keys.push(i);
            }

            it('should set the accepted keys', function () {
                var elem = $('#test').jec(),
                    acceptedKeys = [
                        {
                            min: 10,
                            max: 15
                        },
                        35,
                        55
                    ];
                elem.jecPref('acceptedKeys', acceptedKeys);
                assert.deepEqual(elem.jecPref('acceptedKeys'), [10, 11, 12, 13, 14, 15, 35, 55]);
            });
            it('should ignore accepted keys given as int', function () {
                var elem = $('#test').jec();
                elem.jecPref('acceptedKeys', 1);
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as float', function () {
                var elem = $('#test').jec();
                elem.jecPref('acceptedKeys', 1.2);
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as string', function () {
                var elem = $('#test').jec();
                elem.jecPref('acceptedKeys', '1');
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as undefined', function () {
                var elem = $('#test').jec();
                elem.jecPref('acceptedKeys', undefined);
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as null', function () {
                var elem = $('#test').jec();
                elem.jecPref('acceptedKeys', null);
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as object', function () {
                var elem = $('#test').jec();
                elem.jecPref('acceptedKeys', {
                    acceptedKeys: {
                        acceptedKeys: true
                    }
                });
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as bool', function () {
                var elem = $('#test').jec();
                elem.jecPref('acceptedKeys', true);
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as function', function () {
                var elem = $('#test').jec();
                elem.jecPref('acceptedKeys', function () {
                    return true;
                });
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
        });
    });

    describe('JEC (init with JS)', function () {
        describe('Position', function () {
            it('should set the position', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    position = 1;
                elem.jecPref('position', position);
                assert.equal(elem.jecPref('position'), position);
            });
            it('should ignore position given as float', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('position', 1.2);
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as string', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('position', '1');
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as undefined', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('position', undefined);
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as null', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('position', null);
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as boolean', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('position', true);
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as object', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('position', {
                    position: {
                        position: 1
                    }
                });
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as array', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('position', [1]);
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as function', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('position', function () {
                    return 1;
                });
                assert.equal(elem.jecPref('position'), 0);
            });
        });

        describe('Max length', function () {
            it('should set the max length', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    maxLength = 3;
                elem.jecPref('maxLength', maxLength);
                assert.equal(elem.jecPref('maxLength'), maxLength);
            });
            it('should ignore negative length', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('maxLength', -1);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore too big length', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('maxLength', 260);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as float', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('maxLength', 1.2);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as string', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('maxLength', '1');
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as undefined', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('maxLength', undefined);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as null', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('maxLength', null);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as boolean', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('maxLength', true);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as object', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('maxLength', {
                    maxLength: 1
                });
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as array', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('maxLength', [1]);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as function', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('maxLength', function () {
                    return 1;
                });
                assert.equal(elem.jecPref('maxLength'), 255);
            });
        });

        describe('Classes', function () {
            it('should set the classes given as string', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    classes = 'myClass1';
                elem.jecPref('classes', classes);
                assert.deepEqual(elem.jecPref('classes'), [classes]);
            });
            it('should set multiple classes given as string', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    classes = 'myClass1 myClass2';
                elem.jecPref('classes', classes);
                assert.deepEqual(elem.jecPref('classes'), classes.split(/\s+/));
            });
            it('should set the classes given as array', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    classes = ['myClass1', 'myClass2'];
                elem.jecPref('classes', classes);
                assert.deepEqual(elem.jecPref('classes'), classes);
            });
            it('should ignore classes given as int', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('classes', 1);
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as float', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('classes', 1.2);
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as undefined', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('classes', undefined);
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as null', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('classes', null);
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as boolean', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('classes', true);
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as object', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('classes', {
                    classes: 1
                });
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as function', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('classes', function () {
                    return 1;
                });
                assert.equal(elem.jecPref('classes'), 0);
            });
        });

        describe('Styles', function () {
            it('should set the styles', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    styles = {
                        opacity: 0.5,
                        'display': 'none'
                    };
                elem.jecPref('styles', styles);
                assert.deepEqual(elem.jecPref('styles'), styles);
            });
            it('should ignore styles given as string', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('styles', 'opacity: 0.5');
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as int', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('styles', 1);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as float', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('styles', 1.2);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as undefined', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('styles', undefined);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as null', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('styles', null);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as boolean', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('styles', true);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as array', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('styles', ['opacity: 0.5']);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as function', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('styles', function () {
                    return 1;
                });
                assert.deepEqual(elem.jecPref('styles'), {});
            });
        });

        describe('Option classes', function () {
            it('should set the option classes given as string', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    optionClasses = 'myClass1';
                elem.jecPref('optionClasses', optionClasses);
                assert.deepEqual(elem.jecPref('optionClasses'), [optionClasses]);
            });
            it('should set multiple option classes given as string', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    optionClasses = 'myClass1 myClass2';
                elem.jecPref('optionClasses', optionClasses);
                assert.deepEqual(elem.jecPref('optionClasses'), optionClasses.split(/\s+/));
            });
            it('should set the option classes given as array', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    optionClasses = ['myClass1', 'myClass2'];
                elem.jecPref('optionClasses', optionClasses);
                assert.deepEqual(elem.jecPref('optionClasses'), optionClasses);
            });
            it('should ignore option classes given as int', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionClasses', 1);
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as float', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionClasses', 1.2);
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as undefined', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionClasses', undefined);
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as null', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionClasses', null);
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as boolean', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionClasses', true);
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as object', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionClasses', {
                    optionClasses: 1
                });
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as function', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionClasses', function () {
                    return 1;
                });
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
        });

        describe('Option styles', function () {
            it('should set the styles', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    optionStyles = {
                        opacity: 0.5,
                        'display': 'none'
                    };
                elem.jecPref('optionStyles', optionStyles);
                assert.deepEqual(elem.jecPref('optionStyles'), optionStyles);
            });
            it('should ignore option styles given as string', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionStyles', 'opacity: 0.5');
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as int', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionStyles', 1);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as float', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionStyles', 1.2);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as undefined', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionStyles', undefined);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as null', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionStyles', null);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as boolean', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionStyles', true);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as array', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionStyles', ['opacity: 0.5']);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as function', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionStyles', function () {
                    return 1;
                });
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
        });

        describe('Focus on new option', function () {
            it('should set the focus on new option', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    focusOnNewOption = true;
                elem.jecPref('focusOnNewOption', focusOnNewOption);
                assert.equal(elem.jecPref('focusOnNewOption'), focusOnNewOption);
            });
            it('should ignore focus on new option given as int', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('focusOnNewOption', 1);
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as float', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('focusOnNewOption', 1.2);
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as string', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('focusOnNewOption', '1');
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as undefined', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('focusOnNewOption', undefined);
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as null', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('focusOnNewOption', null);
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as object', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('focusOnNewOption', {
                    focusOnNewOption: {
                        focusOnNewOption: true
                    }
                });
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as array', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('focusOnNewOption', [true]);
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as function', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('focusOnNewOption', function () {
                    return true;
                });
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
        });

        describe('Use existing options', function () {
            it('should set the use existing options', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    useExistingOptions = true;
                elem.jecPref('useExistingOptions', useExistingOptions);
                assert.equal(elem.jecPref('useExistingOptions'), useExistingOptions);
            });
            it('should ignore use existing options given as int', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('useExistingOptions', 1);
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as float', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('useExistingOptions', 1.2);
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as string', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('useExistingOptions', '1');
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as undefined', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('useExistingOptions', undefined);
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as null', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('useExistingOptions', null);
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as object', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('useExistingOptions', {
                    useExistingOptions: {
                        useExistingOptions: true
                    }
                });
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as array', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('useExistingOptions', [true]);
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as function', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('useExistingOptions', function () {
                    return true;
                });
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
        });

        describe('Ignored keys', function () {
            it('should set the ignored keys', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    ignoredKeys = [
                        {
                            min: 10,
                            max: 15
                        },
                        35,
                        55
                    ];
                elem.jecPref('ignoredKeys', ignoredKeys);
                assert.deepEqual(elem.jecPref('ignoredKeys'), [10, 11, 12, 13, 14, 15, 35, 55]);
            });
            it('should ignore ignored keys given as int', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('ignoredKeys', 1);
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as float', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('ignoredKeys', 1.2);
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as string', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('ignoredKeys', '1');
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as undefined', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('ignoredKeys', undefined);
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as null', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('ignoredKeys', null);
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as object', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('ignoredKeys', {
                    ignoredKeys: {
                        ignoredKeys: true
                    }
                });
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as bool', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('ignoredKeys', true);
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as function', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('ignoredKeys', function () {
                    return true;
                });
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
        });

        describe('Accepted keys', function () {
            var i,
                keys = [];
            for (i = 32; i <= 126; i += 1) {
                keys.push(i);
            }
            for (i = 191; i <= 382; i += 1) {
                keys.push(i);
            }

            it('should set the accepted keys', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    acceptedKeys = [
                        {
                            min: 10,
                            max: 15
                        },
                        35,
                        55
                    ];
                elem.jecPref('acceptedKeys', acceptedKeys);
                assert.deepEqual(elem.jecPref('acceptedKeys'), [10, 11, 12, 13, 14, 15, 35, 55]);
            });
            it('should ignore accepted keys given as int', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('acceptedKeys', 1);
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as float', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('acceptedKeys', 1.2);
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as string', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('acceptedKeys', '1');
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as undefined', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('acceptedKeys', undefined);
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as null', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('acceptedKeys', null);
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as object', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('acceptedKeys', {
                    acceptedKeys: {
                        acceptedKeys: true
                    }
                });
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as bool', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('acceptedKeys', true);
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as function', function () {
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('acceptedKeys', function () {
                    return true;
                });
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
        });
    });
});

describe('Disable', function () {
    'use strict';
    describe('JEC', function () {
        it('should properly disable editable functionality', function () {
            var elem = $('#test').jec();
            elem.jecOff();
            assert.lengthOf(elem.children('option'), 3);
            assert.notEqual(elem.data('jecId'), undefined);
        });
    });

    describe('JEC (init with JS)', function () {
        it('should properly disable editable functionality', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']);
            elem.jecOff();
            assert.lengthOf(elem.children('option'), 3);
            assert.notEqual(elem.data('jecId'), undefined);
        });
    });
});

describe('Enable', function () {
    'use strict';
    describe('JEC', function () {
        it('should properly enable editable functionality', function () {
            var elem = $('#test').jec();
            elem.jecOff();
            elem.jecOn();
            assert.lengthOf(elem.children('.jecEditableOption'), 1);
            assert.lengthOf(elem.children(':not(.jecEditableOption)'), 3);
            assert.notEqual(elem.data('jecId'), undefined);
        });
    });

    describe('JEC (init with JS)', function () {
        it('should properly enable editable functionality', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']);
            elem.jecOff();
            elem.jecOn();
            assert.lengthOf(elem.children('.jecEditableOption'), 1);
            assert.lengthOf(elem.children(':not(.jecEditableOption)'), 3);
            assert.notEqual(elem.data('jecId'), undefined);
        });
    });
});

describe('Kill', function () {
    'use strict';
    describe('JEC', function () {
        it('should properly kill editable functionality', function () {
            var elem = $('#test').jec();
            elem.jecKill();
            assert.lengthOf(elem.children('option'), 3);
            assert.equal(elem.data('jecId'), undefined);
        });
    });

    describe('JEC (init with JS)', function () {
        it('should properly kill editable functionality', function () {
            var elem = $.jec(['opt1', 'opt2', 'opt3']);
            elem.jecKill();
            assert.lengthOf(elem.children('option'), 3);
            assert.equal(elem.data('jecId'), undefined);
        });
    });
});

describe('Other', function () {
    'use strict';
    it('should remove classes when destroyed', function () {
        var elem = $('#test').jec({
            classes: ['myClass1', 'myClass2']
        });
        elem.jecKill();
        assert.equal(elem.attr('class') === undefined || elem.attr('class') === '', true);
    });

    it('should remove styles when destroyed', function () {
        var elem = $('#test').jec({
            styles: {
                opacity: 0.5
            }
        });
        elem.jecKill();
        assert.equal(elem.css('opacity'), 1);
    });

    it('should properly handle key codes', function () {
        var elem = $('#test').jec(),
            list = ['keydown', 'keypress', 'keyup'];

        $.each(list, function () {
            var e = $.Event(this, {
                charCode: 72
            });
            elem.trigger(e);
        });
        assert.equal(elem.children('.jecEditableOption').text(), 'H');
        assert.equal(elem.children('.jecEditableOption').val(), 'H');
    });
});