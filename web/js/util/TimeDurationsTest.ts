
import {assert} from 'chai';
import {TextArray} from './TextArray';
import {DurationStr, TimeDurations} from './TimeDurations';
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

    it('nrWeeks', function() {

        TestingTime.freeze();

        const doTest = (sinceDuration: string, expected: string) => {

            const since = new Date(Date.now() - TimeDurations.toMillis(sinceDuration));

            assert.equal(TimeDurations.inWeeks(since), expected);

        };

        doTest('1w', '1w');
        doTest('1d', '0w');
        doTest('8d', '1w');
        doTest('14d', '2w');
        doTest('15d', '2w');

    });

});
