import {assert} from 'chai';
import {UndoQueues} from "./UndoQueues";
import { assertJSON } from '../test/Assertions';

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

        function createUndoFunction(val: number) {
            return async () => {
                console.log("undo function: set=" + val);
                value = val;
            }
        }

        assertJSON(await undoQueue.push(createUndoFunction(101)), {
            "id": 0,
            "removedFromHead": 0,
            "removedFromTail": 0
        });

        assert.equal(undoQueue.size(), 1);

        assertJSON(await undoQueue.push(createUndoFunction(102)), {
            "id": 1,
            "removedFromHead": 0,
            "removedFromTail": 0
        });

        assert.equal(undoQueue.size(), 2);

        assert.equal(value, 102);

        assert.equal(undoQueue.pointer(), 0);

        assert.equal(await undoQueue.undo(), 'executed')

        assert.equal(value, 101);

    });

});
