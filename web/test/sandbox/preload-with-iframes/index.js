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
exports.BROWSER_OPTIONS = void 0;
const electron_1 = require("electron");
const SpectronMain_1 = require("../../../js/test/SpectronMain");
exports.BROWSER_OPTIONS = {
    backgroundColor: '#FFF',
    webPreferences: {
        webSecurity: false,
        preload: "/home/burton/projects/polar-bookshelf/test/sandbox/preload-with-iframes/preload.js"
    }
};
let windowFactory = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Creating custom window.");
    let mainWindow = new electron_1.BrowserWindow(exports.BROWSER_OPTIONS);
    mainWindow.loadURL('about:blank');
    return mainWindow;
});
SpectronMain_1.SpectronMain.run((state) => __awaiter(void 0, void 0, void 0, function* () {
    state.window.loadFile(__dirname + '/app.html');
    yield state.testResultWriter.write(true);
}), { windowFactory });
//# sourceMappingURL=index.js.map