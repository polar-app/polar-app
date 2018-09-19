"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FunctionalInterface {
    static create(name, object) {
        if (!object[name] && typeof object === "function") {
            const functionalInterface = {};
            functionalInterface[name] = object;
            return functionalInterface;
        }
        return object;
    }
}
exports.FunctionalInterface = FunctionalInterface;
//# sourceMappingURL=FunctionalInterface.js.map