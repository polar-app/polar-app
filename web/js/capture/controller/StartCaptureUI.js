"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const Logger_1 = require("../../logger/Logger");
const log = Logger_1.Logger.create();
class StartCaptureUI {
    constructor() {
        console.log("Ready to start capture...xxx");
    }
    init() {
        const form = document.getElementById("url-form");
        form.onsubmit = () => this.onSubmit();
    }
    onSubmit() {
        try {
            const urlElement = document.getElementById("url");
            const url = urlElement.value;
            this.requestStartCapture({
                url
            });
        }
        catch (e) {
            console.error(e);
        }
        return false;
    }
    requestStartCapture(message) {
        log.info("Sending message to start capture: ", message);
        electron_1.ipcRenderer.send('capture-controller-start-capture', message);
    }
}
exports.StartCaptureUI = StartCaptureUI;
//# sourceMappingURL=StartCaptureUI.js.map