"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Broadcasters = void 0;
const electron_1 = require("electron");
class Broadcasters {
    static send(channel, message, ...excluding) {
        const excludingIDs = excluding.map(current => current.id);
        let browserWindows = electron_1.BrowserWindow.getAllWindows();
        browserWindows = browserWindows.filter(current => !excludingIDs.includes(current.id));
        browserWindows.forEach((window) => {
            window.webContents.send(channel, message);
        });
    }
}
exports.Broadcasters = Broadcasters;
//# sourceMappingURL=Broadcasters.js.map