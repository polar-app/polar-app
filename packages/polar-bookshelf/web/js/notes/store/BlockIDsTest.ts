import {assert} from 'chai';
import {BlockIDs} from "./BlockIDs";

describe('BlockIDs', () => {

    describe('create', () => {

        it("basic", () => {
            assert.equal(BlockIDs.create('This is a name', '0x0001'), "12GHwQi7h6BADJPzphRC");
        });

    });

    describe('createRandom', () => {

        it("basic", () => {
            assert.equal(BlockIDs.createRandom().length, 20);
        });

    });

});
