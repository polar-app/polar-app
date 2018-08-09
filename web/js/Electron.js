"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Electron {
    static isElectron() {
        let userAgent = navigator.userAgent.toLowerCase();
        return userAgent.indexOf(' electron/') !== -1;
    }
}
exports.Electron = Electron;
//# sourceMappingURL=Electron.js.map