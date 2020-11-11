"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppPath = void 0;
const electron_1 = require("electron");
const ElectronContextType_1 = require("../context/ElectronContextType");
const ElectronContextTypes_1 = require("../context/ElectronContextTypes");
if (electron_1.app) {
    global.appPath = electron_1.app.getAppPath();
}
class AppPath {
    static get() {
        const electronContext = ElectronContextTypes_1.ElectronContextTypes.create();
        if (electronContext === ElectronContextType_1.ElectronContextType.RENDERER) {
            return electron_1.remote.getGlobal("appPath");
        }
        else {
            return global.appPath;
        }
    }
    static set(appPath) {
        const electronContext = ElectronContextTypes_1.ElectronContextTypes.create();
        if (electronContext === ElectronContextType_1.ElectronContextType.RENDERER) {
            throw new Error("Call set from main context.");
        }
        global.appPath = appPath;
    }
}
exports.AppPath = AppPath;
//# sourceMappingURL=AppPath.js.map