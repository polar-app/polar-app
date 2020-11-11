"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnkiSyncError = void 0;
class AnkiSyncError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}
exports.AnkiSyncError = AnkiSyncError;
//# sourceMappingURL=AnkiSyncError.js.map