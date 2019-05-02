import {webextensions} from './WebExtensions';
import {Result} from '../web/js/util/Result';
import {BrowserScreenshot} from './BrowserScreenshotHandler';
import {ILTRect} from '../web/js/util/rects/ILTRect';
import {Results} from '../web/js/util/Results';
import {Canvases} from '../web/js/util/Canvases';

export class BrowserScreenshots {

    public static async capture(rect: ILTRect, element: HTMLElement): Promise<BrowserScreenshot | undefined> {

        const {width, height} = rect;

        const boundingClientRect = element.getBoundingClientRect();

        // update the rect to reflect the element not the iframe position.
        rect = {
            left: boundingClientRect.left,
            top: boundingClientRect.top,
            width, height
        };

        if (chrome && chrome.runtime && chrome.runtime.sendMessage) {

            const captureWithRemoteCrop = async () => {

                const request = {
                    type: 'browser-screenshot',
                    rect
                };

                const response: BrowserScreenshot
                    = await webextensions.Messaging.sendMessage(request);

                if (! response) {
                    throw new Error("No response from web extension");
                }

                const result: Result<BrowserScreenshot> = Results.create(response);

                return result.get();

            };

            const captureWithLocalCrop = async () => {

                try {

                    console.log("FIXME: doing local crop");

                    const request = {
                        type: 'browser-screenshot',
                    };

                    const response: BrowserScreenshot
                        = await webextensions.Messaging.sendMessage(request);

                    console.log("FIXME: got response: ", response);

                    if (!response) {
                        throw new Error("No response from web extension");
                    }

                    const result: Result<BrowserScreenshot> = Results.create(response);

                    console.log("FIXME: got result: ", result);

                    const uncropped = result.get();

                    console.log("FIXME: got uncropped: ", uncropped);

                    const croppedImage
                        = await Canvases.crop(uncropped.dataURL, rect);

                    console.log("FIXME: FIXME cropped it to: ", croppedImage);

                    return {
                        type: uncropped.type,
                        dataURL: croppedImage
                    };
                } catch (e) {
                    console.error("FIXME caught an error: ", e);
                    throw e;
                }

            };

            return await captureWithLocalCrop();

        } else {
            throw new Error("No web extension support");
        }

    }

}
