"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../Preconditions");
const Optional_1 = require("./ts/Optional");
class Arrays {
    static toDict(val) {
        let isObject = typeof val === "object";
        let isArray = val instanceof Array;
        if (!isObject && !isArray) {
            throw new Error("Neither an object or an array.");
        }
        if (isObject && !isArray) {
            return val;
        }
        if (!isArray) {
            throw new Error("Not an array");
        }
        let result = {};
        let arrayVal = val;
        for (let idx = 0; idx < arrayVal.length; ++idx) {
            result[idx] = arrayVal[idx];
        }
        return result;
    }
    static createSiblings(arrayLikeObject) {
        Preconditions_1.Preconditions.assertNotNull(arrayLikeObject, "arrayLikeObject");
        let result = [];
        for (let idx = 0; idx < arrayLikeObject.length; ++idx) {
            result.push(new ArrayPosition(Optional_1.Optional.of(arrayLikeObject[idx - 1]).getOrUndefined(), arrayLikeObject[idx], Optional_1.Optional.of(arrayLikeObject[idx + 1]).getOrUndefined()));
        }
        return result;
    }
    ;
}
exports.Arrays = Arrays;
class ArrayPosition {
    constructor(prev, curr, next) {
        this.prev = prev;
        this.curr = curr;
        this.next = next;
    }
}
//# sourceMappingURL=Arrays.js.map