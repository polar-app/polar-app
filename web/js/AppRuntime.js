"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRuntime = void 0;
const electron_1 = require("electron");
class AppRuntime {
    static get() {
        if (electron_1.ipcRenderer) {
            return 'electron-renderer';
        }
        else if (electron_1.ipcMain) {
            return 'electron-main';
        }
        else {
            return 'browser';
        }
    }
    static type() {
        switch (this.get()) {
            case 'electron-renderer':
                return 'electron';
            case 'electron-main':
                return 'electron';
            case 'browser':
                return 'browser';
        }
    }
    static isElectron() {
        return this.get().startsWith('electron-');
    }
    static isBrowser() {
        return this.get() === 'browser';
    }
}
exports.AppRuntime = AppRuntime;
//# sourceMappingURL=AppRuntime.js.map