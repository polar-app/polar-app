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
const QueuedReactor_1 = require("./QueuedReactor");
const Assertions_1 = require("../test/Assertions");
const SimpleReactor_1 = require("./SimpleReactor");
describe('SimpleQueuedReactor', function () {
    it("With queued messages", function () {
        const reactor = new SimpleReactor_1.SimpleReactor(new QueuedReactor_1.QueuedReactor());
        chai_1.assert.equal(reactor.getEventListeners().length, 0);
        reactor.dispatchEvent('hello');
        reactor.dispatchEvent('world');
        const messages = [];
        reactor.addEventListener((message) => {
            messages.push(message);
        });
        const expected = ["hello", "world"];
        Assertions_1.assertJSON(messages, expected);
        Assertions_1.assertJSON(reactor.delegate.queue, {});
    });
    it("once", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const queuedReactor = new QueuedReactor_1.QueuedReactor();
            const reactor = new SimpleReactor_1.SimpleReactor(queuedReactor);
            chai_1.assert.equal(reactor.delegate, queuedReactor);
            chai_1.assert.equal(reactor.getEventListeners().length, 0);
            reactor.dispatchEvent('hello');
            reactor.dispatchEvent('world');
            const messagePromise = reactor.once();
            const message = yield messagePromise;
            chai_1.assert.equal(message, 'hello');
            chai_1.assert.equal(reactor.getEventListeners().length, 0);
        });
    });
});
//# sourceMappingURL=SimpleQueuedReactorTest.js.map