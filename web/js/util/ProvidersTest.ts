import {assert} from 'chai';
import {Provider, Providers} from "./Providers";
import {TestingTime} from "../test/TestingTime";
import {TimeDurations} from './TimeDurations';

describe('Providers', function() {

    afterEach(function() {
        TestingTime.unfreeze();
    });

    describe('cached', function() {

        it("basic", async function() {

            TestingTime.freeze();

            let called: number = 0;

            const backingProvider: Provider<string> = () => {
                ++called;
                return 'hello';
            };

            const cachedProvider = Providers.cached('5m', backingProvider);

            assert.equal(called, 0);

            cachedProvider();
            assert.equal(called, 1);

            cachedProvider();
            assert.equal(called, 1);

            cachedProvider();
            assert.equal(called, 1);

            TestingTime.forward(TimeDurations.toMillis('4m'));

            cachedProvider();
            assert.equal(called, 1);

            TestingTime.forward(TimeDurations.toMillis('5m'));

            cachedProvider();
            assert.equal(called, 2);

            cachedProvider();
            assert.equal(called, 2);

        });

    });

});


