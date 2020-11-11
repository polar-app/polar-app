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
const Reactor_1 = require("./Reactor");
const chai_1 = require("chai");
const Assertions_1 = require("../test/Assertions");
describe('Reactor', function () {
    it("With multiple args", function () {
        let reactor = new Reactor_1.Reactor();
        let messageEvent = {
            message: 'hello world'
        };
        let events = [];
        chai_1.assert.notEqual(reactor.registerEvent("hello"), undefined);
        reactor.addEventListener("hello", (messageEvent) => {
            events.push(messageEvent);
        });
        reactor.dispatchEvent("hello", messageEvent);
        Assertions_1.assertJSON(events, [
            {
                "message": "hello world"
            }
        ]);
    });
    it("ordering", function () {
        const reactor = new Reactor_1.Reactor();
        const sources = [];
        chai_1.assert.notEqual(reactor.registerEvent("messages"), undefined);
        reactor.addEventListener("messages", (messageEvent) => {
            console.log('first');
        });
        reactor.addEventListener("messages", (messageEvent) => {
            console.log('second');
        });
        reactor.dispatchEvent("messages", 'hello');
    });
    it("removeEventListener", function () {
        const reactor = new Reactor_1.Reactor();
        const eventName = "messages";
        chai_1.assert.notEqual(reactor.registerEvent(eventName), undefined);
        chai_1.assert.equal(reactor.getEventListeners(eventName).length, 0);
        const listener = (messageEvent) => {
            console.log('first');
        };
        reactor.addEventListener(eventName, listener);
        chai_1.assert.equal(reactor.getEventListeners(eventName).length, 1);
        chai_1.assert.equal(reactor.removeEventListener(eventName, listener), true);
        chai_1.assert.equal(reactor.getEventListeners(eventName).length, 0);
    });
    it("removeEventListener from addEventListener", function () {
        const reactor = new Reactor_1.Reactor();
        const eventName = "messages";
        reactor.registerEvent(eventName);
        const registeredEventListener = reactor.addEventListener(eventName, message => { });
        chai_1.assert.equal(reactor.getEventListeners(eventName).length, 1);
        chai_1.assert.equal(reactor.removeEventListener(eventName, registeredEventListener.eventListener), true);
        chai_1.assert.equal(reactor.getEventListeners(eventName).length, 0);
    });
    it("once", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const reactor = new Reactor_1.Reactor();
            const eventName = "messages";
            chai_1.assert.notEqual(reactor.registerEvent(eventName), undefined);
            chai_1.assert.equal(reactor.getEventListeners(eventName).length, 0);
            const messagePromise = reactor.once(eventName);
            chai_1.assert.equal(reactor.getEventListeners(eventName).length, 1);
            reactor.dispatchEvent(eventName, 'hello');
            reactor.dispatchEvent(eventName, 'world');
            const message = yield messagePromise;
            chai_1.assert.equal(message, 'hello');
            chai_1.assert.equal(reactor.getEventListeners(eventName).length, 0);
        });
    });
});
//# sourceMappingURL=ReactorTest.js.map