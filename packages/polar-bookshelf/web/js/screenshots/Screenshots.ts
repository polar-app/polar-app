import {CaptureTarget} from './electron/ElectronScreenshots';
import {ElectronScreenshots} from './electron/ElectronScreenshots';
import {DocFormatFactory} from '../docformat/DocFormatFactory';
import {ILTRect} from 'polar-shared/src/util/rects/ILTRect';
import {Buffers} from 'polar-shared/src/util/Buffers';
import {Canvases} from 'polar-shared/src/util/Canvases';
import {ICapturedScreenshot} from './Screenshot';
import {Logger} from 'polar-shared/src/logger/Logger';
import {AppRuntime} from '../AppRuntime';
import {BrowserScreenshots} from './browser/BrowserScreenshots';

const log = Logger.create();

/**
 * Captures screenshots of a document in the most elegant way possible.
 */
export class Screenshots {

    /**
     * Capture a screenshot using the right strategy (via PDF canvas or
     * Electron)
     *
     * @param pageNum The page number that the annotation is attached.
     * @param boxRect The rect within the page of for the box (absolutely positioned as pixels).
     * @param element The actual HTML element that represents the annotation on screen.
     */
    public static async capture(pageNum: number,
                                boxRect: ILTRect,
                                element?: HTMLElement): Promise<ICapturedScreenshot> {

        const docFormat = DocFormatFactory.getInstance();

        const captureDirectly = () => {
            if (AppRuntime.isBrowser()) {
                return this.captureViaBrowser(boxRect, element);
            } else {
                return this.captureViaElectron(boxRect, element);
            }
        };

        switch (docFormat.name) {

            case 'pdf':
                return this.captureViaCanvas(pageNum, boxRect);

            case 'html':
                return captureDirectly();

            case 'epub':
                return captureDirectly();

        }

    }

    // TODO: Computing the bounding rect directly would be a better option here.

    private static async captureViaElectron(rect: ILTRect, element?: HTMLElement): Promise<ICapturedScreenshot>  {

        log.debug("Capturing via electron");

        rect = Screenshots.computeCaptureRect(rect, element);

        const {width, height} = rect;

        const target: CaptureTarget = {
            x: rect.left,
            y: rect.top,
            width,
            height
        };

        const capturedScreenshot = await ElectronScreenshots.capture(target, {type: 'png'});

        const buffer = <Buffer> capturedScreenshot.data;
        const data = Buffers.toArrayBuffer(buffer);

        return {data, type: 'image/png', width, height};

    }

    private static async captureViaCanvas(pageNum: number,
                                          rect: ILTRect): Promise<ICapturedScreenshot> {

        const docFormat = DocFormatFactory.getInstance();

        log.debug(`Capturing via canvas with docFormat: ${docFormat.name} for page ${pageNum}`);

        const canvas = await docFormat.getCanvas(pageNum);

        return await Canvases.extract(canvas, rect);

    }

    private static async captureViaBrowser(boxRect: ILTRect,
                                           element?: HTMLElement) {

        // we have to capture via our extension
        const browserScreenshot = await BrowserScreenshots.capture(boxRect, element);

        if (browserScreenshot) {

            return {
                data: browserScreenshot.dataURL,
                type: browserScreenshot.type,
                width: boxRect.width,
                height: boxRect.height
            };

        } else {
            throw new Error("Unable to take screenshot via browser");
        }

    }

    public static computeCaptureRect(rect: ILTRect, element?: HTMLElement) {

        if (element) {
            const {width, height} = rect;

            const boundingClientRect = element.getBoundingClientRect();

            // update the rect to reflect the element not the iframe position.
            return {
                left: boundingClientRect.left,
                top: boundingClientRect.top,
                width, height
            };

        }

        return rect;

    }

}
