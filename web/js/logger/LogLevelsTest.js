"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogLevel_1 = require("./LogLevel");
const chai_1 = require("chai");
const LogLevels_1 = require("./LogLevels");
describe('LogLevels', function () {
    it("reverse LogLevel", function () {
        chai_1.assert.equal(LogLevels_1.LogLevels.fromName('INFO'), LogLevel_1.LogLevel.INFO);
    });
    it("invalid", function () {
        chai_1.assert.throws(() => LogLevels_1.LogLevels.fromName('wrong-name'));
    });
});
//# sourceMappingURL=LogLevelsTest.js.map