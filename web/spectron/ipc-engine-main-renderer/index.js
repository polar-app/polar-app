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
const SpectronMain2_1 = require("../../js/test/SpectronMain2");
const electron_1 = require("electron");
SpectronMain2_1.SpectronMain2.create().run((state) => __awaiter(this, void 0, void 0, function* () {
    let primaryWindow = state.window;
    let secondaryWindow = state.window;
    primaryWindow.loadFile(__dirname + '/app.html');
    secondaryWindow.loadFile(__dirname + '/app.html');
    electron_1.ipcMain.on('what-is-your-name', (event, message) => {
        console.log("Received event and message: ", { event, message });
        event.sender.send('and-what-is-your-name', 'my name is ipcRenderer');
    });
    electron_1.ipcMain.on('oh-my-name-is', (event, message) => {
        console.log("Received event and message: ", { event, message });
    });
    yield state.testResultWriter.write(true);
}));
//# sourceMappingURL=index.js.map