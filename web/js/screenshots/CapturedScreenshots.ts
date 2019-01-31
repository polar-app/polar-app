import {IXYRect} from '../util/rects/IXYRect';
import {IXYRects} from '../util/rects/IXYRects';
import {CapturedScreenshot, CropDimensions, ResizeDimensions} from './CapturedScreenshot';
import {ScreenshotRequest} from './ScreenshotRequest';
import {ClientRects} from '../util/rects/ClientRects';
import {Logger} from '../logger/Logger';
import {Screenshot} from '../metadata/Screenshot';
import {Screenshots} from '../metadata/Screenshots';
import {ImageType} from '../metadata/ImageType';
import {IScreenshotDelegate, ScreenshotDelegate, WebContentsID} from './ScreenshotDelegate';
import {remote} from 'electron';

const log = Logger.create();

/**
 * Create a screenshot of the display.
 *
 * @ElectronRendererContext
 */
export class CapturedScreenshots {

    /**
     * Create a screenshot and return a NativeImage of the result.
     *
     * https://github.com/electron/electron/blob/master/docs/api/native-image.md
     *
     * @param target Specify either rect or element to capture as properties.
     *
     * @return {Promise} for {NativeImage}. You can call toDataURL on the image
     *         with scaleFactor as an option.
     *
     */
    public static async capture(target: CaptureTarget, opts: CaptureOpts = {}): Promise<CapturedScreenshot> {

        const screenshotRequest = await this.doCapture(target, opts);

        log.info("Sending screenshot request: ", screenshotRequest);

        // const id: WebContentsID = webContents.id;

        const id = this.getWebContentsID();

        return await this.getRemoteDelegate().capture(id, screenshotRequest);

    }

    public static async captureToFile(target: CaptureTarget,
                                      dest: string,
                                      opts: CaptureOpts): Promise<void> {

        // noop for now

    }

    private static getRemoteDelegate(): IScreenshotDelegate {
        return remote.getGlobal(ScreenshotDelegate.DELEGATE_NAME);
    }

    private static getWebContentsID(): WebContentsID {
        return remote.getCurrentWebContents().id;
    }

    private static async doCapture(target: CaptureTarget, opts: CaptureOpts = {}): Promise<ScreenshotRequest> {

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

        const screenshotRequest = <ScreenshotRequest> {
            rect, resize: opts.resize, crop: opts.crop
        };

        return screenshotRequest;

    }

    public static toScreenshot(capturedScreenshot: CapturedScreenshot): Screenshot {

        return Screenshots.create(capturedScreenshot.dataURL, {
            width: capturedScreenshot.dimensions.width,
            height: capturedScreenshot.dimensions.height,
            type: ImageType.PNG
        });

    }

}

export type CaptureTarget = IXYRect | HTMLElement | ClientRect;

export interface CaptureOpts {
    readonly resize?: ResizeDimensions;
    readonly crop?: CropDimensions;
}
