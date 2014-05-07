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
                    position: 1
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
    });

    describe('JEC (init with JS)', function () {});
});

/*
test('Setting preference: focusOnNewOption', function () {
    expect(9);

    $.jec(['opt1', 'opt2', 'opt3'], );
    $('#test').jecPref('focusOnNewOption', true);
    equal($('#test').jecPref('focusOnNewOption'), true, 'Set preference (boolean)');
    $('#test').jecPref('focusOnNewOption', 'true');
    equal($('#test').jecPref('focusOnNewOption'), true, 'Set preference (string)');
    $('#test').jecPref('focusOnNewOption', {});
    equal($('#test').jecPref('focusOnNewOption'), true, 'Set preference (object)');
    $('#test').jecPref('focusOnNewOption', []);
    equal($('#test').jecPref('focusOnNewOption'), true, 'Set preference (array)');
    $('#test').jecPref('focusOnNewOption', 1);
    equal($('#test').jecPref('focusOnNewOption'), true, 'Set preference (int)');
    $('#test').jecPref('focusOnNewOption', 1.2);
    equal($('#test').jecPref('focusOnNewOption'), true, 'Set preference (float)');
    $('#test').jecPref('focusOnNewOption', undefined);
    equal($('#test').jecPref('focusOnNewOption'), true, 'Set preference (undefined)');
    $('#test').jecPref('focusOnNewOption', null);
    equal($('#test').jecPref('focusOnNewOption'), true, 'Set preference (null)');
    $('#test').jecPref('focusOnNewOption', $);
    equal($('#test').jecPref('focusOnNewOption'), true, 'Set preference (function)');
    reset($('#test'));
});

test('Setting preference: useExistingOptions', function () {
    expect(9);

    $.jec(['opt1', 'opt2', 'opt3'], );
    $('#test').jecPref('useExistingOptions', true);
    equal($('#test').jecPref('useExistingOptions'), true, 'Set preference (boolean)');
    $('#test').jecPref('useExistingOptions', 'true');
    equal($('#test').jecPref('useExistingOptions'), true, 'Set preference (string)');
    $('#test').jecPref('useExistingOptions', {});
    equal($('#test').jecPref('useExistingOptions'), true, 'Set preference (object)');
    $('#test').jecPref('useExistingOptions', []);
    equal($('#test').jecPref('useExistingOptions'), true, 'Set preference (array)');
    $('#test').jecPref('useExistingOptions', 1);
    equal($('#test').jecPref('useExistingOptions'), true, 'Set preference (int)');
    $('#test').jecPref('useExistingOptions', 1.2);
    equal($('#test').jecPref('useExistingOptions'), true, 'Set preference (float)');
    $('#test').jecPref('useExistingOptions', undefined);
    equal($('#test').jecPref('useExistingOptions'), true, 'Set preference (undefined)');
    $('#test').jecPref('useExistingOptions', null);
    equal($('#test').jecPref('useExistingOptions'), true, 'Set preference (null)');
    $('#test').jecPref('useExistingOptions', $);
    equal($('#test').jecPref('useExistingOptions'), true, 'Set preference (function)');
    reset($('#test'));
});

test('Setting preference: ignoredKeys', function () {
    expect(9);

    var range, parsedRange = [10, 11, 12, 13, 14, 15, 35, 55];
    range = [
        {
            min: 10,
            max: 15
        }, // (min, max) tuple
            35, 55 // number values
        ];

    $.jec(['opt1', 'opt2', 'opt3'], );
    $('#test').jecPref('ignoredKeys', range);
    deepEqual($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (array)');
    $('#test').jecPref('ignoredKeys', true);
    deepEqual($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (boolean)');
    $('#test').jecPref('ignoredKeys', '');
    deepEqual($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (string)');
    $('#test').jecPref('ignoredKeys', {});
    deepEqual($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (object)');
    $('#test').jecPref('ignoredKeys', 1);
    deepEqual($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (int)');
    $('#test').jecPref('ignoredKeys', 1.2);
    deepEqual($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (float)');
    $('#test').jecPref('ignoredKeys', undefined);
    deepEqual($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (undefined)');
    $('#test').jecPref('ignoredKeys', null);
    deepEqual($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (null)');
    $('#test').jecPref('ignoredKeys', $);
    deepEqual($('#test').jecPref('ignoredKeys'), parsedRange, 'Set preference (function)');
    reset($('#test'));
});

test('Setting preference: acceptedKeys', function () {
    expect(9);

    var range, parsedRange = [10, 11, 12, 13, 14, 15, 35, 55];
    range = [
        {
            min: 10,
            max: 15
        }, // (min, max) tuple
            35, 55 // number values
        ];

    $.jec(['opt1', 'opt2', 'opt3'], );
    $('#test').jecPref('acceptedKeys', range);
    deepEqual($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (array)');
    $('#test').jecPref('acceptedKeys', true);
    deepEqual($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (boolean)');
    $('#test').jecPref('acceptedKeys', '');
    deepEqual($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (string)');
    $('#test').jecPref('acceptedKeys', {});
    deepEqual($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (object)');
    $('#test').jecPref('acceptedKeys', 1);
    deepEqual($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (int)');
    $('#test').jecPref('acceptedKeys', 1.2);
    deepEqual($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (float)');
    $('#test').jecPref('acceptedKeys', undefined);
    deepEqual($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (undefined)');
    $('#test').jecPref('acceptedKeys', null);
    deepEqual($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (null)');
    $('#test').jecPref('acceptedKeys', $);
    deepEqual($('#test').jecPref('acceptedKeys'), parsedRange, 'Set preference (function)');
    reset($('#test'));
});
*/