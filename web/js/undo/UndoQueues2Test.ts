import {assert} from 'chai';
import {UndoQueues} from "./UndoQueues";
import { assertJSON } from '../test/Assertions';
import UndoFunction = UndoQueues.UndoFunction;
import { UndoQueues2 } from './UndoQueues2';
import IUndoQueueEntry = UndoQueues2.IUndoQueueAction;

describe('UndoQueues2', function() {

    type StoreData = {[id: string]: string};

    interface IStore {
        readonly value: () => StoreData;
        readonly createAction: (key: string, value: string) => IUndoQueueEntry;
    }

    function createStore(): IStore {

        const index: StoreData = {};

        function createAction(key: string, value: string): IUndoQueueEntry {

            const redo = async () => {
                index[key] = value;
            }

            const undo = async () => {
                delete index[key];
            }

            return {redo, undo};

        }


        function value() {
            return index;
        }

        return {
            value, createAction
        };

    }



    it("try to undo when the queue is empty", async function() {
        const undoQueue = UndoQueues2.create();
        const result = await undoQueue.undo();
        assert.equal(result, 'at-head');
    });


    it("try to redo when the queue is empty", async function() {
        const undoQueue = UndoQueues2.create();
        assert.equal(await undoQueue.redo(), 'at-tail');
    });


    it("try to undo when at the head of the queue. No action should be taken", async function() {

        const undoQueue = UndoQueues2.create({limit: 3});
        assert.equal(undoQueue.limit, 3);

        const store = createStore();

        await undoQueue.push(store.createAction('101', '101'))
        await undoQueue.push(store.createAction('102', '102'))
        await undoQueue.push(store.createAction('103', '103'))

        assertJSON(store.value(), {
            "101": "101",
            "102": "102",
            "103": "103"
        });

        assert.equal(await undoQueue.undo(), 'executed');

        assertJSON(store.value(), {
            "101": "101",
            "102": "102",
        });

        assert.equal(await undoQueue.undo(), 'executed');

        assertJSON(store.value(), {
            "101": "101",
        });

        assert.equal(await undoQueue.undo(), 'executed');

        assertJSON(store.value(), {
        });

        assert.equal(await undoQueue.undo(), 'at-head');

        assertJSON(store.value(), {
        });

    });
    //
    // xit("undo and redo with a set", async function() {
    //
    //     const undoQueue = UndoQueues.create({limit: 3});
    //     assert.equal(undoQueue.limit, 3);
    //
    //     const store = createStore();
    //
    //     await undoQueue.push(store.createUndoFunction(101))
    //     assert.equal(store.value(), 101)
    //     await undoQueue.push(store.createUndoFunction(102))
    //     await undoQueue.push(store.createUndoFunction(103))
    //
    // });
    //
    // xit("try to undo and redo when at the tail of the queue. No action should be taken", async function() {
    //     const undoQueue = UndoQueues.create({limit: 3});
    //     assert.equal(undoQueue.limit, 3);
    //
    //     const store = createStore();
    //
    //     await undoQueue.push(store.createUndoFunction(101))
    //     await undoQueue.push(store.createUndoFunction(102))
    //     await undoQueue.push(store.createUndoFunction(103))
    //
    //     assert.equal(await undoQueue.undo(), 'executed');
    //     assert.equal(await undoQueue.undo(), 'executed');
    //     assert.equal(await undoQueue.redo(), 'executed');
    //     assert.equal(await undoQueue.redo(), 'executed');
    //     assert.equal(await undoQueue.redo(), 'at-tail');
    //
    //     assert.equal(store.value(), 103);
    //
    // });
    //
    // xit("test queue limits", async function() {
    //     const undoQueue = UndoQueues.create({limit: 3});
    //     assert.equal(undoQueue.limit, 3);
    //
    //     const store = createStore();
    //
    //     await undoQueue.push(store.createUndoFunction(101))
    //     await undoQueue.push(store.createUndoFunction(102))
    //     await undoQueue.push(store.createUndoFunction(103))
    //     await undoQueue.push(store.createUndoFunction(104))
    //     await undoQueue.push(store.createUndoFunction(105))
    //     await undoQueue.push(store.createUndoFunction(106))
    //
    //     assert.equal(store.value(), 106);
    //     assert.equal(undoQueue.size(), 3);
    //
    // });
    //
    //
    // xit("undo first just the last action", async function() {
    //     const undoQueue = UndoQueues.create();
    //
    //     const store = createStore();
    //
    //     await undoQueue.push(store.createUndoFunction(101))
    //     await undoQueue.push(store.createUndoFunction(102))
    //
    //     await undoQueue.undo();
    //
    //     assert.equal(store.value(), 101);
    //
    // });
    //
    // xit("undo and redo", async function() {
    //     const undoQueue = UndoQueues.create();
    //
    //     const store = createStore();
    //
    //     await undoQueue.push(store.createUndoFunction(101))
    //     await undoQueue.push(store.createUndoFunction(102))
    //
    //     assert.equal(undoQueue.pointer(), 1);
    //
    //     await undoQueue.undo();
    //
    //     assert.equal(store.value(), 101);
    //
    //     assert.equal(await undoQueue.redo(), 'executed');
    //
    //     assert.equal(store.value(), 102);
    //
    // });
    //
    //
    //
    // xit("basic", async function() {
    //
    //     const undoQueue = UndoQueues.create();
    //
    //     let value = 100;
    //
    //     function createUndoFunction(val: number) {
    //         return async () => {
    //             console.log("undo function: set=" + val);
    //             value = val;
    //         }
    //     }
    //
    //     assertJSON(await undoQueue.push(createUndoFunction(101)), {
    //         "id": 0,
    //         "removedFromHead": 0,
    //         "removedFromTail": 0
    //     });
    //
    //     assert.equal(undoQueue.size(), 1);
    //
    //     assertJSON(await undoQueue.push(createUndoFunction(102)), {
    //         "id": 1,
    //         "removedFromHead": 0,
    //         "removedFromTail": 0
    //     });
    //
    //     assert.equal(undoQueue.size(), 2);
    //
    //     assert.equal(value, 102);
    //
    //     assert.equal(undoQueue.pointer(), 1);
    //
    //     assert.equal(await undoQueue.undo(), 'executed')
    //
    //     assert.equal(value, 101);
    //
    // });
    //
    //
    // xit("undo and then push to more entries to the queue thereby clearing the tail", async function() {
    //     const undoQueue = UndoQueues.create();
    //
    //     const store = createStore();
    //
    //     await undoQueue.push(store.createUndoFunction(101))
    //     await undoQueue.push(store.createUndoFunction(102))
    //     assert.equal(undoQueue.size(), 2);
    //
    //     assert.equal(await undoQueue.undo(), 'executed');
    //     assert.equal(store.value(), 101);
    //
    //     assert.equal(undoQueue.pointer(), 0);
    //
    //     assertJSON(await undoQueue.push(store.createUndoFunction(103)), {
    //         "id": 2,
    //         "removedFromHead": 0,
    //         "removedFromTail": 1
    //     });
    //
    //     await undoQueue.push(store.createUndoFunction(104))
    //     assert.equal(undoQueue.size(), 3);
    //
    //     assert.equal(store.value(), 104);
    //     assert.equal(await undoQueue.undo(), 'executed');
    //     assert.equal(store.value(), 103);
    //
    //     assert.equal(await undoQueue.undo(), 'executed');
    //     assert.equal(store.value(), 101);
    //
    // });

});

