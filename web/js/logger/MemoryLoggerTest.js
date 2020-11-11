"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MemoryLogger_1 = require("./MemoryLogger");
const Assertions_1 = require("../test/Assertions");
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
describe('MemoryLogger', function () {
    beforeEach(function () {
        TestingTime_1.TestingTime.freeze();
    });
    it("basic", function () {
        const memoryLogger = new MemoryLogger_1.MemoryLogger();
        memoryLogger.info("hello", "world");
        const expected = [
            {
                "timestamp": "2012-03-02T11:38:49.321Z",
                "idx": 0,
                "level": "info",
                "msg": "hello",
                "args": [
                    "world"
                ]
            }
        ];
        Assertions_1.assertJSON(memoryLogger.toJSON(), expected);
    });
});
//# sourceMappingURL=MemoryLoggerTest.js.map