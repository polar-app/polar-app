import {assert} from 'chai';
import {UndoQueues} from "./UndoQueues";
import { assertJSON } from '../test/Assertions';
import UndoFunction = UndoQueues.UndoFunction;

describe('UndoQueues', function() {

    interface IStore {
        readonly value: () => number;
        readonly createUndoFunction: (val: number) => UndoFunction;
    }

    function createStore(): IStore {

        let current = 100;

        function createUndoFunction(val: number) {
            return async () => {
                console.log("undo function: set=" + val);
                current = val;
            }
        }

        function value() {
            return current;
        }

        return {
            value, createUndoFunction
        };

    }

    it("try to undo when the queue is empty", async function() {
        const undoQueue = UndoQueues.create();
        const result = await undoQueue.undo();
        assert.equal(result, 'at-head');
    });

    it("try to redo when the queue is empty", async function() {
        const undoQueue = UndoQueues.create();
        assert.equal(await undoQueue.redo(), 'at-tail');
    });


    it("try to undo when at the head of the queue. No action should be taken", async function() {
        const undoQueue = UndoQueues.create({limit: 3});
        assert.equal(undoQueue.limit, 3);

        const store = createStore();

        await undoQueue.push(store.createUndoFunction(101))
        await undoQueue.push(store.createUndoFunction(102))
        await undoQueue.push(store.createUndoFunction(103))

        assert.equal(await undoQueue.undo(), 'executed');
        assert.equal(await undoQueue.undo(), 'executed');
        assert.equal(await undoQueue.undo(), 'at-head');
        assert.equal(await undoQueue.undo(), 'at-head');

        assert.equal(store.value(), 101);

    });

    it("undo and redo with a set", async function() {

        const undoQueue = UndoQueues.create({limit: 3});
        assert.equal(undoQueue.limit, 3);

        const store = createStore();

        await undoQueue.push(store.createUndoFunction(101))
        assert.equal(store.value(), 101)
        await undoQueue.push(store.createUndoFunction(102))
        await undoQueue.push(store.createUndoFunction(103))

    });

    it("try to undo and redo when at the tail of the queue. No action should be taken", async function() {
        const undoQueue = UndoQueues.create({limit: 3});
        assert.equal(undoQueue.limit, 3);

        const store = createStore();

        await undoQueue.push(store.createUndoFunction(101))
        await undoQueue.push(store.createUndoFunction(102))
        await undoQueue.push(store.createUndoFunction(103))

        assert.equal(await undoQueue.undo(), 'executed');
        assert.equal(await undoQueue.undo(), 'executed');
        assert.equal(await undoQueue.redo(), 'executed');
        assert.equal(await undoQueue.redo(), 'executed');
        assert.equal(await undoQueue.redo(), 'at-tail');

        assert.equal(store.value(), 103);

    });

    it("test queue limits", async function() {
        const undoQueue = UndoQueues.create({limit: 3});
        assert.equal(undoQueue.limit, 3);

        const store = createStore();

        await undoQueue.push(store.createUndoFunction(101))
        await undoQueue.push(store.createUndoFunction(102))
        await undoQueue.push(store.createUndoFunction(103))
        await undoQueue.push(store.createUndoFunction(104))
        await undoQueue.push(store.createUndoFunction(105))
        await undoQueue.push(store.createUndoFunction(106))

        assert.equal(store.value(), 106);
        assert.equal(undoQueue.size(), 3);

    });


    it("undo first just the last action", async function() {
        const undoQueue = UndoQueues.create();

        const store = createStore();

        await undoQueue.push(store.createUndoFunction(101))
        await undoQueue.push(store.createUndoFunction(102))

        await undoQueue.undo();

        assert.equal(store.value(), 101);

    });

    it("undo and redo", async function() {
        const undoQueue = UndoQueues.create();

        const store = createStore();

        await undoQueue.push(store.createUndoFunction(101))
        await undoQueue.push(store.createUndoFunction(102))

        assert.equal(undoQueue.pointer(), 1);

        await undoQueue.undo();

        assert.equal(store.value(), 101);

        assert.equal(await undoQueue.redo(), 'executed');

        assert.equal(store.value(), 102);

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

        assert.equal(undoQueue.pointer(), 1);

        assert.equal(await undoQueue.undo(), 'executed')

        assert.equal(value, 101);

    });


    it("undo and then push to more entries to the queue thereby clearing the tail", async function() {
        const undoQueue = UndoQueues.create();

        const store = createStore();

        await undoQueue.push(store.createUndoFunction(101))
        await undoQueue.push(store.createUndoFunction(102))
        assert.equal(undoQueue.size(), 2);

        assert.equal(await undoQueue.undo(), 'executed');
        assert.equal(store.value(), 101);

        assert.equal(undoQueue.pointer(), 0);

        assertJSON(await undoQueue.push(store.createUndoFunction(103)), {
            "id": 2,
            "removedFromHead": 0,
            "removedFromTail": 1
        });

        await undoQueue.push(store.createUndoFunction(104))
        assert.equal(undoQueue.size(), 3);

        assert.equal(store.value(), 104);
        assert.equal(await undoQueue.undo(), 'executed');
        assert.equal(store.value(), 103);

        assert.equal(await undoQueue.undo(), 'executed');
        assert.equal(store.value(), 101);

    });

});

