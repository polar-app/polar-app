import {
    CaptureTarget,
    ElectronScreenshots
} from './electron/ElectronScreenshots';
import {ILTRect} from 'polar-shared/src/util/rects/ILTRect';
import {Buffers} from 'polar-shared/src/util/Buffers';
import {Canvases} from 'polar-shared/src/util/Canvases';
import {ICapturedScreenshot} from './Screenshot';
import {Logger} from 'polar-shared/src/logger/Logger';
import {BrowserScreenshots} from './browser/BrowserScreenshots';
import {FileType} from '../apps/main/file_loaders/FileType';
import {Preconditions} from "polar-shared/src/Preconditions";

const log = Logger.create();

/**
 * Captures screenshots of a document in the most elegant way possible.
 */
export namespace Screenshots {

    export interface CaptureOpts {
        // The page number that the annotation is attached.
        readonly pageNum: number;

        // The rect within the page of for the box (absolutely positioned as pixels).
        readonly boxRect: ILTRect;

        // The actual HTML element that represents the annotation on screen.
        readonly element?: HTMLElement;

        readonly fileType: FileType;
    }

    /**
     * Capture a screenshot using the right strategy (via PDF canvas or
     * Electron)
     *
     */
    export async function capture(opts: CaptureOpts): Promise<ICapturedScreenshot> {

        const {pageNum, boxRect, element, fileType} = opts;

        Preconditions.assertPresent(fileType, 'fileType');

        const captureDirectly = () => {

            // TODO this isn't really needed anymore as EPUB capture only
            // supports images
            return captureViaBrowser(boxRect, element);

            //
            // if (AppRuntime.isBrowser()) {
            //     return captureViaBrowser(boxRect, element);
            // } else {
            //     return captureViaElectron(boxRect, element);
            // }

        };

        switch (fileType) {

            case 'pdf':
                return captureViaCanvas(pageNum, boxRect);

            case 'epub':
                return captureDirectly();

        }

    }

    // TODO: Computing the bounding rect directly would be a better option here.

    async function captureViaElectron(rect: ILTRect, element?: HTMLElement): Promise<ICapturedScreenshot>  {

        log.debug("Capturing via electron");

        rect = computeCaptureRect(rect, element);

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

    async function captureViaCanvas(pageNum: number,
                                    rect: ILTRect): Promise<ICapturedScreenshot> {

        console.log("Capturing via canvas");

        function getPageElementForPage(pageNum: number) {
            const pages = document.querySelectorAll(".page");
            return pages[pageNum - 1] as HTMLElement;
        }

        function getCanvasForPage(pageNum: number): HTMLCanvasElement {
            // FIXME not portable to multi-tabs in Polar 2.0..

            const pageElement = getPageElementForPage(pageNum);
            const canvas = pageElement.querySelector("canvas") as HTMLCanvasElement;

            if (! canvas) {
                throw new Error("Could not find canvas for page: " + pageNum);
            }

            return canvas;
        }

        const canvas = getCanvasForPage(pageNum);

        return await Canvases.extract(canvas, rect);

    }

    async function captureViaBrowser(boxRect: ILTRect,
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

    export function computeCaptureRect(rect: ILTRect, element?: HTMLElement) {

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
