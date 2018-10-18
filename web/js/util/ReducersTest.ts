import {assert} from 'chai';
import {Progress} from './Progress';
import {ResolvablePromise} from './ResolvablePromise';
import {Reducers} from './Reducers';

describe('Reducers', function() {

    describe('sum', function() {

        it("basic", async function () {
            assert.equal([100].reduce(Reducers.SUM), 100);
        });

        it("none", async function () {
            assert.equal([].reduce(Reducers.SUM, 0), 0);
        });


    });

});
