"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPCError = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
class IPCError {
    constructor(msg) {
        Preconditions_1.Preconditions.assertString(msg, 'msg');
        this.msg = msg;
    }
    static create(err) {
        if (err instanceof Error) {
            return new IPCError(err.message);
        }
        return new IPCError(err);
    }
}
exports.IPCError = IPCError;
//# sourceMappingURL=IPCError.js.map