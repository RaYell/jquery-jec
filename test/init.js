/*jslint indent: 4, maxlen: 120 */
/*global define, $*/
define('init', function () {
    'use strict';
    return {
        reset: function () {
            var select1 = '<select id="test"><option>opt1</option><option selected>opt2</option>' +
                '<option>opt3</option></select>',
                select2 = '<select id="gtest" class="hidden"><option>opt1</option>' +
                '<optgroup label="Group 1"><option selected>opt2</option>' +
                '<option>opt3</option></optgroup><optgroup label="Group 2">' +
                '<option>opt4</option></optgroup><option>opt5</option></select>';
            $('#fixtures').empty().append(select1).append(select2);
        }
    };
});