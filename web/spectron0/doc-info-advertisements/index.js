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
const SpectronMain2_1 = require("../../js/test/SpectronMain2");
const electron_1 = require("electron");
const DocInfoBroadcasterService_1 = require("../../js/datastore/advertiser/DocInfoBroadcasterService");
const BROWSER_OPTIONS = {
    backgroundColor: '#FFF',
    webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
    }
};
SpectronMain2_1.SpectronMain2.create().run((state) => __awaiter(void 0, void 0, void 0, function* () {
    const mainWindow = new electron_1.BrowserWindow(BROWSER_OPTIONS);
    yield state.window.loadURL(`file://${__dirname}/receiving-app.html`);
    yield new DocInfoBroadcasterService_1.DocInfoBroadcasterService().start();
    yield mainWindow.loadURL(`file://${__dirname}/sending-app.html`);
}));
//# sourceMappingURL=index.js.map