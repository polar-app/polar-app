const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

const {PostMessageRequest} = require("./PostMessageRequest");
const {Functions} = require("../../util/Functions");

/**
 * Messenger is a class for using postMessage within the renderer to communicate
 * with apps using web standards, and not Electron IPC. This makes our code
 * more testable via simple mocha / node and doesn't require Spectron which
 * is more heavy and slower for testing.
 */
class Messenger {

    async postMessage(postMessageRequest) {

        postMessageRequest = new PostMessageRequest(postMessageRequest);

        function postMessageFunction(message) {
            window.postMessage(message, "*");
        }

        let script = Functions.functionToScript(postMessageFunction, postMessageRequest.message);

        let window = postMessageRequest.window;

        if(! window) {
            window = BrowserWindow.getFocusedWindow();
        }

        await window.webContents.executeJavaScript(script);

    }

}

module.exports.Messenger = Messenger;
