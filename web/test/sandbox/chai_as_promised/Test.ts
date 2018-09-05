import {assert} from '../../../js/test/Chai';


describe('Test', function() {

    it("write out captured JSON", async function () {

        async function test() {
            console.log("FIXME");
            return 1;
        }

        test().should.eventually.equal(5);

    });

});
