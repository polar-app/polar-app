import {assert} from 'chai';
import {GPTContentFilters} from "./GPTContentFilters";
import {Numbers} from "polar-shared/src/util/Numbers";
import {Benchmark} from "polar-shared/src/util/Benchmark";

xdescribe('GPTContentFilters', function() {

    this.timeout(10000);

    it("basic", async function() {

        const response = await GPTContentFilters.exec(['hello world'])
        assert.equal(response, "safe");

    });


    xit("test performance", async function() {

        // TODO: rework this into Benchmark to test each call and compute some stats on the result

        await Benchmark.exec(async () => await GPTContentFilters.exec(['hello world']))

    });

});
