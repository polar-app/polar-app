"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectronContexts = void 0;
const electron_1 = require("electron");
const BrowserWindowReference_1 = require("../../ui/dialog_window/BrowserWindowReference");
const ElectronContext_1 = require("./ElectronContext");
class ElectronContexts {
    static create() {
        if (electron_1.remote) {
            const browserWindowReference = new BrowserWindowReference_1.BrowserWindowReference(electron_1.remote.getCurrentWindow().id);
            return new ElectronContext_1.ElectronRendererContext(browserWindowReference);
        }
        else {
            return new ElectronContext_1.ElectronMainContext();
        }
    }
}
exports.ElectronContexts = ElectronContexts;
//# sourceMappingURL=ElectronContexts.js.map