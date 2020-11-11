"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Broadcaster = void 0;
const electron_1 = require("electron");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Broadcasters_1 = require("./Broadcasters");
const BrowserWindowReference_1 = require("../ui/dialog_window/BrowserWindowReference");
const log = Logger_1.Logger.create();
class Broadcaster {
    constructor(inputChannel, outputChannel = inputChannel) {
        this.channel = inputChannel;
        electron_1.ipcMain.on(inputChannel, (event, arg) => {
            log.info("Forwarding message: ", inputChannel, event);
            const senderBrowserWindowReference = new BrowserWindowReference_1.BrowserWindowReference(electron_1.BrowserWindow.fromWebContents(event.sender).id);
            Broadcasters_1.Broadcasters.send(outputChannel, arg, senderBrowserWindowReference);
        });
    }
}
exports.Broadcaster = Broadcaster;
//# sourceMappingURL=Broadcaster.js.map