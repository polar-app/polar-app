"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProxyHandler {
    constructor(onSet, onDelete) {
        this.onSet = onSet;
        this.onDelete = onDelete;
    }
    set(target, property, value, receiver) {
        this.onSet(property, value);
        return true;
    }
    deleteProperty(target, property) {
        this.onDelete(property);
        return true;
    }
}
exports.ProxyHandler = ProxyHandler;
;
//# sourceMappingURL=ProxyHandler.js.map