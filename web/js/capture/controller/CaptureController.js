const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const BROWSER_WINDOW_OPTIONS = {

    minWidth: 400,
    minHeight: 300,
    width: 800,
    height: 600,
    show: true,
    webPreferences: {
        nodeIntegration: true,
        defaultEncoding: 'UTF-8',
        webaudio: false
    }

};

class CaptureController {

    /**
     * Start the capture app by opening a new window and loading the URL prompt.
     */
    launchStartCapture() {

        let window = new BrowserWindow(BROWSER_WINDOW_OPTIONS);

        let url = 'http://127.0.0.1:8500/apps/capture/start-capture.html';
        window.loadURL(url);

    }

    /**
     *
     * @param url {string}
     */
    launchCapture(url) {



    }

    /**
     * Start the service to receive and handle IPC messages.
     */
    start() {


        ipcMain.on('capture-controller-start-capture', (event, triggerEvent) => {

        });

    }

}

module.exports.CaptureController = CaptureController;
