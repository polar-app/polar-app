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
const CaptureOpts_1 = require("./CaptureOpts");
const electron_1 = require("electron");
const CaptureResult_1 = require("./CaptureResult");
const Logger_1 = require("../logger/Logger");
const Preconditions_1 = require("../Preconditions");
const debug = require('debug');
const { Filenames } = require("../util/Filenames");
const { Files } = require("../util/Files");
const { Functions } = require("../util/Functions");
const { BrowserWindows } = require("./BrowserWindows");
const { WebRequestReactor } = require("../webrequests/WebRequestReactor");
const { CapturedPHZWriter } = require("./CapturedPHZWriter");
const { DefaultPagingBrowser } = require("../electron/capture/pagination/DefaultPagingBrowser");
const { PagingLoader } = require("../electron/capture/pagination/PagingLoader");
const { PendingWebRequestsListener } = require("../webrequests/PendingWebRequestsListener");
const { DebugWebRequestsListener } = require("../webrequests/DebugWebRequestsListener");
const { Dimensions } = require("../util/Dimensions");
const log = Logger_1.Logger.create();
const USE_PAGING_LOADER = false;
const EXECUTE_CAPTURE_DELAY = 1500;
class Capture {
    constructor(url, browser, stashDir, captureOpts = new CaptureOpts_1.CaptureOpts()) {
        this.webRequestReactors = [];
        this.resolve = () => { };
        this.windowConfigured = false;
        this.url = Preconditions_1.Preconditions.assertNotNull(url, "url");
        this.browser = Preconditions_1.Preconditions.assertNotNull(browser, "browser");
        this.stashDir = Preconditions_1.Preconditions.assertNotNull(stashDir, "stashDir");
        this.captureOpts = captureOpts;
        this.pendingWebRequestsListener = new PendingWebRequestsListener();
        this.debugWebRequestsListener = new DebugWebRequestsListener();
        if (captureOpts.pendingWebRequestsCallback) {
            this.pendingWebRequestsListener.addEventListener(captureOpts.pendingWebRequestsCallback);
        }
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.window = yield this.createWindow();
            this.loadURL(this.url);
            return new Promise(resolve => {
                this.resolve = resolve;
            });
        });
    }
    loadURL(url) {
        if (!this.window) {
            throw new Error("No window");
        }
        this.url = url;
        const loadURLOptions = {
            extraHeaders: `pragma: no-cache\nreferer: ${url}\n`,
            userAgent: this.browser.userAgent
        };
        this.window.loadURL(url, loadURLOptions);
    }
    startCapture(window) {
        return __awaiter(this, void 0, void 0, function* () {
            if (USE_PAGING_LOADER) {
                let pagingBrowser = new DefaultPagingBrowser(window.webContents);
                let pagingLoader = new PagingLoader(pagingBrowser, () => __awaiter(this, void 0, void 0, function* () {
                    log.info("Paging loader finished.");
                }));
                yield pagingLoader.onLoad();
            }
            this.webRequestReactors.forEach(webRequestReactor => {
                log.info("Stopping webRequestReactor...");
                webRequestReactor.stop();
                log.info("Stopping webRequestReactor...done");
            });
            yield Functions.waitFor(EXECUTE_CAPTURE_DELAY);
            this.executeContentCapture()
                .catch(err => log.error(err));
        });
    }
    getAmpURL() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.window) {
                throw new Error("No window");
            }
            function fetchAmpURL() {
                let link = document.querySelector("link[rel='amphtml']");
                if (link) {
                    return link.href;
                }
                return null;
            }
            return yield this.window.webContents.executeJavaScript(Functions.functionToScript(fetchAmpURL));
        });
    }
    executeContentCapture() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.window || !this.window.webContents)
                throw new Error("No window");
            let window = this.window;
            let webContents = window.webContents;
            log.info("Capturing the HTML...");
            log.info("Retrieving HTML...");
            let captured;
            try {
                captured = yield webContents.executeJavaScript("ContentCapture.captureHTML()");
            }
            catch (e) {
                log.error("Could not capture HTML: ", e);
            }
            log.info("Retrieving HTML...done");
            captured.browser = this.browser;
            let stashDir = this.stashDir;
            let filename = Filenames.sanitize(captured.title);
            let phzPath = `${stashDir}/${filename}.phz`;
            log.info("Writing PHZ to: " + phzPath);
            let capturedPHZWriter = new CapturedPHZWriter(phzPath);
            yield capturedPHZWriter.convert(captured);
            yield Files.writeFileAsync(`/tmp/${filename}.json`, JSON.stringify(captured, null, "  "));
            log.info("Capturing the HTML...done");
            window.close();
            this.resolve(new CaptureResult_1.CaptureResult({
                path: phzPath
            }));
        });
    }
    onWebRequest(webRequest) {
        let webRequestReactor = new WebRequestReactor(webRequest);
        webRequestReactor.start();
        this.webRequestReactors.push(webRequestReactor);
        this.pendingWebRequestsListener.register(webRequestReactor);
    }
    createWindow() {
        return __awaiter(this, void 0, void 0, function* () {
            let browserWindowOptions = BrowserWindows.toBrowserWindowOptions(this.browser);
            log.info("Using browserWindowOptions: ", browserWindowOptions);
            let newWindow = new electron_1.BrowserWindow(browserWindowOptions);
            this.onWebRequest(newWindow.webContents.session.webRequest);
            newWindow.webContents.on('dom-ready', function (e) {
                log.info("dom-ready: ", e);
            });
            newWindow.on('close', function (e) {
                e.preventDefault();
                newWindow.webContents.clearHistory();
                newWindow.webContents.session.clearCache(function () {
                    newWindow.destroy();
                });
            });
            newWindow.on('closed', function () {
            });
            newWindow.webContents.on('new-window', function (e, url) {
            });
            newWindow.webContents.on('will-navigate', function (e, url) {
                e.preventDefault();
            });
            newWindow.once('ready-to-show', () => {
            });
            newWindow.webContents.on('did-fail-load', function (event, errorCode, errorDescription, validateURL, isMainFrame) {
                log.info("did-fail-load: ", { event, errorCode, errorDescription, validateURL, isMainFrame }, event);
            });
            newWindow.webContents.on('did-start-loading', (event) => {
                log.info("Registering new webRequest listeners");
                let webContents = event.sender;
                log.info("Detected new loading page: " + webContents.getURL());
                if (!this.windowConfigured) {
                    this.configureWindow(newWindow)
                        .catch(err => log.error(err));
                    this.windowConfigured = true;
                }
            });
            newWindow.webContents.on('did-finish-load', () => __awaiter(this, arguments, void 0, function* () {
                log.info("did-finish-load: ", arguments);
                let ampURL = yield this.getAmpURL();
                if (this.captureOpts.amp && ampURL && ampURL !== this.url) {
                    log.info("Found AMP URL.  Redirecting then loading: " + ampURL);
                    this.loadURL(ampURL);
                    return;
                }
                setTimeout(() => {
                    if (!this.window) {
                        throw new Error("No window");
                    }
                    this.startCapture(this.window)
                        .catch(err => log.error(err));
                }, 1);
            }));
            return newWindow;
        });
    }
    configureWindow(window) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info("Emulating browser: " + JSON.stringify(this.browser, null, "  "));
            log.info("Muting audio...");
            window.webContents.setAudioMuted(true);
            let deviceEmulation = this.browser.deviceEmulation;
            deviceEmulation = Object.assign({}, deviceEmulation);
            log.info("Emulating device...");
            window.webContents.enableDeviceEmulation(deviceEmulation);
            window.webContents.setUserAgent(this.browser.userAgent);
            let windowDimensions = {
                width: deviceEmulation.screenSize.width,
                height: deviceEmulation.screenSize.height,
            };
            log.info("Using window dimensions: " + JSON.stringify(windowDimensions, null, "  "));
            function configureBrowserWindowSize(windowDimensions) {
                let definitions = [
                    { key: "width", value: windowDimensions.width },
                    { key: "availWidth", value: windowDimensions.width },
                    { key: "height", value: windowDimensions.height },
                    { key: "availHeight", value: windowDimensions.height }
                ];
                definitions.forEach((definition) => {
                    console.log(`Defining ${definition.key} as: ${definition.value}`);
                    try {
                        Object.defineProperty(window.screen, definition.key, {
                            get: function () {
                                return definition.value;
                            }
                        });
                    }
                    catch (e) {
                        console.warn(`Unable to define ${definition.key}`, e);
                    }
                });
            }
            let screenDimensionScript = Functions.functionToScript(configureBrowserWindowSize, windowDimensions);
            yield window.webContents.executeJavaScript(screenDimensionScript);
        });
    }
    __calculateWindowDimensions(window) {
        let size = window.getSize();
        return new Dimensions({
            width: size[0],
            height: size[1]
        });
    }
}
exports.Capture = Capture;
//# sourceMappingURL=Capture.js.map