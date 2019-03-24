import {Callbacks} from "./Callbacks";
import {assert} from 'chai';

describe('Callbacks', function() {

    it('should call', function() {

        const [callback, setCallback] = Callbacks.create<string>();

        // make sure we can call it with no op now...
        callback('yo');

        let message: string | undefined;

        assert.equal(message, undefined);
        callback('hey');

        setCallback((value) => message = value);

        callback('sup');

        assert.equal(message, 'sup');

    });

});
