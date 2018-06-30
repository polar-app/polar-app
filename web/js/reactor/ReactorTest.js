var assert = require('assert');

const {Reactor} = require("./Reactor");

describe('Reactor', function() {

    it("With multiple args", function () {
        let reactor = new Reactor();

        let arg0 = null;
        let arg1 = null;

        reactor.registerEvent("test").addEventListener("test", function (_arg0, _arg1) {
            arg0 = _arg0;
            arg1 = _arg1;
        });

        reactor.dispatchEvent("test", "arg0", "arg1");

        assert.equal(arg0, "arg0");
        assert.equal(arg1, "arg1");

    });

});
