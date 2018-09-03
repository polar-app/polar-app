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
const PostMessageRequest_1 = require("./PostMessageRequest");
const Functions_1 = require("../../util/Functions");
const Preconditions_1 = require("../../Preconditions");
class Messenger {
    postMessage(postMessageRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            postMessageRequest = new PostMessageRequest_1.PostMessageRequest(postMessageRequest);
            function postMessageFunction(message) {
                window.postMessage(message, "*");
            }
            let script = Functions_1.Functions.functionToScript(postMessageFunction, postMessageRequest.message);
            let targetBrowserWindow = postMessageRequest.window;
            if (!Preconditions_1.isPresent(targetBrowserWindow)) {
                targetBrowserWindow = electron_1.BrowserWindow.getFocusedWindow();
            }
            if (!Preconditions_1.isPresent(targetBrowserWindow)) {
                throw new Error("No target browser window found");
            }
            yield targetBrowserWindow.webContents.executeJavaScript(script);
        });
    }
}
exports.Messenger = Messenger;
//# sourceMappingURL=Messenger.js.map