"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullExternalNavigationBlock = exports.ExternalNavigationBlock = void 0;
const ExternalNavigationBlockDelegates_1 = require("./ExternalNavigationBlockDelegates");
class ExternalNavigationBlock {
    static set(enabled) {
        ExternalNavigationBlockDelegates_1.ExternalNavigationBlockDelegates.get().set(enabled);
    }
    static get() {
        return ExternalNavigationBlockDelegates_1.ExternalNavigationBlockDelegates.get().get();
    }
}
exports.ExternalNavigationBlock = ExternalNavigationBlock;
class NullExternalNavigationBlock {
    set(enabled) {
    }
    get() {
        return true;
    }
}
exports.NullExternalNavigationBlock = NullExternalNavigationBlock;
//# sourceMappingURL=ExternalNavigationBlock.js.map