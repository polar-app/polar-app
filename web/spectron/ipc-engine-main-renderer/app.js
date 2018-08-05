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
const electron_1 = require("electron");
const SpectronRenderer_1 = require("../../js/test/SpectronRenderer");
SpectronRenderer_1.SpectronRenderer.run(() => __awaiter(this, void 0, void 0, function* () {
    console.log("Running within SpectronRenderer now.");
    electron_1.ipcRenderer.on('hello', (event, message) => {
        console.log("Received event and message: ", { event, message });
        event.sender.send('what-is-your-name', 'this is a response message from ipcMain');
    });
    electron_1.ipcRenderer.on('and-what-is-your-name', (event, message) => {
        console.log("Received event and message: ", { event, message });
        event.sender.send('oh-my-name-is', 'oh, yeah. my name is ipcMain');
    });
}));
//# sourceMappingURL=app.js.map