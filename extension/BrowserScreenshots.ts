import {webextensions} from './WebExtensions';
import {Result} from '../web/js/util/Result';
import {BrowserScreenshot} from './BrowserScreenshotHandler';

export class BrowserScreenshots {

    public static async capture(): Promise<BrowserScreenshot | undefined> {

        if (chrome && chrome.runtime && chrome.runtime.sendMessage) {

            const result: Result<BrowserScreenshot>
                = await webextensions.Messaging.sendMessage({});

            if (result.hasValue()) {
                return result.get();
            } else {
                throw result.err;
            }

        } else {
            throw new Error("No exception support");
        }

    }

}
