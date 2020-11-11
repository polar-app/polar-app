"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Either = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
class Either {
    constructor(left, right) {
        this.left = left;
        this.right = right;
        this.hasLeft = Preconditions_1.isPresent(left);
        this.hasRight = Preconditions_1.isPresent(right);
    }
    handle(left, right) {
        if (this.hasLeft) {
            left(this.left);
        }
        else {
            right(this.right);
        }
    }
    convertLeftToRight(converter) {
        if (this.hasRight) {
            return this.right;
        }
        return converter(this.left);
    }
    convertRightToLeft(converter) {
        if (this.hasLeft) {
            return this.left;
        }
        return converter(this.right);
    }
    static ofLeft(value) {
        if (value instanceof Either) {
            return value;
        }
        return new Either(value, undefined);
    }
    static ofRight(value) {
        if (value instanceof Either) {
            return value;
        }
        return new Either(undefined, value);
    }
}
exports.Either = Either;
//# sourceMappingURL=Either.js.map