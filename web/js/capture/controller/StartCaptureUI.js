const electron = require('electron')
const ipcRenderer = electron.ipcRenderer;
const BrowserWindow = electron.BrowserWindow;

/**
 * @renderer
 */
class StartCaptureUI {

    constructor() {
        console.log("Ready to start capture...xxx");

    }

    init() {

        // wire up the event listeners...

        let form = document.getElementById("url-form");
        form.onsubmit = () => this.onSubmit();

    }

    onSubmit() {

        try{

            console.log("onSubmit");

            let url = document.getElementById("url").value;

            this.requestStartCapture({
                url
            });

        } catch (e) {
            console.error(e);
        }

        return false;

    }

    /**
     * Send a message to the main process to start the capture for us.
     *
     * @param url
     */
    requestStartCapture(message) {

        console.log("Sending message to start capture: ", message);
        ipcRenderer.send('capture-controller-start-capture', message);

    }

}

module.exports.StartCaptureUI = StartCaptureUI;

