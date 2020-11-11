"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const UndoQueues_1 = require("./UndoQueues");
const Assertions_1 = require("../test/Assertions");
describe('UndoQueues', function () {
    function createStore() {
        let current = 100;
        function createUndoFunction(val) {
            return () => __awaiter(this, void 0, void 0, function* () {
                console.log("undo function: set=" + val);
                current = val;
            });
        }
        function value() {
            return current;
        }
        return {
            value, createUndoFunction
        };
    }
    it("try to undo when the queue is empty", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const undoQueue = UndoQueues_1.UndoQueues.create();
            const result = yield undoQueue.undo();
            chai_1.assert.equal(result, 'at-head');
        });
    });
    it("try to redo when the queue is empty", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const undoQueue = UndoQueues_1.UndoQueues.create();
            chai_1.assert.equal(yield undoQueue.redo(), 'at-tail');
        });
    });
    it("try to undo when at the head of the queue. No action should be taken", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const undoQueue = UndoQueues_1.UndoQueues.create({ limit: 3 });
            chai_1.assert.equal(undoQueue.limit, 3);
            const store = createStore();
            yield undoQueue.push(store.createUndoFunction(101));
            yield undoQueue.push(store.createUndoFunction(102));
            yield undoQueue.push(store.createUndoFunction(103));
            chai_1.assert.equal(yield undoQueue.undo(), 'executed');
            chai_1.assert.equal(yield undoQueue.undo(), 'executed');
            chai_1.assert.equal(yield undoQueue.undo(), 'at-head');
            chai_1.assert.equal(yield undoQueue.undo(), 'at-head');
            chai_1.assert.equal(store.value(), 101);
        });
    });
    it("try to unredodo when at the tail of the queue. No action should be taken", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const undoQueue = UndoQueues_1.UndoQueues.create({ limit: 3 });
            chai_1.assert.equal(undoQueue.limit, 3);
            const store = createStore();
            yield undoQueue.push(store.createUndoFunction(101));
            yield undoQueue.push(store.createUndoFunction(102));
            yield undoQueue.push(store.createUndoFunction(103));
            chai_1.assert.equal(yield undoQueue.undo(), 'executed');
            chai_1.assert.equal(yield undoQueue.undo(), 'executed');
            chai_1.assert.equal(yield undoQueue.redo(), 'executed');
            chai_1.assert.equal(yield undoQueue.redo(), 'executed');
            chai_1.assert.equal(yield undoQueue.redo(), 'at-tail');
            chai_1.assert.equal(store.value(), 103);
        });
    });
    it("test queue limits", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const undoQueue = UndoQueues_1.UndoQueues.create({ limit: 3 });
            chai_1.assert.equal(undoQueue.limit, 3);
            const store = createStore();
            yield undoQueue.push(store.createUndoFunction(101));
            yield undoQueue.push(store.createUndoFunction(102));
            yield undoQueue.push(store.createUndoFunction(103));
            yield undoQueue.push(store.createUndoFunction(104));
            yield undoQueue.push(store.createUndoFunction(105));
            yield undoQueue.push(store.createUndoFunction(106));
            chai_1.assert.equal(store.value(), 106);
            chai_1.assert.equal(undoQueue.size(), 3);
        });
    });
    it("undo first just the last action", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const undoQueue = UndoQueues_1.UndoQueues.create();
            const store = createStore();
            yield undoQueue.push(store.createUndoFunction(101));
            yield undoQueue.push(store.createUndoFunction(102));
            yield undoQueue.undo();
            chai_1.assert.equal(store.value(), 101);
        });
    });
    it("undo and redo", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const undoQueue = UndoQueues_1.UndoQueues.create();
            const store = createStore();
            yield undoQueue.push(store.createUndoFunction(101));
            yield undoQueue.push(store.createUndoFunction(102));
            chai_1.assert.equal(undoQueue.pointer(), 1);
            yield undoQueue.undo();
            chai_1.assert.equal(store.value(), 101);
            chai_1.assert.equal(yield undoQueue.redo(), 'executed');
            chai_1.assert.equal(store.value(), 102);
        });
    });
    it("basic", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const undoQueue = UndoQueues_1.UndoQueues.create();
            let value = 100;
            function createUndoFunction(val) {
                return () => __awaiter(this, void 0, void 0, function* () {
                    console.log("undo function: set=" + val);
                    value = val;
                });
            }
            Assertions_1.assertJSON(yield undoQueue.push(createUndoFunction(101)), {
                "id": 0,
                "removedFromHead": 0,
                "removedFromTail": 0
            });
            chai_1.assert.equal(undoQueue.size(), 1);
            Assertions_1.assertJSON(yield undoQueue.push(createUndoFunction(102)), {
                "id": 1,
                "removedFromHead": 0,
                "removedFromTail": 0
            });
            chai_1.assert.equal(undoQueue.size(), 2);
            chai_1.assert.equal(value, 102);
            chai_1.assert.equal(undoQueue.pointer(), 1);
            chai_1.assert.equal(yield undoQueue.undo(), 'executed');
            chai_1.assert.equal(value, 101);
        });
    });
    it("undo and then push to more entries to the queue thereby clearing the tail", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const undoQueue = UndoQueues_1.UndoQueues.create();
            const store = createStore();
            yield undoQueue.push(store.createUndoFunction(101));
            yield undoQueue.push(store.createUndoFunction(102));
            chai_1.assert.equal(undoQueue.size(), 2);
            chai_1.assert.equal(yield undoQueue.undo(), 'executed');
            chai_1.assert.equal(store.value(), 101);
            chai_1.assert.equal(undoQueue.pointer(), 0);
            Assertions_1.assertJSON(yield undoQueue.push(store.createUndoFunction(103)), {
                "id": 2,
                "removedFromHead": 0,
                "removedFromTail": 1
            });
            yield undoQueue.push(store.createUndoFunction(104));
            chai_1.assert.equal(undoQueue.size(), 3);
            chai_1.assert.equal(store.value(), 104);
            chai_1.assert.equal(yield undoQueue.undo(), 'executed');
            chai_1.assert.equal(store.value(), 103);
            chai_1.assert.equal(yield undoQueue.undo(), 'executed');
            chai_1.assert.equal(store.value(), 101);
        });
    });
});
//# sourceMappingURL=UndoQueuesTest.js.map