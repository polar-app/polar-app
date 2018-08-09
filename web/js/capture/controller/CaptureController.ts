import {AppPaths} from "../../electron/webresource/AppPaths";
import {PHZLoader} from '../../electron/main/PHZLoader';
import {BrowserWindow, ipcMain} from 'electron';
import {Preconditions} from '../../Preconditions';
import {Logger} from '../../logger/Logger';

const {CaptureOpts} = require("../CaptureOpts");
const {Capture} = require("../Capture");
const {Browsers} = require("../../capture/Browsers");
const BrowserRegistry = require("../../capture/BrowserRegistry");

const log = Logger.create();

export class CaptureController {

    /**
     * @type directories {Directories}
     */
    private readonly directories: any;

    /**
     *
     * @type {CacheRegistry} The cache registry we are going to use to
     * register the resulting phz file.
     */
    private readonly cacheRegistry: any;

    private readonly phzLoader: PHZLoader;

    constructor(opts: any) {

        Object.assign(this, opts);

        Preconditions.assertNotNull(this.directories, "directories");
        Preconditions.assertNotNull(this.cacheRegistry, "cacheRegistry");

        this.phzLoader = new PHZLoader({cacheRegistry: this.cacheRegistry});
    }

    /**
     * Start the service to receive and handle IPC messages.
     */
    start() {

        ipcMain.on('capture-controller-start-capture', (event: Electron.Event, message: any) => {

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
    async startCapture(webContents: Electron.WebContents, url: string) {

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
     */
    async loadApp(webContents: Electron.WebContents, url: string): Promise<Electron.WebContents> {

        return new Promise<Electron.WebContents>(resolve => {

            console.log("Starting capture for URL: " + url);

            let appPath = AppPaths.relative('./apps/capture/progress/index.html');
            let appURL = 'file://' + appPath;

            webContents.once("did-finish-load", () => {
                resolve(webContents);
            });

            console.log("Loading app: ", appURL);

            webContents.loadURL(appURL);

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
    async runCapture(webContents: Electron.WebContents, url: string) {

        Preconditions.assertNotNull(webContents, "webContents");

        let progressForwarder = new ProgressForwarder({webContents});

        let captureOpts = new CaptureOpts({
            pendingWebRequestsCallback: (event: any) => progressForwarder.pendingWebRequestsCallback(event)
        });

        let browser = BrowserRegistry.DEFAULT;

        //browser = Browsers.toProfile(browser, "headless");
        browser = Browsers.toProfile(browser, "hidden");
        //browser = Browsers.toProfile(browser, "default");

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
    async loadPHZ(webContents: Electron.WebContents, path: string) {

        let webResource = await this.phzLoader.registerForLoad(path);

        console.log(`Loading PHZ URL via: `, webResource);

        webResource.loadWebContents(webContents);

    }

}


class ProgressForwarder {

    private readonly webContents: Electron.WebContents;

    constructor(opts: any) {

        this.webContents = opts.webContents;

        Preconditions.assertNotNull(this.webContents, "webContents");

    }

    pendingWebRequestsCallback(event: any) {

        this.webContents.send("capture-progress-update", event);

    }

}
