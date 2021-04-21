import {HelloWorld} from './HelloWorld';
import * as assert from 'assert';

describe('HelloWorld', function() {

    it("Basic test, function", function () {
        let helloWorld = new HelloWorld();

        assert.equal(helloWorld.getMessage(), "hello world");
    });

});

