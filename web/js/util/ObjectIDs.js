"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectIDs = void 0;
let seq = 0;
class ObjectIDs {
    static create() {
        return seq++;
    }
    static equals(a, b) {
        return a.oid === b.oid;
    }
}
exports.ObjectIDs = ObjectIDs;
//# sourceMappingURL=ObjectIDs.js.map