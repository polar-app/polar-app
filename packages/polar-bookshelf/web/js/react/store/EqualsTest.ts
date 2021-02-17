import {Equals} from "./Equals";
import {assert} from 'chai';

describe('Equals', function() {

    it("basic 1", function() {
        assert.isTrue(Equals.shallow({}, {}));
    });

    it("basic 2", function() {
        assert.isTrue(Equals.shallow({id: 101}, {id: 101}));
    });

    xit("basic 3", function() {
        assert.isTrue(Equals.shallow({id: 101, expanded: {}}, {id: 101, expanded: {}}));
    });


});
