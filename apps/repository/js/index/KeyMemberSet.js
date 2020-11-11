"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyMemberSet = void 0;
const Sets_1 = require("polar-shared/src/util/Sets");
class KeyMemberSet {
    constructor(key) {
        this.key = key;
        this.members = new Set();
    }
    add(member) {
        this.members.add(member);
    }
    set(members) {
        this.members = new Set(members);
    }
    delete(member) {
        this.members.delete(member);
    }
    count() {
        return this.members.size;
    }
    toArray() {
        return Sets_1.Sets.toArray(this.members);
    }
}
exports.KeyMemberSet = KeyMemberSet;
//# sourceMappingURL=KeyMemberSet.js.map