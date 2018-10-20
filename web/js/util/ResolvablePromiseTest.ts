import {assert} from 'chai';
import {Progress} from './Progress';
import {ResolveablePromise} from './ResolveablePromise';


describe('ResolveablePromise', function() {

    it("Without awaiting the promise", async function () {

        const resolvablePromise = new ResolveablePromise<string>();

        resolvablePromise.resolve('hello');

        assert.equal(await resolvablePromise, 'hello');

    });

});
