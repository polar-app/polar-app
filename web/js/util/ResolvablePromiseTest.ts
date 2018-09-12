import {assert} from 'chai';
import {Progress} from './Progress';
import {ResolvablePromise} from './ResolvablePromise';


describe('ResolvablePromise', function() {

    it("Without awaiting the promise", async function () {

        const resolvablePromise = new ResolvablePromise<string>();

        resolvablePromise.resolve('hello');

        assert.equal(await resolvablePromise, 'hello');

    });

});
