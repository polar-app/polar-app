import {assert} from 'chai';
import {UndoQueues} from "./UndoQueues";

describe('UndoQueues', function() {

    // TODO: thing to test
    //
    // - try to undo when at the head of the queue. No action should be taken
    // - try to redo when at the tail of the queue. No action should be taken
    // - write 1 entry, try to undo it..
    // - write 2 entries, try to undo it
    // - write 2 entries, undo one, push a new value, make sure we can't redo now.

    it("try to undo when at the head of the queue", async function() {
        const undoQueue = UndoQueues.create();
        const result = await undoQueue.undo();
        assert.equal(result, 'at-head');
    });

    it("basic", async function() {

        const undoQueue = UndoQueues.create();

        let value = 100;

        await undoQueue.push(async () => {
            value = 101
        });

        await undoQueue.push(async () => {
            value = 102
        });

        assert.equal(value, 102);

        assert.equal(undoQueue.pointer(), 1);

        await undoQueue.undo();

        assert.equal(value, 101);

    });

});
