/*jslint indent: 4, maxlen: 120 */
/*global describe, it, window, $*/
describe('JEC (init with JS)', function () {
    'use strict';
    var assert = window.assert,
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
            var length = 2,
                elem = $.jec(['opt1', 'opt2', 'opt3'], {
                    maxLength: length
                });
            key(elem, 72);
            key(elem, 72);
            key(elem, 72);
            assert.lengthOf(elem.children('.jecEditableOption').val(), length);
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
        // todo: write tests for invalid values
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
        // todo: write tests for invalid values
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
        // todo: write tests for invalid values
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