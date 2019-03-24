import {Callbacks} from "./Callbacks";
import {assert} from 'chai';

describe('Callbacks', function() {

    it('should call', function() {

        const [callback, setCallback] = Callbacks.create();

        // make sure we can call it with no op now...
        callback();

        let called: boolean = false;

        assert.equal(called, false);
        callback();

        setCallback(() => called = true);

        callback();

        assert.equal(called, true);

    });

});
