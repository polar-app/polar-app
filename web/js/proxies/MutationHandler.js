"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MutationType_1 = require("./MutationType");
class MutationHandler {
    constructor(mutationListener) {
        this.mutationListener = mutationListener;
    }
    set(target, property, value, receiver) {
        Reflect.set(target, property, value, receiver);
        return this.mutationListener.onMutation(MutationType_1.MutationType.SET, target, property, value);
    }
    deleteProperty(target, property) {
        Reflect.deleteProperty(target, property);
        return this.mutationListener.onMutation(MutationType_1.MutationType.DELETE, target, property, undefined);
    }
}
exports.MutationHandler = MutationHandler;
//# sourceMappingURL=MutationHandler.js.map