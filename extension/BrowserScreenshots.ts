import {webextensions} from './WebExtensions';
import {Result} from '../web/js/util/Result';
import {BrowserScreenshot} from './BrowserScreenshotHandler';
import {ILTRect} from '../web/js/util/rects/ILTRect';
import {Results} from '../web/js/util/Results';

export class BrowserScreenshots {

    public static async capture(rect: ILTRect): Promise<BrowserScreenshot | undefined> {

        if (chrome && chrome.runtime && chrome.runtime.sendMessage) {

            const request = {
                type: 'browser-screenshot',
                rect
            };

            const response = await webextensions.Messaging.sendMessage(request);

            if (! response) {
                throw new Error("No response from web extension");
            }

            const result: Result<BrowserScreenshot> = Results.create(response);

            return result.get();

        } else {
            throw new Error("No exception support");
        }

    }

}
