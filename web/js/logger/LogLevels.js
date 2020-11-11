"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevels = void 0;
const LogLevel_1 = require("./LogLevel");
class LogLevels {
    static fromName(name) {
        const result = LogLevel_1.LogLevel[name];
        if (!result) {
            throw new Error("Invalid name: " + name);
        }
        return result;
    }
}
exports.LogLevels = LogLevels;
//# sourceMappingURL=LogLevels.js.map