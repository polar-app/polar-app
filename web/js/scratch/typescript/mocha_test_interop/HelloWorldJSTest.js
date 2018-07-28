const {HelloWorld} = require("./HelloWorld");
const assert = require('assert');

describe('HelloWorld', function() {

    it("Basic test, function", function () {
        let helloWorld = new HelloWorld();

        assert.equal(helloWorld.getMessage(), "hello world");
    });

});

