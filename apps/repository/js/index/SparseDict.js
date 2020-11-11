"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SparseDict = void 0;
class SparseDict {
    constructor(toKey, newValue) {
        this.toKey = toKey;
        this.newValue = newValue;
        this.backing = {};
    }
    read(key) {
        return this.backing[key] || undefined;
    }
    get(key) {
        const k = this.toKey(key);
        if (!this.backing[k]) {
            this.backing[k] = this.newValue(key);
        }
        return this.backing[k];
    }
    purge(predicate) {
        for (const key of this.keys()) {
            const value = this.backing[key];
            if (value && predicate(value)) {
                delete this.backing[key];
            }
        }
    }
    getWithKey(k) {
        return this.backing[k] || undefined;
    }
    keys() {
        return Object.keys(this.backing);
    }
    values() {
        return Object.values(this.backing);
    }
    delete(key) {
        delete this.backing[key];
    }
}
exports.SparseDict = SparseDict;
//# sourceMappingURL=SparseDict.js.map