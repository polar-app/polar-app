"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timeouts = void 0;
class Timeouts {
    static setTimeout(handler, timeout) {
        if (typeof window !== 'undefined' && window && window.setTimeout) {
            const id = window.setTimeout(handler, timeout);
            return new DOMTimeout(id);
        }
        const id = setTimeout(handler, timeout);
        return new NodeTimeout(id);
    }
}
exports.Timeouts = Timeouts;
class DOMTimeout {
    constructor(id) {
        this.id = id;
    }
    clear() {
        window.clearTimeout(this.id);
    }
}
class NodeTimeout {
    constructor(id) {
        this.id = id;
    }
    clear() {
        clearTimeout(this.id);
    }
}
//# sourceMappingURL=Timeouts.js.map