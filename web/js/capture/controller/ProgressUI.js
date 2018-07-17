const electron = require('electron')
const ipcRenderer = electron.ipcRenderer;
const BrowserWindow = electron.BrowserWindow;
const {Preconditions} = require("../../Preconditions");

const log = require("../../logger/Logger").create();

/**
 * @renderer
 */
class ProgressUI {

    constructor() {

        this.progressElement = document.querySelector("progress");

        Preconditions.assertNotNull(this.progressElement, "progressElement");

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

        this.progressElement.value = progressEvent.progress;

    }


}

module.exports.ProgressUI = ProgressUI;

