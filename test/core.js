/*jslint indent: 4, maxlen: 120 */
/*global describe, it, window, $*/
describe('JEC', function () {
    'use strict';
    var assert = window.assert,
        init = window.init,
        key = function (elem, code) {
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
            init();
            var elem = $('#test').jec();
            assert.notEqual(elem.data('jecId'), undefined);
            assert.notEqual(elem.data('jecId'), null);
        });
    });

    describe('Keyboard', function () {
        it('should behave correctly with keyboard', function () {
            init();
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
            init();
            var position = 1,
                elem = $('#test').jec({
                    position: position
                });
            assert.equal(elem.children('option').eq(position).hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the last position', function () {
            init();
            var elem = $('#test').jec({
                position: 3
            });
            assert.equal(elem.children('option:last').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the last position (big value)', function () {
            init();
            var elem = $('#test').jec({
                position: 100
            });
            assert.equal(elem.children('option:last').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring negative value', function () {
            init();
            var elem = $('#test').jec({
                position: -1
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring float value', function () {
            init();
            var elem = $('#test').jec({
                position: 2.2
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring string value', function () {
            init();
            var elem = $('#test').jec({
                position: '1'
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring boolean value', function () {
            init();
            var elem = $('#test').jec({
                position: true
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring undefined value', function () {
            init();
            var elem = $('#test').jec({
                position: undefined
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring null value', function () {
            init();
            var elem = $('#test').jec({
                position: null
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring object value', function () {
            init();
            var elem = $('#test').jec({
                position: {
                    position: 1
                }
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring array value', function () {
            init();
            var elem = $('#test').jec({
                position: [1]
            });
            assert.equal(elem.children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should set the editable option on the default ignoring function value', function () {
            init();
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
            init();
            var length = 2,
                elem = $('#test').jec({
                    maxLength: length
                });
            key(elem, 72);
            key(elem, 72);
            key(elem, 72);
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
        });
        it('should ignore invalid negative max length value', function () {
            init();
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
            init();
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
            init();
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
            init();
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
            init();
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
            init();
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
            init();
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
            init();
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
            init();
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
            init();
            var elem = $('#test').jec({
                classes: ''
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should set an additional class given as string', function () {
            init();
            var className = 'myClass1',
                elem = $('#test').jec({
                    classes: className
                });
            assert.lengthOf(elem.attr('class').split(/\s+/), 1);
            assert.equal(elem.hasClass(className), true);
        });
        it('should set multiple additional class given as string', function () {
            init();
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
            init();
            var elem = $('#test').jec({
                classes: []
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should set an additional class given as array', function () {
            init();
            var className = 'myClass1',
                elem = $('#test').jec({
                    classes: [className]
                });
            assert.lengthOf(elem.attr('class').split(/\s+/), 1);
            assert.equal(elem.hasClass(className), true);
        });
        it('should set multiple additional class given as array', function () {
            init();
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
            init();
            var elem = $('#test').jec({
                classes: 1
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should fail to set any additional classes given as float', function () {
            init();
            var elem = $('#test').jec({
                classes: 1.2
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should fail to set any additional classes given as boolean', function () {
            init();
            var elem = $('#test').jec({
                classes: true
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should fail to set any additional classes given as undefined', function () {
            init();
            var elem = $('#test').jec({
                classes: undefined
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should fail to set any additional classes given as null', function () {
            init();
            var elem = $('#test').jec({
                classes: null
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should fail to set any additional classes given as object', function () {
            init();
            var elem = $('#test').jec({
                classes: {
                    classes: 'myClass1'
                }
            });
            assert.equal(elem.attr('class'), undefined);
        });
        it('should fail to set any additional classes given as function', function () {
            init();
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
            init();
            var elem = $('#test').jec({
                optionClasses: ''
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should set an additional class given as string', function () {
            init();
            var className = 'myClass1',
                elem = $('#test').jec({
                    optionClasses: className
                }),
                option = elem.children('.jecEditableOption');
            assert.lengthOf(option.attr('class').split(/\s+/), 2);
            assert.equal(option.hasClass(className), true);
        });
        it('should set multiple additional class given as string', function () {
            init();
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
            init();
            var elem = $('#test').jec({
                optionClasses: []
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should set an additional class given as array', function () {
            init();
            var className = 'myClass1',
                elem = $('#test').jec({
                    optionClasses: [className]
                }),
                option = elem.children('.jecEditableOption');
            assert.lengthOf(option.attr('class').split(/\s+/), 2);
            assert.equal(option.hasClass(className), true);
        });
        it('should set multiple additional class given as array', function () {
            init();
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
            init();
            var elem = $('#test').jec({
                optionClasses: 1
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should fail to set any additional classes given as float', function () {
            init();
            var elem = $('#test').jec({
                optionClasses: 1.2
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should fail to set any additional classes given as boolean', function () {
            init();
            var elem = $('#test').jec({
                optionClasses: true
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should fail to set any additional classes given as undefined', function () {
            init();
            var elem = $('#test').jec({
                optionClasses: undefined
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should fail to set any additional classes given as null', function () {
            init();
            var elem = $('#test').jec({
                optionClasses: null
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should fail to set any additional classes given as object', function () {
            init();
            var elem = $('#test').jec({
                optionClasses: {
                    optionClasses: 'myClass1'
                }
            });
            assert.lengthOf(elem.children('.jecEditableOption').attr('class').split(/\s+/), 1);
        });
        it('should fail to set any additional classes given as function', function () {
            init();
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
            init();
            var elem = $('#test').jec({
                styles: {}
            });
            assert.equal(elem.css('opacity'), 1);
        });
        it('should change the opacity to 0.5', function () {
            init();
            var opacity = 0.5,
                elem = $('#test').jec({
                    styles: {
                        opacity: opacity
                    }
                });
            assert.equal(elem.css('opacity'), opacity);
        });
        it('should change the opacity to 0.5 and display to none', function () {
            init();
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
            init();
            var elem = $('#test').jec({
                styles: 'opacity: 0.5;'
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as int', function () {
            init();
            var elem = $('#test').jec({
                styles: 1
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as float', function () {
            init();
            var elem = $('#test').jec({
                styles: 1.2
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as undefined', function () {
            init();
            var elem = $('#test').jec({
                styles: undefined
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as null', function () {
            init();
            var elem = $('#test').jec({
                styles: null
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as boolean', function () {
            init();
            var elem = $('#test').jec({
                styles: true
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as array', function () {
            init();
            var elem = $('#test').jec({
                styles: ['opacity: 0.5;']
            });
            assert.equal(elem.attr('style'), undefined);
        });
        it('should not set any additional styles given as function', function () {
            init();
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
            init();
            var elem = $('#test').jec({
                optionStyles: {}
            });
            assert.equal(elem.children('.jecEditableOption').css('opacity'), 1);
        });
        it('should change the opacity to 0.5', function () {
            init();
            var opacity = 0.5,
                elem = $('#test').jec({
                    optionStyles: {
                        opacity: opacity
                    }
                });
            assert.equal(elem.children('.jecEditableOption').css('opacity'), opacity);
        });
        it('should change the opacity to 0.5 and display to none', function () {
            init();
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
            init();
            var elem = $('#test').jec({
                optionStyles: 'opacity: 0.5;'
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as int', function () {
            init();
            var elem = $('#test').jec({
                optionStyles: 1
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as float', function () {
            init();
            var elem = $('#test').jec({
                optionStyles: 1.2
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as undefined', function () {
            init();
            var elem = $('#test').jec({
                optionStyles: undefined
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as null', function () {
            init();
            var elem = $('#test').jec({
                optionStyles: null
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as boolean', function () {
            init();
            var elem = $('#test').jec({
                optionStyles: true
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as array', function () {
            init();
            var elem = $('#test').jec({
                optionStyles: ['opacity: 0.5;']
            });
            assert.equal(elem.children('.jecEditableOption').attr('style'), undefined);
        });
        it('should not set any additional styles given as function', function () {
            init();
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
            init();
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
            init();
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
            init();
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
            init();
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
            init();
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
            init();
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
            init();
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
            init();
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
            init();
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
            init();
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
            init();
            var elem = $('#test').jec({
                focusOnNewOption: true
            });
            assert.equal(elem.val(), '');
        });
        it('should leave the focus on the original place', function () {
            init();
            var elem = $('#test').jec({
                focusOnNewOption: false
            });
            assert.equal(elem.val(), 'opt2');
        });
        it('should ignore the invalid string value', function () {
            init();
            var elem = $('#test').jec({
                focusOnNewOption: 'true'
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid int value', function () {
            init();
            var elem = $('#test').jec({
                focusOnNewOption: 1
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid float value', function () {
            init();
            var elem = $('#test').jec({
                focusOnNewOption: 1.2
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid undefined value', function () {
            init();
            var elem = $('#test').jec({
                focusOnNewOption: undefined
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid null value', function () {
            init();
            var elem = $('#test').jec({
                focusOnNewOption: null
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid object value', function () {
            init();
            var elem = $('#test').jec({
                focusOnNewOption: {
                    focusOnNewOption: true
                }
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid array value', function () {
            init();
            var elem = $('#test').jec({
                focusOnNewOption: [true]
            });
            assert.notEqual(elem.val(), '');
        });
        it('should ignore the invalid function value', function () {
            init();
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
            init();
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
            init();
            var elem = $('#test').jec({
                useExistingOptions: 'true'
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
        it('should ignore value given as int', function () {
            init();
            var elem = $('#test').jec({
                useExistingOptions: 1
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
        it('should ignore value given as float', function () {
            init();
            var elem = $('#test').jec({
                useExistingOptions: 1.2
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
        it('should ignore value given as undefined', function () {
            init();
            var elem = $('#test').jec({
                useExistingOptions: undefined
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
        it('should ignore value given as null', function () {
            init();
            var elem = $('#test').jec({
                useExistingOptions: null
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
        it('should ignore value given as array', function () {
            init();
            var elem = $('#test').jec({
                useExistingOptions: [true]
            }),
                option = elem.children('.jecEditableOption');
            elem.children('option:eq(1)').prop('selected', true);
            elem.trigger('change');
            assert.equal(option.val(), '');
        });
        it('should ignore value given as object', function () {
            init();
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
            init();
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
            init();
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
        // todo: write tests for invalid values
    });
    describe('Setting accepted keys', function () {
        it('should properly handle accepted keys', function () {
            init();
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
        // todo: write tests for invalid values
    });
    describe('Setting ignore option groups', function () {
        it('should correctly position editable option', function () {
            init();
            var elem = $('#gtest').jec({
                ignoreOptGroups: false,
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should correctly position editable option inside the option group', function () {
            init();
            var elem = $('#gtest').jec({
                ignoreOptGroups: true,
                position: 1
            });
            assert.equal(elem.children('optgroup:first').children('option:first').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid string value', function () {
            init();
            var elem = $('#gtest').jec({
                ignoreOptGroups: 'true',
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid int value', function () {
            init();
            var elem = $('#gtest').jec({
                ignoreOptGroups: 1,
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid float value', function () {
            init();
            var elem = $('#gtest').jec({
                ignoreOptGroups: 1.2,
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid undefined value', function () {
            init();
            var elem = $('#gtest').jec({
                ignoreOptGroups: undefined,
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid object value', function () {
            init();
            var elem = $('#gtest').jec({
                ignoreOptGroups: {
                    ignoreOptGroups: true
                },
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid array value', function () {
            init();
            var elem = $('#gtest').jec({
                ignoreOptGroups: [true],
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid function value', function () {
            init();
            var elem = $('#gtest').jec({
                ignoreOptGroups: function () {
                    return true;
                },
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
        it('should ignore the invalid null value', function () {
            init();
            var elem = $('#gtest').jec({
                ignoreOptGroups: null,
                position: 1
            });
            assert.equal(elem.children('option:eq(1)').hasClass('jecEditableOption'), true);
        });
    });
});