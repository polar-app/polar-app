
import {assert} from 'chai';
import {TextArray} from './TextArray';
import {TimeDurations} from './TimeDurations';
import {ISODateTimeStrings} from '../metadata/ISODateTimeStrings';
import {TestingTime} from '../test/TestingTime';

describe('TimeDurations', function() {

    it("basic", function() {

        assert.equal(TimeDurations.toMillis('-1w'), -604800000);
        assert.equal(TimeDurations.toMillis('1w'), 604800000);

    });



    it("hasExpired", function() {

        // console.log(ISODateTimeStrings.create());

        TestingTime.freeze();

        const since = new Date();

        assert.notOk(TimeDurations.hasElapsed(since, '1d'));
        TestingTime.forward('1h');
        assert.notOk(TimeDurations.hasElapsed(since, '1d'));
        TestingTime.forward('22h');
        assert.notOk(TimeDurations.hasElapsed(since, '1d'));
        TestingTime.forward('1h');
        assert.notOk(TimeDurations.hasElapsed(since, '1d'));

        TestingTime.forward('1ms');
        assert.ok(TimeDurations.hasElapsed(since, '1d'));

    });

});
