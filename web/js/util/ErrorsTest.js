"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Errors_1 = require("./Errors");
describe('Errors', function () {
    it("basic", function () {
        try {
            Errors_1.Errors.rethrow(new Error("root cause: "), "rethrow cause: ");
            chai_1.assert.ok(false, "Should not have reached here");
        }
        catch (e) {
            chai_1.assert.equal(e.msg, "rethrow cause: : root cause: ");
        }
    });
});
//# sourceMappingURL=ErrorsTest.js.map