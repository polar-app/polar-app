import {Tracer2} from "./Tracer2";
import {assert} from 'chai';
import {Promises} from "./Promises";

describe('Tracer2', function() {

    it("promises", async function() {

        async function doAsync() {
            await Promises.waitFor(1000)
            return 101;
        }

        const tracer = Tracer2.create({id: 'sync'});

        assert.equal(101, await tracer(doAsync));

    });


    it("no promises", async function() {

        function doSync() {
            return 101;
        }

        const tracer = Tracer2.create({id: 'async'});

        assert.equal(101, tracer(doSync));

    });

});
