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
exports.Messenger = void 0;
const electron_1 = require("electron");
const PostMessageRequest_1 = require("./PostMessageRequest");
const Functions_1 = require("polar-shared/src/util/Functions");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class Messenger {
    static postMessage(postMessageRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            postMessageRequest = new PostMessageRequest_1.PostMessageRequest(postMessageRequest);
            if (typeof window !== 'undefined') {
                yield this.postMessageDirectly(postMessageRequest.message);
                return;
            }
            let targetBrowserWindow = postMessageRequest.window;
            if (!Preconditions_1.isPresent(targetBrowserWindow)) {
                targetBrowserWindow = electron_1.BrowserWindow.getFocusedWindow();
            }
            if (!Preconditions_1.isPresent(targetBrowserWindow)) {
                throw new Error("No target browser window found");
            }
            yield this.postMessageWithElectronBrowserWindow(postMessageRequest.message, targetBrowserWindow);
        });
    }
    static postMessageDirectly(message) {
        return __awaiter(this, void 0, void 0, function* () {
            message = JSON.parse(JSON.stringify(message));
            window.postMessage(message, "*");
        });
    }
    static postMessageWithElectronBrowserWindow(message, browserWindow) {
        return __awaiter(this, void 0, void 0, function* () {
            function postMessageFunction(msg) {
                window.postMessage(msg, "*");
            }
            const script = Functions_1.Functions.functionToScript(postMessageFunction, message);
            yield browserWindow.webContents.executeJavaScript(script);
        });
    }
}
exports.Messenger = Messenger;
//# sourceMappingURL=Messenger.js.map