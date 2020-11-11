"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReverseDocIDToTagIndex = void 0;
const SparseDict_1 = require("./SparseDict");
const KeyMemberSet_1 = require("./KeyMemberSet");
const toKey = (key) => {
    return key;
};
const newValue = (key) => {
    return new KeyMemberSet_1.KeyMemberSet(key);
};
class ReverseDocIDToTagIndex extends SparseDict_1.SparseDict {
    constructor() {
        super(toKey, newValue);
    }
}
exports.ReverseDocIDToTagIndex = ReverseDocIDToTagIndex;
//# sourceMappingURL=ReverseDocIDToTagIndex.js.map