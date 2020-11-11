"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedBuffer = void 0;
const SimpleReactor_1 = require("../reactor/SimpleReactor");
class FixedBuffer {
    constructor(capacity) {
        this.buffer = [];
        this.reactor = new SimpleReactor_1.SimpleReactor();
        this.capacity = capacity;
    }
    write(value) {
        if (this.buffer.length >= this.capacity) {
            this.buffer.splice(0, 1);
        }
        this.buffer.push(value);
        this.reactor.dispatchEvent(value);
    }
    clear() {
        this.buffer.splice(0, this.buffer.length);
    }
    toView() {
        return this.buffer;
    }
    addEventListener(eventListener) {
        return this.reactor.addEventListener(eventListener);
    }
}
exports.FixedBuffer = FixedBuffer;
//# sourceMappingURL=FixedBuffer.js.map