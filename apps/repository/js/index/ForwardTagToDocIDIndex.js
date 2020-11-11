"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForwardTagToDocIDIndex = void 0;
const SparseDict_1 = require("./SparseDict");
const KeyMemberSet_1 = require("./KeyMemberSet");
const toKey = (key) => {
    return key.id;
};
const newValue = (key) => {
    return new KeyMemberSet_1.KeyMemberSet(key);
};
class ForwardTagToDocIDIndex {
    constructor() {
        this.backing = new SparseDict_1.SparseDict(toKey, newValue);
    }
    get(key) {
        return this.backing.get(key);
    }
    keys() {
        return this.backing.keys();
    }
    values() {
        return this.backing.values();
    }
    delete(key) {
        this.backing.delete(key);
    }
    purge(predicate) {
        this.backing.purge(predicate);
    }
    getWithKey(k) {
        return this.backing.getWithKey(k);
    }
}
exports.ForwardTagToDocIDIndex = ForwardTagToDocIDIndex;
//# sourceMappingURL=ForwardTagToDocIDIndex.js.map