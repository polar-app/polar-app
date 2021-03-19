import {ILTRect} from 'polar-shared/src/util/rects/ILTRect';
import {Canvases} from 'polar-shared/src/util/Canvases';
import {ICapturedScreenshot} from './Screenshot';
import {BrowserScreenshots} from './browser/BrowserScreenshots';
import {FileType} from '../apps/main/file_loaders/FileType';
import {Preconditions} from "polar-shared/src/Preconditions";


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

        readonly docViewerElement: HTMLElement;

    }

    /**
     * Capture a screenshot using the right strategy (via PDF canvas or
     * Electron)
     *
     */
    export async function capture(opts: CaptureOpts): Promise<ICapturedScreenshot> {

        const {pageNum, boxRect, element, fileType, docViewerElement} = opts;

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
                return captureViaCanvas(pageNum, boxRect, docViewerElement);

            case 'epub':
                return captureDirectly();

        }

    }

    async function captureViaCanvas(pageNum: number,
                                    rect: ILTRect,
                                    docViewerElement: HTMLElement): Promise<ICapturedScreenshot> {

        console.log("Capturing via canvas");

        function getPageElementForPage(pageNum: number) {
            const pages = docViewerElement.querySelectorAll(".page");
            return pages[pageNum - 1] as HTMLElement;
        }

        function getCanvasForPage(pageNum: number): HTMLCanvasElement {

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
