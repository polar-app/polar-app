import {assert} from 'chai';
import {BlockIDs} from "./BlockIDs";

describe('BlockIDs', () => {

    describe('create', () => {

        it("basic", () => {

            assert.equal(BlockIDs.create('World War II', '0x0001'), "1ss6ucq7mf2FXS96zUnG");

            // and must be case insensitive
            assert.equal(BlockIDs.create('world war II', '0x0001'), "1ss6ucq7mf2FXS96zUnG");

        });

    });

    describe('createRandom', () => {

        it("basic", () => {
            assert.equal(BlockIDs.createRandom().length, 20);
        });

    });

});
