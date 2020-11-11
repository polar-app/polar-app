"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = void 0;
class Errors {
    static rethrow(err, message) {
        const msg = `${message}: ${err.message}`;
        throw Object.assign({ msg }, err);
    }
}
exports.Errors = Errors;
//# sourceMappingURL=Errors.js.map