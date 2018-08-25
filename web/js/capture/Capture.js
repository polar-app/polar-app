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
const Logger_1 = require("../logger/Logger");
const Preconditions_1 = require("../Preconditions");
const PendingWebRequestsListener_1 = require("../webrequests/PendingWebRequestsListener");
const DebugWebRequestsListener_1 = require("../webrequests/DebugWebRequestsListener");
const WebRequestReactor_1 = require("../webrequests/WebRequestReactor");
const WebContentsDriver_1 = require("./drivers/WebContentsDriver");
const Strings_1 = require("../util/Strings");
const Optional_1 = require("../util/ts/Optional");
const Results_1 = require("../util/Results");
const Functions_1 = require("../util/Functions");
const Files_1 = require("../util/Files");
const Filenames_1 = require("../util/Filenames");
const CapturedPHZWriter_1 = require("./CapturedPHZWriter");
const { DefaultPagingBrowser } = require("../electron/capture/pagination/DefaultPagingBrowser");
const { PagingLoader } = require("../electron/capture/pagination/PagingLoader");
const log = Logger_1.Logger.create();
const USE_PAGING_LOADER = false;
const EXECUTE_CAPTURE_DELAY = 1500;
class Capture {
    constructor(url, browserProfile, stashDir, captureOpts = { amp: true }) {
        this.webRequestReactors = [];
        this.resolve = () => { };
        this.url = Preconditions_1.Preconditions.assertNotNull(url, "url");
        if (Strings_1.Strings.empty(this.url)) {
            throw new Error("URL may not be empty");
        }
        this.browserProfile = Preconditions_1.Preconditions.assertNotNull(browserProfile, "browser");
        this.stashDir = Preconditions_1.Preconditions.assertNotNull(stashDir, "stashDir");
        this.captureOpts = captureOpts;
        this.pendingWebRequestsListener = new PendingWebRequestsListener_1.PendingWebRequestsListener();
        this.debugWebRequestsListener = new DebugWebRequestsListener_1.DebugWebRequestsListener();
        if (captureOpts.pendingWebRequestsCallback) {
            this.pendingWebRequestsListener.addEventListener(captureOpts.pendingWebRequestsCallback);
        }
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            let driver = yield WebContentsDriver_1.WebContentsDriverFactory.create(this.browserProfile);
            this.driver = driver;
            this.webContents = yield driver.getWebContents();
            this.driver.addEventListener('close', () => {
                this.stop();
            });
            this.onWebRequest(this.webContents.session.webRequest);
            yield this.driver.loadURL(this.url);
            yield this.handleLoad();
            return new Promise(resolve => {
                this.resolve = resolve;
            });
        });
    }
    handleLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            let ampURL = yield this.getAmpURL();
            if (this.captureOpts.amp && ampURL && ampURL !== this.url) {
                log.info("Found AMP URL.  Redirecting then loading: " + ampURL);
                yield this.driver.loadURL(ampURL);
                yield this.handleLoad();
                return;
            }
            setTimeout(() => {
                this.stop();
                this.capture()
                    .catch(err => log.error(err));
            }, 1);
        });
    }
    stop() {
        this.webRequestReactors.forEach(webRequestReactor => {
            log.info("Stopping webRequestReactor...");
            webRequestReactor.stop();
            log.info("Stopping webRequestReactor...done");
        });
    }
    capture() {
        return __awaiter(this, void 0, void 0, function* () {
            if (USE_PAGING_LOADER) {
                let pagingBrowser = new DefaultPagingBrowser(this.webContents);
                let pagingLoader = new PagingLoader(pagingBrowser, () => __awaiter(this, void 0, void 0, function* () {
                    log.info("Paging loader finished.");
                }));
                yield pagingLoader.onLoad();
            }
            yield Functions_1.Functions.waitFor(EXECUTE_CAPTURE_DELAY);
            this.executeContentCapture()
                .catch(err => log.error(err));
        });
    }
    getAmpURL() {
        return __awaiter(this, void 0, void 0, function* () {
            function fetchAmpURL() {
                let link = document.querySelector("link[rel='amphtml']");
                if (link) {
                    return link.href;
                }
                return null;
            }
            return yield this.webContents.executeJavaScript(Functions_1.Functions.functionToScript(fetchAmpURL));
        });
    }
    executeContentCapture() {
        return __awaiter(this, void 0, void 0, function* () {
            let webContents = this.webContents;
            log.info("Capturing the HTML...");
            log.info("Retrieving HTML...");
            let captured;
            try {
                let result = yield webContents.executeJavaScript("ContentCapture.execute()");
                captured = Results_1.Results.create(result).get();
            }
            catch (e) {
                log.error("Could not capture HTML: ", e);
                throw e;
            }
            log.info("Retrieving HTML...done");
            captured.browser = this.browserProfile;
            let stashDir = this.stashDir;
            let filename = Filenames_1.Filenames.sanitize(captured.title);
            let phzPath = `${stashDir}/${filename}.phz`;
            log.info("Writing PHZ to: " + phzPath);
            let capturedPHZWriter = new CapturedPHZWriter_1.CapturedPHZWriter(phzPath);
            yield capturedPHZWriter.convert(captured);
            yield Files_1.Files.writeFileAsync(`/tmp/${filename}.json`, JSON.stringify(captured, null, "  "));
            log.info("Capturing the HTML...done");
            Optional_1.Optional.of(this.driver).when(driver => driver.destroy());
            this.resolve({
                path: phzPath
            });
        });
    }
    onWebRequest(webRequest) {
        let webRequestReactor = new WebRequestReactor_1.WebRequestReactor(webRequest);
        webRequestReactor.start();
        this.webRequestReactors.push(webRequestReactor);
        this.pendingWebRequestsListener.register(webRequestReactor);
    }
}
exports.Capture = Capture;
//# sourceMappingURL=Capture.js.map