import {BrowserWindow}  from 'electron';
import {PostMessageRequest} from './PostMessageRequest';
import {Functions} from '../../util/Functions';
import {isPresent} from '../../Preconditions';


/**
 * Messenger is a class for using postMessage within the renderer to communicate
 * with apps using web standards, and not Electron IPC. This makes our code
 * more testable via simple mocha / node and doesn't require Spectron which
 * is more heavy and slower for testing.
 */
export class Messenger {

    async postMessage(postMessageRequest: PostMessageRequest) {

        postMessageRequest = new PostMessageRequest(postMessageRequest);

        function postMessageFunction(message: any) {
            window.postMessage(message, "*");
        }

        let script = Functions.functionToScript(postMessageFunction, postMessageRequest.message);

        let targetBrowserWindow = postMessageRequest.window;

        if(! isPresent(targetBrowserWindow)) {
            targetBrowserWindow = BrowserWindow.getFocusedWindow();
        }

        if(! isPresent(targetBrowserWindow)) {
            throw new Error("No target browser window found");
        }

        await targetBrowserWindow!.webContents.executeJavaScript(script);

    }

}
