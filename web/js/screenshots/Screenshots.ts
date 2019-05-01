import {CaptureTarget} from './electron/ElectronScreenshots';
import {ElectronScreenshots} from './electron/ElectronScreenshots';
import {DocFormatFactory} from '../docformat/DocFormatFactory';
import {ILTRect} from '../util/rects/ILTRect';
import {Buffers} from '../util/Buffers';
import {Canvases} from '../util/Canvases';
import {ExtractedImage} from './Screenshot';
import {Logger} from '../logger/Logger';

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
                                element: HTMLElement): Promise<ExtractedImage> {

        const docFormat = DocFormatFactory.getInstance();

        switch (docFormat.name) {

            case 'pdf':
                return this.captureViaCanvas(pageNum, boxRect);

            case 'html':
                return this.captureViaElectron(boxRect, element);

        }

    }

    // FIXME: I need to think about whether I want to compute the bounding rect
    // myself which would make things much easier but then I have to do the math
    // directly.

    private static async captureViaElectron(rect: ILTRect, element: HTMLElement): Promise<ExtractedImage>  {

        log.debug("Capturing via electron");

        const {width, height} = rect;

        const boundingClientRect = element.getBoundingClientRect();

        const target: CaptureTarget = {
            x: boundingClientRect.left,
            y: boundingClientRect.top,
            width, height
        };

        const capturedScreenshot = await ElectronScreenshots.capture(target, {type: 'png'});

        const buffer = <Buffer> capturedScreenshot.data;
        const data = Buffers.toArrayBuffer(buffer);

        return {data, type: 'image/png', width, height};

    }

    private static async captureViaCanvas(pageNum: number, rect: ILTRect): Promise<ExtractedImage> {

        const docFormat = DocFormatFactory.getInstance();

        log.debug(`Capturing via canvas with docFormat: ${docFormat.name} for page ${pageNum}`);

        const canvas = await docFormat.getCanvas(pageNum);

        return await Canvases.extract(canvas, rect);

    }

}
