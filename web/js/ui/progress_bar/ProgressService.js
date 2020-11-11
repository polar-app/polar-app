"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const electron_1 = require("electron");
const ProgressMessages_1 = require("./ProgressMessages");
const DeterminateProgressBar_1 = require("./DeterminateProgressBar");
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class ProgressService {
    start() {
        if (electron_1.ipcRenderer) {
            electron_1.ipcRenderer.on(ProgressMessages_1.ProgressMessages.CHANNEL, (event, progressMessage) => {
                this.onProgressMessage(progressMessage);
            });
        }
        window.addEventListener("message", event => this.onMessageReceived(event), false);
    }
    onMessageReceived(event) {
        switch (event.data.type) {
            case ProgressMessages_1.ProgressMessages.CHANNEL:
                const typedMessage = event.data;
                this.onProgressMessage(typedMessage.value);
                break;
        }
    }
    onProgressMessage(progressMessage) {
        DeterminateProgressBar_1.DeterminateProgressBar.update(progressMessage);
    }
}
exports.ProgressService = ProgressService;
//# sourceMappingURL=ProgressService.js.map