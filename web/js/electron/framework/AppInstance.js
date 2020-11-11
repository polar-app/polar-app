"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppInstance = void 0;
const electron_1 = require("electron");
class AppInstance {
    static notifyStarted(name) {
        if (!electron_1.ipcRenderer) {
            return;
        }
        electron_1.ipcRenderer.send('app-instance-started:' + name);
    }
}
exports.AppInstance = AppInstance;
//# sourceMappingURL=AppInstance.js.map