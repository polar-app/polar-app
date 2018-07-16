const electron = require('electron');
const {CaptureOpts} = require("../CaptureOpts");
const {Capture} = require("../Capture");
const {Preconditions} = require("../../Preconditions");

const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const {Browsers} = require("../../capture/Browsers");
const {PHZLoader} = require("../../electron/main/PHZLoader");

const BrowserRegistry = require("../../capture/BrowserRegistry");
const log = require("../../logger/Logger").create();

class CaptureController {

    constructor(opts) {

        /**
         * @type directories {Directories}
         */
        this.directories = undefined;

        /**
         *
         * @type {CacheRegistry} The cache registry we are going to use to
         * register the resulting phz file.
         */
        this.cacheRegistry = undefined;

        Object.assign(this, opts);

        Preconditions.assertNotNull(this.directories, "directories");
        Preconditions.assertNotNull(this.cacheRegistry, "cacheRegistry");

        this.phzLoader = new PHZLoader({cacheRegistry: this.cacheRegistry});
    }

    /**
     * Start the service to receive and handle IPC messages.
     */
    start() {

        ipcMain.on('capture-controller-start-capture', (event, message) => {

            this.startCapture(event.sender, message.url)
                .catch( err => console.error(err));

        });

    }

    /**
     *
     * @param webContents {Electron.WebContents}
     * @param url {string}
     */
    async startCapture(webContents, url) {

        let window = await this.loadApp(webContents, url);

        // FIXME: make this its own function

        let captureOpts = new CaptureOpts({});

        let browser = BrowserRegistry.DEFAULT;

        browser = Browsers.toProfile(browser, "headless");

        // FIXME: Capture doesn't destroy the window I think...

        let capture = new Capture(url, browser, this.directories.stashDir, captureOpts);

        let captureResult = await capture.execute();

        log.info("captureResult: ", captureResult);

        // FIXME: we have to register the resulting phz with the cacheRegistry
        // now... then load the URL

        // FIXME: now load the phz in the target window via its own function..

        await this.loadPHZ(webContents, captureResult.path);

    }

    /**
     * Setup the
     *
     * @param webContents {Electron.WebContents}
     * @param url {string}
     *
     * @return {Promise<Electron.BrowserWindow>}
     */
    async loadApp(webContents, url) {

        return new Promise(resolve => {

            console.log("Starting capture for URL: " + url);

            let window = BrowserWindow.fromWebContents(webContents);

            // load the capture.html page

            let pageURL = 'http://127.0.0.1:8500/apps/capture/capture.html?url=' + encodeURIComponent(url);

            window.webContents.once("did-finish-load", () => {

                // our app finished loading...
                resolve(window);

            });

            window.loadURL(pageURL);

        });

    }

    /**
     *
     * @param webContents {Electron.WebContents}
     * @param path {string} The path to our phz file.
     * @return {Promise<void>}
     */
    async loadPHZ(webContents, path) {

        let url = await this.phzLoader.registerForLoad(path);
        webContents.loadURL(url);

    }

}

module.exports.CaptureController = CaptureController;
