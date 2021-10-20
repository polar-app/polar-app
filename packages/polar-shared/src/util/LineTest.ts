import {assert} from 'chai';
import {Line} from './Line';
import {assertJSON} from 'polar-test/src/test/Assertions';

describe('Line', function() {

    it("length", function() {

        const line = new Line(10, 20, 'x');
        assert.equal(line.length, 10);

        const expected = {
            "axis": "x",
            "start": 10,
            "end": 20,
        };

        assertJSON(line, expected, undefined);

    });

});
