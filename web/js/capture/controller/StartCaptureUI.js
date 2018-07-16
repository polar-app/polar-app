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

            // TODO: trigger the progress page now...

            this.launchCapture("http://www.example.com")

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
    launchCapture(captureURL) {

        let window = BrowserWindow.getFocusedWindow();

        let url = 'http://127.0.0.1:8500/apps/capture/capture.html?url=' + encodeURIComponent(url);
        window.loadURL(url);

        window.webContents.once("did-finish-load", () => {

        })

    }

}

module.exports.StartCaptureUI = StartCaptureUI;

