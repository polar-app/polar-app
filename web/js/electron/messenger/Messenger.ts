import {BrowserWindow} from 'electron';
import {PostMessageRequest} from './PostMessageRequest';
import {Functions} from '../../util/Functions';
import {isPresent} from '../../Preconditions';
import {Browser} from '../../capture/Browser';


/**
 * Messenger is a class for using postMessage within the renderer to communicate
 * with apps using web standards, and not Electron IPC. This makes our code
 * more testable via simple mocha / node and doesn't require Spectron which
 * is more heavy and slower for testing.
 */
export class Messenger {

    public static async postMessage(postMessageRequest: PostMessageRequest) {

        postMessageRequest = new PostMessageRequest(postMessageRequest);

        let targetBrowserWindow = postMessageRequest.window;

        if (! isPresent(targetBrowserWindow)) {
            targetBrowserWindow = BrowserWindow.getFocusedWindow();
        }

        if (! isPresent(targetBrowserWindow)) {
            throw new Error("No target browser window found");
        }

        await this.postMessageToWindow(postMessageRequest, targetBrowserWindow!);

    }

    public static async postMessageToWindow(message: any, browserWindow: BrowserWindow) {

        function postMessageFunction(msg: any) {
            window.postMessage(msg, "*");
        }

        const script = Functions.functionToScript(postMessageFunction, message);

        await browserWindow.webContents.executeJavaScript(script);

    }

}
