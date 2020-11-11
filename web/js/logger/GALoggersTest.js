"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const GALoggers_1 = require("./GALoggers");
const Assertions_1 = require("../test/Assertions");
describe('GALoggers', function () {
    it("getError", function () {
        const error = new Error("asdf");
        chai_1.assert.equal(error, GALoggers_1.GALoggers.getError(["asdf", error, "asdf"]));
        chai_1.assert.equal(error, GALoggers_1.GALoggers.getError([error, "asdf"]));
        chai_1.assert.equal(error, GALoggers_1.GALoggers.getError([error]));
        chai_1.assert.isTrue(GALoggers_1.GALoggers.getError([]) === undefined);
        chai_1.assert.isTrue(GALoggers_1.GALoggers.getError(["asdf"]) === undefined);
    });
    it("toEvent", function () {
        chai_1.assert.isTrue(GALoggers_1.GALoggers.toEvent(undefined) === undefined);
        const error = new Error("This is my error");
        Assertions_1.assertJSON(GALoggers_1.GALoggers.toEvent(error), {
            "action": "this-is-my-error",
            "category": "error"
        });
    });
    it("toEvent with long string", function () {
        chai_1.assert.isTrue(GALoggers_1.GALoggers.toEvent(undefined) === undefined);
        const error = new Error("This is my error This is my error This is my error This is my error This is my error This is my error This is my error This is my error");
        Assertions_1.assertJSON(GALoggers_1.GALoggers.toEvent(error), {
            "action": "this-is-my-error-this-is-my-error-this-is-my-error-this-is-my-error-this-is-my-e",
            "category": "error"
        });
    });
});
//# sourceMappingURL=GALoggersTest.js.map