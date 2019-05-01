import {IXYRect} from '../web/js/util/rects/IXYRect';
import {Results} from '../web/js/util/Results';
import {Handlers} from './Handlers';
import {webextensions} from './WebExtensions';

/**
 * Allows us to take screenshots of the current browser within a chrome
 * extension.
 */
export class BrowserScreenshotHandler {

    public static register() {

        chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {

            if (this.isHandled(message)) {

                if (Handlers.isAuthorized(sender)) {

                    const request = <ScreenshotRequest> message;

                    const handleResponse = async () => {
                        const dataURL = await webextensions.Tabs.captureVisibleTab();

                        sendResponse(Results.of(dataURL));

                    };

                    handleResponse()
                        .catch(err => {
                            console.error("Caught error trying to take screenshot: ", err);
                            sendResponse(Results.ofError(err));
                        });



                }

            }

        });

    }

    private static isHandled(message: any) {
        return message && message.type && message.type === 'browser-screenshot';
    }

}

interface ScreenshotRequest {
    readonly rect: IXYRect;
}


export type DataURL = string;
