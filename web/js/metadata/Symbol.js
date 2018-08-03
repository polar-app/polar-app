"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Symbol {
    constructor(name) {
        this.name = name;
    }
    toJSON() {
        return this.name;
    }
}
exports.Symbol = Symbol;
//# sourceMappingURL=Symbol.js.map