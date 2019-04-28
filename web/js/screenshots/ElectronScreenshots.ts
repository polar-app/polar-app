import {IXYRect} from '../util/rects/IXYRect';
import {IXYRects} from '../util/rects/IXYRects';
import {CapturedScreenshot, CaptureOpts} from './CapturedScreenshot';
import {ScreenshotRequest} from './CapturedScreenshot';
import {DefaultCaptureOpts} from './CapturedScreenshot';
import {ClientRects} from '../util/rects/ClientRects';
import {Logger} from '../logger/Logger';
import {IScreenshotDelegate, ScreenshotDelegate, WebContentsID} from './ScreenshotDelegate';
import {remote} from 'electron';
import {AppRuntime} from '../AppRuntime';
import {Promises} from '../util/Promises';

const log = Logger.create();

/**
 * Create a screenshot of the display directly using Electron.
 *
 * @ElectronRendererContext
 */
export class ElectronScreenshots {

    public static supported(): boolean {
        return AppRuntime.isElectron();
    }

    /**
     * Create a screenshot and return a NativeImage of the result.
     *
     * https://github.com/electron/electron/blob/master/docs/api/native-image.md
     *
     * @param target Specify either rect or element to capture as properties.
     *
     * @param opts The options to specify when capturing.
     *
     * @return {Promise} for {NativeImage}. You can call toDataURL on the image
     *         with scaleFactor as an option.
     *
     */
    public static async capture(target: CaptureTarget,
                                opts: CaptureOpts = new DefaultCaptureOpts()): Promise<CapturedScreenshot> {

        if ( ! this.supported()) {
            throw new Error("Captured screenshots not supported");
        }

        const screenshotRequest = await this.doCapture(target, opts);

        log.info("Sending screenshot request: ", screenshotRequest);

        // const id: WebContentsID = webContents.id;

        const id = this.getWebContentsID();

        // NOTE: it takes about 20ms for the main process to capture the data
        // another 30ms to send it to the renderer.  Half the main process time
        // is taken capturing the image and the other time is spent converting
        // it to a PNG.
        //
        // TODO: I could shave 20ms by converting the image to PNG within the
        // renderer after the animations are restored but that's not really
        // too impressive.
        //
        // TODO: even a 50ms flash is kind of annoying but not the end of the
        // world.

        const annotationToggler = new AnnotationToggler();

        await Promises.requestAnimationFrame(() => annotationToggler.hide());
        await Promises.waitFor(1000 / 60); // FIXME: this works at least on my machine but would be nice to make it faster

        // FIXME: this bug must/could be that the renderer has updated BUT the
        // display has not yet updated

        const capturedScreenshot
            = await this.getRemoteDelegate().capture(id, screenshotRequest);

        // FIXME: if we write it to a file, and the FILE (which would be written
        // from the main process) has the overlay then we know that the overlay
        // isn't being removed.

        await Promises.requestAnimationFrame(() => annotationToggler.show());

        return capturedScreenshot;

    }

    public static async captureToFile(target: CaptureTarget,
                                      dest: string,
                                      opts: CaptureOpts): Promise<void> {

        // TODO: the idea here is that we could directly write to the datastore
        // from within the main process

        // noop for now

    }

    private static getRemoteDelegate(): IScreenshotDelegate {
        return remote.getGlobal(ScreenshotDelegate.DELEGATE_NAME);
    }

    private static getWebContentsID(): WebContentsID {
        return remote.getCurrentWebContents().id;
    }

    private static async doCapture(target: CaptureTarget, opts: CaptureOpts): Promise<ScreenshotRequest> {

        let rect: IXYRect;

        if (target instanceof HTMLElement) {

            log.info("Using HTML element to build rect from bounding client rect.");

            rect = IXYRects.createFromClientRect(target.getBoundingClientRect());

        } else if (ClientRects.instanceOf(target)) {

            rect = {
                x: target.left,
                y: target.top,
                width: target.width,
                height: target.height
            };

            log.info("Using client rect: ", rect);

        } else if (IXYRects.instanceOf(target)) {
            log.info("Using IXYRect");
            rect = target;
        } else {
            throw new Error("Unknown target type.");
        }

        const screenshotRequest: ScreenshotRequest = {
            rect,
            resize: opts.resize,
            crop: opts.crop,
            type: opts.type
        };

        return screenshotRequest;

    }
    //
    // public static toScreenshot(capturedScreenshot: CapturedScreenshot): Screenshot {
    //
    //     return Screenshots.create(capturedScreenshot.data, {
    //         width: capturedScreenshot.dimensions.width,
    //         height: capturedScreenshot.dimensions.height,
    //         type: ImageTypes.PNG
    //     });
    //
    // }

}

export type CaptureTarget = IXYRect | HTMLElement | ClientRect;

export class Annotations {

    private static SELECTOR = ".page .pagemark, .page .text-highlight, .page .area-highlight";

    private static getAnnotationElements(): ReadonlyArray<HTMLElement> {
        return Array.from(document.querySelectorAll(this.SELECTOR));
    }

    public static hide() {

        for (const element of this.getAnnotationElements()) {
            element.style.visibility = 'hidden';
            const cs = getComputedStyle(element); // FIXME: remove
            console.log("FIXME: vis is " + cs.visibility);
        }

    }

    public static show() {

        for (const element of this.getAnnotationElements()) {
            element.style.visibility = 'visible';
        }
    }

}

export interface StyleRestore {
    readonly visibility: string | null;
}

export interface AnnotationStyle {
    readonly element: HTMLElement;
    readonly styleRestore: StyleRestore;
}

export class AnnotationToggler {

    private SELECTOR = ".page .pagemark, .page .text-highlight, .page .area-highlight";

    private annotationStyles: AnnotationStyle[] = [];

    private getAnnotationElements(): ReadonlyArray<HTMLElement> {
        return Array.from(document.querySelectorAll(this.SELECTOR));
    }

    public hide() {

        for (const annotationElement of this.getAnnotationElements()) {

            const styleRestore: StyleRestore = {
                visibility: annotationElement.style.visibility
            };

            annotationElement.style.visibility = 'hidden';

            this.annotationStyles.push({element: annotationElement, styleRestore});

        }

    }

    public show() {

        for (const annotationStyle of this.annotationStyles) {

            annotationStyle.element.style.visibility =
                annotationStyle.styleRestore.visibility;

        }

    }

}

