"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpectronMainOptions = exports.SpectronMainState = exports.SpectronMain2 = void 0;
const electron_1 = require("electron");
const MainTestResultWriter_1 = require("./results/writer/MainTestResultWriter");
const Logger_1 = require("polar-shared/src/logger/Logger");
const SpectronBrowserWindowOptions_1 = require("./SpectronBrowserWindowOptions");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const log = Logger_1.Logger.create();
class SpectronMain2 {
    constructor(options) {
        this.options = options;
    }
    createWindow() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.options.windowFactory();
        });
    }
    setup() {
        Preconditions_1.Preconditions.assertPresent(electron_1.app, "No app");
        return new Promise(resolve => {
            electron_1.app.on('ready', () => __awaiter(this, void 0, void 0, function* () {
                log.info("Ready!  Creating main window!!");
                const mainWindow = yield this.options.windowFactory();
                log.info("Done.. resolving");
                resolve(mainWindow);
            }));
        });
    }
    start(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const window = yield this.setup();
            const testResultWriter = new MainTestResultWriter_1.MainTestResultWriter(window);
            return callback(new SpectronMainState(this, window, testResultWriter));
        });
    }
    run(callback) {
        this.start(callback)
            .catch(err => log.error("Could not run spectron:", err));
    }
    static create(options = new SpectronMainOptions().build()) {
        return new SpectronMain2(options);
    }
}
exports.SpectronMain2 = SpectronMain2;
function defaultWindowFactory() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = SpectronBrowserWindowOptions_1.SpectronBrowserWindowOptions.create();
        console.log("Creating window with options: ", options);
        const mainWindow = new electron_1.BrowserWindow(options);
        yield mainWindow.loadURL('about:blank');
        return mainWindow;
    });
}
class SpectronMainState {
    constructor(spectronMain, window, testResultWriter) {
        this.spectronMain = spectronMain;
        this.window = window;
        this.testResultWriter = testResultWriter;
    }
    createWindow() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.spectronMain.createWindow();
        });
    }
}
exports.SpectronMainState = SpectronMainState;
class SpectronMainOptions {
    constructor() {
        this.windowFactory = defaultWindowFactory;
        this.enableDevTools = false;
    }
    build() {
        return Object.freeze(this);
    }
}
exports.SpectronMainOptions = SpectronMainOptions;
//# sourceMappingURL=SpectronMain2.js.map