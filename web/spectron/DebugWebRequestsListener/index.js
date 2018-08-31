"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const SpectronMain_1 = require("../../js/test/SpectronMain");
const WebRequestReactor_1 = require("../../js/webrequests/WebRequestReactor");
const DebugWebRequestsListener_1 = require("../../js/webrequests/DebugWebRequestsListener");
const LoggerDelegate_1 = require("../../js/logger/LoggerDelegate");
const MemoryLogger_1 = require("../../js/logger/MemoryLogger");
const assert_1 = __importDefault(require("assert"));
let log = new MemoryLogger_1.MemoryLogger();
LoggerDelegate_1.LoggerDelegate.set(log);
function createMainWindow() {
    return __awaiter(this, void 0, void 0, function* () {
        let mainWindow = new electron_1.BrowserWindow();
        let webRequestReactor = new WebRequestReactor_1.WebRequestReactor(mainWindow.webContents.session.webRequest);
        webRequestReactor.start();
        let debugWebRequestsListener = new DebugWebRequestsListener_1.DebugWebRequestsListener();
        debugWebRequestsListener.register(webRequestReactor);
        mainWindow.loadURL('http://httpbin.org/get');
        return mainWindow;
    });
}
SpectronMain_1.SpectronMain.run((state) => __awaiter(this, void 0, void 0, function* () {
    state.window.loadFile(__dirname + '/app.html');
    let output = log.toJSON();
    console.log("log output =========");
    console.log(output);
    console.log("DONE log output =========");
    assert_1.default.ok(output.indexOf("onBeforeRequest") !== -1);
    yield state.testResultWriter.write(true);
}), { windowFactory: createMainWindow });
//# sourceMappingURL=index.js.map