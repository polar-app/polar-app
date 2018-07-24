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
     * @param webContents {Electron.WebContents} The webContents of the dialog
     * box that started the whole capture.
     *
     * @param url {string}
     */
    async startCapture(webContents, url) {

        webContents = await this.loadApp(webContents, url);

        // FIXME: make this its own function

        let captureResult = await this.runCapture(webContents, url);
        //
        // let captureResult = {
        //     path: "/home/burton/.polar/stash/UK_unveils_new_Tempest_fighter_jet_model___BBC_News.phz"
        // };

        // now load the phz in the target window

        await this.loadPHZ(webContents, captureResult.path);

    }

    /**
     * Setup the
     *
     * @param webContents {Electron.WebContents}
     * @param url {string}
     *
     * @return {Promise<Electron.WebContents>}
     */
    async loadApp(webContents, url) {

        return new Promise(resolve => {

            console.log("Starting capture for URL: " + url);

            // load the capture.html page

            let pageURL = 'http://127.0.0.1:8500/apps/capture/progress/index.html?url=' + encodeURIComponent(url);

            webContents.once("did-finish-load", () => {

                // our app finished loading...
                resolve(webContents);

            });

            webContents.loadURL(pageURL);

        });

    }

    /**
     *
     * @param webContents {Electron.WebContents} The webContents page that
     * should be updated with our progress.
     *
     * @param url {string}
     * @return {Promise<CaptureResult>}
     */
    async runCapture(webContents, url) {

        Preconditions.assertNotNull(webContents, "webContents");

        let progressForwarder = new ProgressForwarder({webContents});

        let captureOpts = new CaptureOpts({
            pendingWebRequestsCallback: event => progressForwarder.pendingWebRequestsCallback(event)
        });

        let browser = BrowserRegistry.DEFAULT;

        //browser = Browsers.toProfile(browser, "headless");
        //browser = Browsers.toProfile(browser, "hidden");
        browser = Browsers.toProfile(browser, "default");

        let capture = new Capture(url, browser, this.directories.stashDir, captureOpts);

        let captureResult = await capture.execute();

        log.info("captureResult: ", captureResult);

        return captureResult;

    }

    /**
     *
     * @param webContents {Electron.WebContents}
     * @param path {string} The path to our phz file.
     * @return {Promise<void>}
     */
    async loadPHZ(webContents, path) {

        let url = await this.phzLoader.registerForLoad(path);

        console.log("Loading PHZ URL: " + url);

        webContents.loadURL(url);

    }

}


class ProgressForwarder {

    constructor(opts) {

        /**
         *
         * @type {Electron.WebContents}
         */
        this.webContents = null;

        Object.assign(this, opts);

        Preconditions.assertNotNull(this.webContents, "webContents");

    }

    pendingWebRequestsCallback(event) {

        this.webContents.send("capture-progress-update", event);

    }

}

module.exports.CaptureController = CaptureController;
