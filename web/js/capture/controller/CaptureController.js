"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppPaths_1 = require("../../electron/webresource/AppPaths");
const PHZLoader_1 = require("../../electron/main/PHZLoader");
const electron_1 = require("electron");
const Preconditions_1 = require("../../Preconditions");
const Logger_1 = require("../../logger/Logger");
const { CaptureOpts } = require("../CaptureOpts");
const { Capture } = require("../Capture");
const { Browsers } = require("../../capture/Browsers");
const BrowserRegistry = require("../../capture/BrowserRegistry");
const log = Logger_1.Logger.create();
class CaptureController {
    constructor(opts) {
        Object.assign(this, opts);
        Preconditions_1.Preconditions.assertNotNull(this.directories, "directories");
        Preconditions_1.Preconditions.assertNotNull(this.cacheRegistry, "cacheRegistry");
        this.phzLoader = new PHZLoader_1.PHZLoader({ cacheRegistry: this.cacheRegistry });
    }
    start() {
        electron_1.ipcMain.on('capture-controller-start-capture', (event, message) => {
            this.startCapture(event.sender, message.url)
                .catch(err => console.error(err));
        });
    }
    startCapture(webContents, url) {
        return __awaiter(this, void 0, void 0, function* () {
            webContents = yield this.loadApp(webContents, url);
            let captureResult = yield this.runCapture(webContents, url);
            yield this.loadPHZ(webContents, captureResult.path);
        });
    }
    loadApp(webContents, url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                console.log("Starting capture for URL: " + url);
                let appPath = AppPaths_1.AppPaths.createFromRelative('./apps/capture/progress/index.html');
                let appURL = 'file://' + appPath;
                webContents.once("did-finish-load", () => {
                    resolve(webContents);
                });
                console.log("Loading app: ", appURL);
                webContents.loadURL(appURL);
            });
        });
    }
    runCapture(webContents, url) {
        return __awaiter(this, void 0, void 0, function* () {
            Preconditions_1.Preconditions.assertNotNull(webContents, "webContents");
            let progressForwarder = new ProgressForwarder({ webContents });
            let captureOpts = new CaptureOpts({
                pendingWebRequestsCallback: (event) => progressForwarder.pendingWebRequestsCallback(event)
            });
            let browser = BrowserRegistry.DEFAULT;
            browser = Browsers.toProfile(browser, "hidden");
            let capture = new Capture(url, browser, this.directories.stashDir, captureOpts);
            let captureResult = yield capture.execute();
            log.info("captureResult: ", captureResult);
            return captureResult;
        });
    }
    loadPHZ(webContents, path) {
        return __awaiter(this, void 0, void 0, function* () {
            let webResource = yield this.phzLoader.registerForLoad(path);
            console.log(`Loading PHZ URL via: `, webResource);
            webResource.loadWebContents(webContents);
        });
    }
}
exports.CaptureController = CaptureController;
class ProgressForwarder {
    constructor(opts) {
        this.webContents = opts.webContents;
        Preconditions_1.Preconditions.assertNotNull(this.webContents, "webContents");
    }
    pendingWebRequestsCallback(event) {
        this.webContents.send("capture-progress-update", event);
    }
}
//# sourceMappingURL=CaptureController.js.map