const electron = require('electron')
const ipcRenderer = electron.ipcRenderer;
const {Elements} = require("../../util/Elements");

const log = require("../../logger/Logger").create();

/**
 * @renderer
 */
class ProgressUI {

    constructor() {

    }

    init() {

        // listen and handle "capture-progress" IPC messages

        log.info("Listening for progress updates...");

        ipcRenderer.on('capture-progress-update', (event, progressEvent) => {

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

        let logElement = document.querySelector(".log");

        let lineElement = Elements.createElementHTML(`<div class="">${progressEvent.details.url}</div>`);

        logElement.append(lineElement);

    }

}

module.exports.ProgressUI = ProgressUI;

