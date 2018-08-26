import assert from 'assert';
import {Line} from './Line';
import {assertJSON} from '../test/Assertions';

describe('Line', function() {

    it("length", function () {

        let line = new Line(10, 20);
        assert.equal(line.length, 10);

        let expected = {
            "start": 10,
            "end": 20,
            "length": 10
        };

        assertJSON(line, expected);

    });

});
