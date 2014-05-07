/*jslint indent: 4, maxlen: 120 */
/*global describe, it, window, $*/
describe('Disable', function () {
    'use strict';
     var init = function () {
            var select1 = '<select id="test"><option>opt1</option><option selected>opt2</option>' +
                '<option>opt3</option></select>',
                select2 = '<select id="gtest" class="hidden"><option>opt1</option>' +
                '<optgroup label="Group 1"><option selected>opt2</option>' +
                '<option>opt3</option></optgroup><optgroup label="Group 2">' +
                '<option>opt4</option></optgroup><option>opt5</option></select>';
            $('#fixtures').empty().append(select1).append(select2);
        }
    
    describe('JEC', function () {
        it('should properly disable editable functionality', function () {
            init();
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
     var init = function () {
            var select1 = '<select id="test"><option>opt1</option><option selected>opt2</option>' +
                '<option>opt3</option></select>',
                select2 = '<select id="gtest" class="hidden"><option>opt1</option>' +
                '<optgroup label="Group 1"><option selected>opt2</option>' +
                '<option>opt3</option></optgroup><optgroup label="Group 2">' +
                '<option>opt4</option></optgroup><option>opt5</option></select>';
            $('#fixtures').empty().append(select1).append(select2);
        }
    
    describe('JEC', function () {
        it('should properly enable editable functionality', function () {
            init();
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
     var init = function () {
            var select1 = '<select id="test"><option>opt1</option><option selected>opt2</option>' +
                '<option>opt3</option></select>',
                select2 = '<select id="gtest" class="hidden"><option>opt1</option>' +
                '<optgroup label="Group 1"><option selected>opt2</option>' +
                '<option>opt3</option></optgroup><optgroup label="Group 2">' +
                '<option>opt4</option></optgroup><option>opt5</option></select>';
            $('#fixtures').empty().append(select1).append(select2);
        }
    
    describe('JEC', function () {
        it('should properly kill editable functionality', function () {
            init();
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


/*
module('value');
test('Getting value', function () {
    expect(3);

    var v1 = 'v1',
        v2 = 1,
        v3 = 1.2;

    $.jec(['opt1', 'opt2', 'opt3'], );
    $('#test option.jecEditableOption').text(v1).val(v1);
    equal($('#test').jecValue(), v1, 'Get value (string)');
    $('#test option.jecEditableOption').text(v2).val(v2);
    equal($('#test').jecValue(), String(v2), 'Get value (int)');
    $('#test option.jecEditableOption').text(v3).val(v3);
    equal($('#test').jecValue(), String(v3), 'Get value (float)');
    reset($('#test'));
});

test('Setting value', function () {
    expect(9);

    var v1 = 'v1',
        v2 = 1,
        v3 = 1.2;

    $.jec(['opt1', 'opt2', 'opt3'], );
    $('#test').jecValue(v1);
    equal($('#test').jecValue(), v1, 'Get value (string)');
    $('#test').jecValue(v2);
    equal($('#test').jecValue(), String(v2), 'Get value (int)');
    $('#test').jecValue(v3);
    equal($('#test').jecValue(), String(v3), 'Get value (float)');
    $('#test').jecValue({});
    equal($('#test').jecValue(), String(v3), 'Get value (object)');
    $('#test').jecValue([]);
    equal($('#test').jecValue(), String(v3), 'Get value (array)');
    $('#test').jecValue(null);
    equal($('#test').jecValue(), String(v3), 'Get value (null)');
    $('#test').jecValue(undefined);
    equal($('#test').jecValue(), String(v3), 'Get value (undefined)');
    $('#test').jecValue(true);
    equal($('#test').jecValue(), String(v3), 'Get value (boolean)');
    $('#test').jecValue($);
    equal($('#test').jecValue(), String(v3), 'Get value (function)');
    reset($('#test'));
});

module('pref');
test('Getting preference', function () {
    expect(17);

    $.jec(['opt1', 'opt2', 'opt3'], );
    ok($('#test').jecPref() === undefined, 'Get preference (undefined)');
    ok($('#test').jecPref(null) === undefined, 'Get preference (null)');
    ok($('#test').jecPref({}) === undefined, 'Get preference (object)');
    ok($('#test').jecPref(1) === undefined, 'Get preference (int)');
    ok($('#test').jecPref(1.2) === undefined, 'Get preference (float)');
    ok($('#test').jecPref(true) === undefined, 'Get preference (boolean)');
    ok($('#test').jecPref($) === undefined, 'Get preference (function)');
    ok($('#test').jecPref('dummy') === undefined, 'Get preference (not-existing string)');

    var i, keys = [],
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
                {
                    min: 32,
                    max: 126
                },
                {
                    min: 191,
                    max: 382
                }
            ]
        };

    $.each(defaults, function (key, value) {
        if (value !== undefined) {
            if (key === 'acceptedKeys') {
                value = defaults.acceptedKeys;
                $.each(value, function () {
                    // min,max tuple
                    if ($.isPlainObject(this) && typeof this.min === 'number' && typeof this.max === 'number' && this.min <= this.max) {
                        for (i = this.min; i <= this.max; i += 1) {
                            keys[keys.length] = i;
                        }
                        // number
                    } else if (typeof this === 'number') {
                        keys[keys.length] = this;
                    }
                });
                deepEqual($('#test').jecPref('acceptedKeys'), keys, 'Get ' + key + ' value');
            } else {
                deepEqual($('#test').jecPref(key), value, 'Get ' + key + ' value');
            }
        }
    });

    reset($('#test'));
});

test('Setting preference: position', function () {
    expect(9);

    $.jec(['opt1', 'opt2', 'opt3'], );
    $('#test').jecPref('position', 1);
    equal($('#test').jecPref('position'), 1, 'Set preference (int)');
    $('#test').jecPref('position', 1.2);
    equal($('#test').jecPref('position'), 1, 'Set preference (float)');
    $('#test').jecPref('position', '2');
    equal($('#test').jecPref('position'), 1, 'Set preference (string)');
    $('#test').jecPref('position', {});
    equal($('#test').jecPref('position'), 1, 'Set preference (object)');
    $('#test').jecPref('position', []);
    equal($('#test').jecPref('position'), 1, 'Set preference (array)');
    $('#test').jecPref('position', false);
    equal($('#test').jecPref('position'), 1, 'Set preference (boolean)');
    $('#test').jecPref('position', undefined);
    equal($('#test').jecPref('position'), 1, 'Set preference (undefined)');
    $('#test').jecPref('position', null);
    equal($('#test').jecPref('position'), 1, 'Set preference (null)');
    $('#test').jecPref('position', $);
    equal($('#test').jecPref('position'), 1, 'Set preference (function)');
    reset($('#test'));
});

test('Setting preference: classes', function () {
    expect(9);

    var c1 = 'c1';
    $.jec(['opt1', 'opt2', 'opt3'], );
    $('#test').jecPref('classes', [c1]);
    deepEqual($('#test').jecPref('classes'), [c1], 'Set preference (array)');
    $('#test').jecPref('classes', c1);
    deepEqual($('#test').jecPref('classes'), [c1], 'Set preference (string)');
    $('#test').jecPref('classes', 1);
    deepEqual($('#test').jecPref('classes'), [c1], 'Set preference (int)');
    $('#test').jecPref('classes', 1.2);
    deepEqual($('#test').jecPref('classes'), [c1], 'Set preference (float)');
    $('#test').jecPref('classes', {});
    deepEqual($('#test').jecPref('classes'), [c1], 'Set preference (object)');
    $('#test').jecPref('classes', false);
    deepEqual($('#test').jecPref('classes'), [c1], 'Set preference (boolean)');
    $('#test').jecPref('classes', undefined);
    deepEqual($('#test').jecPref('classes'), [c1], 'Set preference (undefined)');
    $('#test').jecPref('classes', null);
    deepEqual($('#test').jecPref('classes'), [c1], 'Set preference (null)');
    $('#test').jecPref('classes', $);
    deepEqual($('#test').jecPref('classes'), [c1], 'Set preference (function)');
    reset($('#test'));
});

test('Setting preference: styles', function () {
    expect(9);

    var styles = {
        opacity: 0.5,
        'display': 'none'
    };

    $.jec(['opt1', 'opt2', 'opt3'], );
    $('#test').jecPref('styles', styles);
    equal($('#test').jecPref('styles'), styles, 'Set preference (object)');
    $('#test').jecPref('styles', []);
    equal($('#test').jecPref('styles'), styles, 'Set preference (array)');
    $('#test').jecPref('styles', 'width: 100px;');
    equal($('#test').jecPref('styles'), styles, 'Set preference (string)');
    $('#test').jecPref('styles', 1);
    equal($('#test').jecPref('styles'), styles, 'Set preference (int)');
    $('#test').jecPref('styles', 1.2);
    equal($('#test').jecPref('styles'), styles, 'Set preference (float)');
    $('#test').jecPref('styles', false);
    equal($('#test').jecPref('styles'), styles, 'Set preference (boolean)');
    $('#test').jecPref('styles', undefined);
    equal($('#test').jecPref('styles'), styles, 'Set preference (undefined)');
    $('#test').jecPref('styles', null);
    equal($('#test').jecPref('styles'), styles, 'Set preference (null)');
    $('#test').jecPref('styles', $);
    equal($('#test').jecPref('styles'), styles, 'Set preference (function)');
    reset($('#test'));
});

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