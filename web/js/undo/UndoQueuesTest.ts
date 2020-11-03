import {assert} from 'chai';
import {UndoQueues} from "./UndoQueues";

describe('UndoQueues', function() {

    it("basic", async function() {

        const undo = UndoQueues.create();

        let value = 100;

        await undo.push(async () => {
            value = 101
        });

        await undo.push(async () => {
            value = 102
        });

        assert.equal(value, 102);

        assert.equal(undo.pointer(), 1);

        await undo.undo();

        assert.equal(value, 101);

    });

});
