
import {assert} from 'chai';
import {TextArray} from './TextArray';
import {TimeDurations} from './TimeDurations';

describe('TimeDurations', function() {

    it("basic", function() {

        assert.equal(TimeDurations.toMillis('-1w'), -604800000);
        assert.equal(TimeDurations.toMillis('1w'), 604800000);

    });

});
