import {assert} from 'chai';
import {UndoQueues} from "./UndoQueues";
import { assertJSON } from '../test/Assertions';
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



    it("basic redo", async function() {

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

        assert.equal(await undoQueue.redo(), 'executed');

        assertJSON(store.value(), {
            "101": "101",
            "102": "102",
            "103": "103"
        });


    });

    it("basic redo with all edge cases", async function() {

        const undoQueue = UndoQueues2.create({limit: 3});
        assert.equal(undoQueue.limit, 3);

        const store = createStore();

        assert.equal(await undoQueue.undo(), 'at-head');
        assert.equal(await undoQueue.redo(), 'at-tail');

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

        assert.equal(await undoQueue.redo(), 'executed');

        assertJSON(store.value(), {
            "101": "101",
            "102": "102",
            "103": "103"
        });


    });



    it("full undo and redo", async function() {

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

        assert.equal(await undoQueue.redo(), 'executed');

        assertJSON(store.value(), {
            "101": "101",
        });

        assert.equal(await undoQueue.redo(), 'executed');

        assertJSON(store.value(), {
            "101": "101",
            "102": "102",

        });

        assert.equal(await undoQueue.redo(), 'executed');

        assertJSON(store.value(), {
            "101": "101",
            "102": "102",
            "103": "103"
        });

        assert.equal(await undoQueue.redo(), 'at-tail');

    });

});

