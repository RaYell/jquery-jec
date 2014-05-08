/*jslint indent: 4, maxlen: 120 */
/*global describe, it, window, $*/
describe('Getting preference', function () {
    'use strict';
    var assert = window.assert,
        init = window.init;

    describe('JEC', function () {
        it('should retrieve the preference', function () {
            init();
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
    var assert = window.assert,
        init = window.init;

    describe('JEC', function () {
        describe('Position', function () {
            it('should set the position', function () {
                init();
                var elem = $('#test').jec(),
                    position = 1;
                elem.jecPref('position', position);
                assert.equal(elem.jecPref('position'), position);
            });
            it('should ignore position given as float', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('position', 1.2);
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as string', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('position', '1');
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as undefined', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('position', undefined);
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as null', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('position', null);
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as boolean', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('position', true);
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as object', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('position', {
                    position: {
                        position: 1
                    }
                });
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as array', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('position', [1]);
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as function', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('position', function () {
                    return 1;
                });
                assert.equal(elem.jecPref('position'), 0);
            });
        });

        describe('Max length', function () {
            it('should set the max length', function () {
                init();
                var elem = $('#test').jec(),
                    maxLength = 3;
                elem.jecPref('maxLength', maxLength);
                assert.equal(elem.jecPref('maxLength'), maxLength);
            });
            it('should ignore negative length', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('maxLength', -1);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore too big length', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('maxLength', 260);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as float', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('maxLength', 1.2);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as string', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('maxLength', '1');
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as undefined', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('maxLength', undefined);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as null', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('maxLength', null);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as boolean', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('maxLength', true);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as object', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('maxLength', {
                    maxLength: 1
                });
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as array', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('maxLength', [1]);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as function', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('maxLength', function () {
                    return 1;
                });
                assert.equal(elem.jecPref('maxLength'), 255);
            });
        });

        describe('Classes', function () {
            it('should set the classes given as string', function () {
                init();
                var elem = $('#test').jec(),
                    classes = 'myClass1';
                elem.jecPref('classes', classes);
                assert.deepEqual(elem.jecPref('classes'), [classes]);
            });
            it('should set multiple classes given as string', function () {
                init();
                var elem = $('#test').jec(),
                    classes = 'myClass1 myClass2';
                elem.jecPref('classes', classes);
                assert.deepEqual(elem.jecPref('classes'), classes.split(/\s+/));
            });
            it('should set the classes given as array', function () {
                init();
                var elem = $('#test').jec(),
                    classes = ['myClass1', 'myClass2'];
                elem.jecPref('classes', classes);
                assert.deepEqual(elem.jecPref('classes'), classes);
            });
            it('should ignore classes given as int', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('classes', 1);
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as float', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('classes', 1.2);
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as undefined', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('classes', undefined);
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as null', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('classes', null);
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as boolean', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('classes', true);
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as object', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('classes', {
                    classes: 1
                });
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as function', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('classes', function () {
                    return 1;
                });
                assert.equal(elem.jecPref('classes'), 0);
            });
        });

        describe('Styles', function () {
            it('should set the styles', function () {
                init();
                var elem = $('#test').jec(),
                    styles = {
                        opacity: 0.5,
                        'display': 'none'
                    };
                elem.jecPref('styles', styles);
                assert.deepEqual(elem.jecPref('styles'), styles);
            });
            it('should ignore styles given as string', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('styles', 'opacity: 0.5');
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as int', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('styles', 1);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as float', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('styles', 1.2);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as undefined', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('styles', undefined);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as null', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('styles', null);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as boolean', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('styles', true);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as array', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('styles', ['opacity: 0.5']);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as function', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('styles', function () {
                    return 1;
                });
                assert.deepEqual(elem.jecPref('styles'), {});
            });
        });

        describe('Option classes', function () {
            it('should set the option classes given as string', function () {
                init();
                var elem = $('#test').jec(),
                    optionClasses = 'myClass1';
                elem.jecPref('optionClasses', optionClasses);
                assert.deepEqual(elem.jecPref('optionClasses'), [optionClasses]);
            });
            it('should set multiple option classes given as string', function () {
                init();
                var elem = $('#test').jec(),
                    optionClasses = 'myClass1 myClass2';
                elem.jecPref('optionClasses', optionClasses);
                assert.deepEqual(elem.jecPref('optionClasses'), optionClasses.split(/\s+/));
            });
            it('should set the option classes given as array', function () {
                init();
                var elem = $('#test').jec(),
                    optionClasses = ['myClass1', 'myClass2'];
                elem.jecPref('optionClasses', optionClasses);
                assert.deepEqual(elem.jecPref('optionClasses'), optionClasses);
            });
            it('should ignore option classes given as int', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('optionClasses', 1);
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as float', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('optionClasses', 1.2);
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as undefined', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('optionClasses', undefined);
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as null', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('optionClasses', null);
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as boolean', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('optionClasses', true);
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as object', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('optionClasses', {
                    optionClasses: 1
                });
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as function', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('optionClasses', function () {
                    return 1;
                });
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
        });

        describe('Option styles', function () {
            it('should set the styles', function () {
                init();
                var elem = $('#test').jec(),
                    optionStyles = {
                        opacity: 0.5,
                        'display': 'none'
                    };
                elem.jecPref('optionStyles', optionStyles);
                assert.deepEqual(elem.jecPref('optionStyles'), optionStyles);
            });
            it('should ignore option styles given as string', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('optionStyles', 'opacity: 0.5');
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as int', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('optionStyles', 1);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as float', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('optionStyles', 1.2);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as undefined', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('optionStyles', undefined);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as null', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('optionStyles', null);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as boolean', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('optionStyles', true);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as array', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('optionStyles', ['opacity: 0.5']);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as function', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('optionStyles', function () {
                    return 1;
                });
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
        });

        describe('Focus on new option', function () {
            it('should set the focus on new option', function () {
                init();
                var elem = $('#test').jec(),
                    focusOnNewOption = true;
                elem.jecPref('focusOnNewOption', focusOnNewOption);
                assert.equal(elem.jecPref('focusOnNewOption'), focusOnNewOption);
            });
            it('should ignore focus on new option given as int', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('focusOnNewOption', 1);
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as float', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('focusOnNewOption', 1.2);
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as string', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('focusOnNewOption', '1');
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as undefined', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('focusOnNewOption', undefined);
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as null', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('focusOnNewOption', null);
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as object', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('focusOnNewOption', {
                    focusOnNewOption: {
                        focusOnNewOption: true
                    }
                });
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as array', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('focusOnNewOption', [true]);
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as function', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('focusOnNewOption', function () {
                    return true;
                });
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
        });

        describe('Use existing options', function () {
            it('should set the use existing options', function () {
                init();
                var elem = $('#test').jec(),
                    useExistingOptions = true;
                elem.jecPref('useExistingOptions', useExistingOptions);
                assert.equal(elem.jecPref('useExistingOptions'), useExistingOptions);
            });
            it('should ignore use existing options given as int', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('useExistingOptions', 1);
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as float', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('useExistingOptions', 1.2);
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as string', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('useExistingOptions', '1');
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as undefined', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('useExistingOptions', undefined);
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as null', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('useExistingOptions', null);
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as object', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('useExistingOptions', {
                    useExistingOptions: {
                        useExistingOptions: true
                    }
                });
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as array', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('useExistingOptions', [true]);
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as function', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('useExistingOptions', function () {
                    return true;
                });
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
        });

        describe('Ignored keys', function () {
            it('should set the ignored keys', function () {
                init();
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
                init();
                var elem = $('#test').jec();
                elem.jecPref('ignoredKeys', 1);
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as float', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('ignoredKeys', 1.2);
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as string', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('ignoredKeys', '1');
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as undefined', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('ignoredKeys', undefined);
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as null', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('ignoredKeys', null);
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as object', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('ignoredKeys', {
                    ignoredKeys: {
                        ignoredKeys: true
                    }
                });
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as bool', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('ignoredKeys', true);
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as function', function () {
                init();
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
                init();
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
                init();
                var elem = $('#test').jec();
                elem.jecPref('acceptedKeys', 1);
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as float', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('acceptedKeys', 1.2);
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as string', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('acceptedKeys', '1');
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as undefined', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('acceptedKeys', undefined);
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as null', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('acceptedKeys', null);
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as object', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('acceptedKeys', {
                    acceptedKeys: {
                        acceptedKeys: true
                    }
                });
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as bool', function () {
                init();
                var elem = $('#test').jec();
                elem.jecPref('acceptedKeys', true);
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as function', function () {
                init();
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
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    position = 1;
                elem.jecPref('position', position);
                assert.equal(elem.jecPref('position'), position);
            });
            it('should ignore position given as float', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('position', 1.2);
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as string', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('position', '1');
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as undefined', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('position', undefined);
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as null', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('position', null);
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as boolean', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('position', true);
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as object', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('position', {
                    position: {
                        position: 1
                    }
                });
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as array', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('position', [1]);
                assert.equal(elem.jecPref('position'), 0);
            });
            it('should ignore position given as function', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('position', function () {
                    return 1;
                });
                assert.equal(elem.jecPref('position'), 0);
            });
        });

        describe('Max length', function () {
            it('should set the max length', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    maxLength = 3;
                elem.jecPref('maxLength', maxLength);
                assert.equal(elem.jecPref('maxLength'), maxLength);
            });
            it('should ignore negative length', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('maxLength', -1);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore too big length', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('maxLength', 260);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as float', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('maxLength', 1.2);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as string', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('maxLength', '1');
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as undefined', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('maxLength', undefined);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as null', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('maxLength', null);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as boolean', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('maxLength', true);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as object', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('maxLength', {
                    maxLength: 1
                });
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as array', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('maxLength', [1]);
                assert.equal(elem.jecPref('maxLength'), 255);
            });
            it('should ignore max length given as function', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('maxLength', function () {
                    return 1;
                });
                assert.equal(elem.jecPref('maxLength'), 255);
            });
        });

        describe('Classes', function () {
            it('should set the classes given as string', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    classes = 'myClass1';
                elem.jecPref('classes', classes);
                assert.deepEqual(elem.jecPref('classes'), [classes]);
            });
            it('should set multiple classes given as string', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    classes = 'myClass1 myClass2';
                elem.jecPref('classes', classes);
                assert.deepEqual(elem.jecPref('classes'), classes.split(/\s+/));
            });
            it('should set the classes given as array', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    classes = ['myClass1', 'myClass2'];
                elem.jecPref('classes', classes);
                assert.deepEqual(elem.jecPref('classes'), classes);
            });
            it('should ignore classes given as int', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('classes', 1);
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as float', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('classes', 1.2);
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as undefined', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('classes', undefined);
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as null', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('classes', null);
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as boolean', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('classes', true);
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as object', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('classes', {
                    classes: 1
                });
                assert.equal(elem.jecPref('classes'), 0);
            });
            it('should ignore classes given as function', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('classes', function () {
                    return 1;
                });
                assert.equal(elem.jecPref('classes'), 0);
            });
        });

        describe('Styles', function () {
            it('should set the styles', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    styles = {
                        opacity: 0.5,
                        'display': 'none'
                    };
                elem.jecPref('styles', styles);
                assert.deepEqual(elem.jecPref('styles'), styles);
            });
            it('should ignore styles given as string', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('styles', 'opacity: 0.5');
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as int', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('styles', 1);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as float', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('styles', 1.2);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as undefined', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('styles', undefined);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as null', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('styles', null);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as boolean', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('styles', true);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as array', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('styles', ['opacity: 0.5']);
                assert.deepEqual(elem.jecPref('styles'), {});
            });
            it('should ignore styles given as function', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('styles', function () {
                    return 1;
                });
                assert.deepEqual(elem.jecPref('styles'), {});
            });
        });

        describe('Option classes', function () {
            it('should set the option classes given as string', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    optionClasses = 'myClass1';
                elem.jecPref('optionClasses', optionClasses);
                assert.deepEqual(elem.jecPref('optionClasses'), [optionClasses]);
            });
            it('should set multiple option classes given as string', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    optionClasses = 'myClass1 myClass2';
                elem.jecPref('optionClasses', optionClasses);
                assert.deepEqual(elem.jecPref('optionClasses'), optionClasses.split(/\s+/));
            });
            it('should set the option classes given as array', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    optionClasses = ['myClass1', 'myClass2'];
                elem.jecPref('optionClasses', optionClasses);
                assert.deepEqual(elem.jecPref('optionClasses'), optionClasses);
            });
            it('should ignore option classes given as int', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionClasses', 1);
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as float', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionClasses', 1.2);
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as undefined', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionClasses', undefined);
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as null', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionClasses', null);
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as boolean', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionClasses', true);
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as object', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionClasses', {
                    optionClasses: 1
                });
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
            it('should ignore option classes given as function', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionClasses', function () {
                    return 1;
                });
                assert.equal(elem.jecPref('optionClasses'), 0);
            });
        });

        describe('Option styles', function () {
            it('should set the styles', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    optionStyles = {
                        opacity: 0.5,
                        'display': 'none'
                    };
                elem.jecPref('optionStyles', optionStyles);
                assert.deepEqual(elem.jecPref('optionStyles'), optionStyles);
            });
            it('should ignore option styles given as string', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionStyles', 'opacity: 0.5');
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as int', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionStyles', 1);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as float', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionStyles', 1.2);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as undefined', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionStyles', undefined);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as null', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionStyles', null);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as boolean', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionStyles', true);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as array', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionStyles', ['opacity: 0.5']);
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
            it('should ignore option styles given as function', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('optionStyles', function () {
                    return 1;
                });
                assert.deepEqual(elem.jecPref('optionStyles'), {});
            });
        });

        describe('Focus on new option', function () {
            it('should set the focus on new option', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    focusOnNewOption = true;
                elem.jecPref('focusOnNewOption', focusOnNewOption);
                assert.equal(elem.jecPref('focusOnNewOption'), focusOnNewOption);
            });
            it('should ignore focus on new option given as int', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('focusOnNewOption', 1);
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as float', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('focusOnNewOption', 1.2);
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as string', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('focusOnNewOption', '1');
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as undefined', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('focusOnNewOption', undefined);
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as null', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('focusOnNewOption', null);
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as object', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('focusOnNewOption', {
                    focusOnNewOption: {
                        focusOnNewOption: true
                    }
                });
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as array', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('focusOnNewOption', [true]);
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
            it('should ignore focus on new option given as function', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('focusOnNewOption', function () {
                    return true;
                });
                assert.equal(elem.jecPref('focusOnNewOption'), false);
            });
        });

        describe('Use existing options', function () {
            it('should set the use existing options', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']),
                    useExistingOptions = true;
                elem.jecPref('useExistingOptions', useExistingOptions);
                assert.equal(elem.jecPref('useExistingOptions'), useExistingOptions);
            });
            it('should ignore use existing options given as int', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('useExistingOptions', 1);
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as float', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('useExistingOptions', 1.2);
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as string', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('useExistingOptions', '1');
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as undefined', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('useExistingOptions', undefined);
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as null', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('useExistingOptions', null);
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as object', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('useExistingOptions', {
                    useExistingOptions: {
                        useExistingOptions: true
                    }
                });
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as array', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('useExistingOptions', [true]);
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
            it('should ignore use existing options given as function', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('useExistingOptions', function () {
                    return true;
                });
                assert.equal(elem.jecPref('useExistingOptions'), false);
            });
        });

        describe('Ignored keys', function () {
            it('should set the ignored keys', function () {
                init();
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
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('ignoredKeys', 1);
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as float', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('ignoredKeys', 1.2);
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as string', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('ignoredKeys', '1');
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as undefined', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('ignoredKeys', undefined);
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as null', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('ignoredKeys', null);
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as object', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('ignoredKeys', {
                    ignoredKeys: {
                        ignoredKeys: true
                    }
                });
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as bool', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('ignoredKeys', true);
                assert.deepEqual(elem.jecPref('ignoredKeys'), []);
            });
            it('should ignore ignored keys given as function', function () {
                init();
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
                init();
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
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('acceptedKeys', 1);
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as float', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('acceptedKeys', 1.2);
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as string', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('acceptedKeys', '1');
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as undefined', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('acceptedKeys', undefined);
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as null', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('acceptedKeys', null);
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as object', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('acceptedKeys', {
                    acceptedKeys: {
                        acceptedKeys: true
                    }
                });
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as bool', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('acceptedKeys', true);
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
            it('should ignore accepted keys given as function', function () {
                init();
                var elem = $.jec(['opt1', 'opt2', 'opt3']);
                elem.jecPref('acceptedKeys', function () {
                    return true;
                });
                assert.deepEqual(elem.jecPref('acceptedKeys'), keys);
            });
        });
    });
});