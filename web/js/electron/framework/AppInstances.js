"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppInstances = void 0;
const electron_1 = require("electron");
class AppInstances {
    static waitForStarted(name) {
        return new Promise(resolve => {
            electron_1.ipcMain.once('app-instance-started:' + name, () => {
                resolve();
            });
        });
    }
}
exports.AppInstances = AppInstances;
//# sourceMappingURL=AppInstances.js.map