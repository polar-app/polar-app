import {assert} from 'chai';
import {BlockIDs} from "./BlockIDs";

describe('BlockIDs', () => {

    it("create", () => {
        assert.equal(BlockIDs.create('This is a name', '0x0001'), "12GHwQi7h6BADJPzphRC");
    });

});
