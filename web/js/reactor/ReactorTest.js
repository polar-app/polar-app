"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Reactor_1 = require("./Reactor");
const assert_1 = __importDefault(require("assert"));
const Assertions_1 = require("../test/Assertions");
describe('Reactor', function () {
    it("With multiple args", function () {
        let reactor = new Reactor_1.Reactor();
        let messageEvent = {
            message: 'hello world'
        };
        let events = [];
        assert_1.default.notEqual(reactor.registerEvent("hello"), undefined);
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
});
//# sourceMappingURL=ReactorTest.js.map