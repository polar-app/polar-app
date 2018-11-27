import {assertJSON} from '../test/Assertions';
import {AsyncWorkQueues} from './AsyncWorkQueues';

describe('AsyncWorkQueues', function() {

    describe('awaitPromises', function() {

        it("with no work", async function() {

            await AsyncWorkQueues.awaitPromises([]);

        });


        it("with one job", async function() {

            const work = [
                Promise.resolve(true)
            ];

            const results = await AsyncWorkQueues.awaitPromises(work);

            assertJSON(results, [true]);

        });

    });

});

