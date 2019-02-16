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
 *
 * It also makes it more portable to the web since this code just uses
 * postMessage which is supported everywhere.
 */
export class Messenger {

    public static async postMessage(postMessageRequest: PostMessageRequest) {

        postMessageRequest = new PostMessageRequest(postMessageRequest);

        if (window) {
            await this.postMessageDirectly(postMessageRequest.message);
            return;
        }

        let targetBrowserWindow = postMessageRequest.window;

        if (! isPresent(targetBrowserWindow)) {
            targetBrowserWindow = BrowserWindow.getFocusedWindow();
        }

        if (! isPresent(targetBrowserWindow)) {
            throw new Error("No target browser window found");
        }

        await this.postMessageWithElectronBrowserWindow(postMessageRequest.message, targetBrowserWindow!);

    }

    /**
     * We're in the browers so we can just call the postMessage function directly.
     */
    public static async postMessageDirectly(message: any) {
        window.postMessage(message, "*");
    }

    public static async postMessageWithElectronBrowserWindow(message: any, browserWindow: BrowserWindow) {

        function postMessageFunction(msg: any) {
            window.postMessage(msg, "*");
        }

        const script = Functions.functionToScript(postMessageFunction, message);

        await browserWindow.webContents.executeJavaScript(script);

    }

}
