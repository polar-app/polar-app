"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayQueue = void 0;
class ArrayQueue {
    constructor() {
        this.backing = [];
    }
    push(value) {
        this.backing.push(value);
    }
    pop() {
        return this.backing.pop();
    }
    peek() {
        if (this.backing.length > 0) {
            return this.backing[0];
        }
        return undefined;
    }
    delete(value) {
        const idx = this.backing.indexOf(value);
        this.backing.splice(idx, 1);
    }
    size() {
        return this.backing.length;
    }
}
exports.ArrayQueue = ArrayQueue;
//# sourceMappingURL=ArrayQueue.js.map