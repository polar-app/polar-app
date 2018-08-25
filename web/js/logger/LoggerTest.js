"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const TestingTime_1 = require("../test/TestingTime");
const Logger_1 = require("./Logger");
TestingTime_1.TestingTime.freeze();
describe('Logger', function () {
    it("basic", function () {
        const log = Logger_1.Logger.create();
        assert_1.default.equal(log != null, true);
    });
    it("with two arguments", function () {
        const log = Logger_1.Logger.create();
        let hello = { msg: 'hello' };
        let world = { msg: 'world' };
        log.info("with two arguments:", hello, world);
    });
    it("with exception", function () {
        const log = Logger_1.Logger.create();
        log.error("This is an error: ", new Error('Something broke'));
    });
});
//# sourceMappingURL=LoggerTest.js.map