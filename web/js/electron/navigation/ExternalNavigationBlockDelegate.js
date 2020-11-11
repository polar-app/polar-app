"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalNavigationBlockDelegate = void 0;
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class ExternalNavigationBlockDelegate {
    constructor() {
        this.enabled = true;
    }
    set(enabled) {
        log.notice("External navigation block enabled: " + enabled);
        this.enabled = enabled;
    }
    get() {
        return this.enabled;
    }
}
exports.ExternalNavigationBlockDelegate = ExternalNavigationBlockDelegate;
//# sourceMappingURL=ExternalNavigationBlockDelegate.js.map