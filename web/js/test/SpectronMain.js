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
exports.SpectronMainState = exports.SpectronMain = void 0;
const electron_1 = require("electron");
const MainTestResultWriter_1 = require("./results/writer/MainTestResultWriter");
const SpectronBrowserWindowOptions_1 = require("./SpectronBrowserWindowOptions");
class SpectronMain {
    static setup(options) {
        return new Promise(resolve => {
            console.log("Electron app started. Waiting for it to be ready.");
            electron_1.app.on('ready', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log("Ready!  Creating main window!!");
                    let windowFactory = () => __awaiter(this, void 0, void 0, function* () {
                        const result = new electron_1.BrowserWindow(SpectronBrowserWindowOptions_1.SpectronBrowserWindowOptions.create());
                        yield result.loadURL('about:blank');
                        return result;
                    });
                    if (options && options.windowFactory) {
                        windowFactory = options.windowFactory;
                    }
                    const mainWindow = yield windowFactory();
                    console.log("Done.. resolving");
                    resolve(mainWindow);
                });
            });
        });
    }
    static start(callback, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const window = yield SpectronMain.setup(options);
            const testResultWriter = new MainTestResultWriter_1.MainTestResultWriter(window);
            return callback(new SpectronMainState(window, testResultWriter));
        });
    }
    static run(callback, options) {
        SpectronMain.start(callback, options)
            .catch(err => console.log("Caught error running spectron: ", err));
    }
}
exports.SpectronMain = SpectronMain;
class SpectronMainState {
    constructor(window, testResultWriter) {
        this.window = window;
        this.testResultWriter = testResultWriter;
    }
}
exports.SpectronMainState = SpectronMainState;
//# sourceMappingURL=SpectronMain.js.map