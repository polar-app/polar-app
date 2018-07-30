"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
class Broadcaster {
    constructor(name) {
        this.name = name;
        electron_1.ipcMain.on(name, (event, arg) => {
            console.log("Forwarding message: ", name, event);
            let browserWindows = electron_1.BrowserWindow.getAllWindows();
            browserWindows.forEach(window => {
                window.webContents.send(name, arg);
            });
        });
    }
}
module.exports.Broadcaster = Broadcaster;
//# sourceMappingURL=Broadcaster.js.map