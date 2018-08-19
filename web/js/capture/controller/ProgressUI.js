"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const Logger_1 = require("../../logger/Logger");
const Elements_1 = require("../../util/Elements");
const Preconditions_1 = require("../../Preconditions");
const log = Logger_1.Logger.create();
class ProgressUI {
    constructor() {
    }
    init() {
        log.info("Listening for progress updates...");
        electron_1.ipcRenderer.on('capture-progress-update', (event, progressEvent) => {
            this.onProgressEvent(progressEvent);
        });
    }
    onProgressEvent(progressEvent) {
        console.log("Got progress update: ", progressEvent.progress);
        this.updateProgress(progressEvent);
        this.updateLogView(progressEvent);
    }
    updateProgress(progressEvent) {
        let progressElement = document.querySelector("progress");
        progressElement.value = progressEvent.progress;
    }
    updateLogView(progressEvent) {
        let logElement = Preconditions_1.notNull(document.querySelector(".log"));
        let lineElement = Elements_1.Elements.createElementHTML(`<div class="">${progressEvent.details.url}</div>`);
        logElement.appendChild(lineElement);
    }
}
exports.ProgressUI = ProgressUI;
//# sourceMappingURL=ProgressUI.js.map