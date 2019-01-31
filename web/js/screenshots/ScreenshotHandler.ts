import {IPCHandler} from '../ipc/handler/IPCHandler';
import {ScreenshotRequest} from './ScreenshotRequest';
import {IPCMessage} from '../ipc/handler/IPCMessage';
import {IPCEvent} from '../ipc/handler/IPCEvent';
import {CapturedScreenshot} from './CapturedScreenshot';
import {WebContents} from "electron";
import {Logger} from '../logger/Logger';

const log = Logger.create();

export class ScreenshotHandler extends IPCHandler<ScreenshotRequest> {

    protected createValue(ipcMessage: IPCMessage<any>): ScreenshotRequest {
        return ipcMessage.value;
    }

    protected async handleIPC(event: IPCEvent, screenshotRequest: ScreenshotRequest): Promise<CapturedScreenshot> {

        const webContents = event.webContents;

        if (webContents === undefined) {
            throw new Error("Must be sent called from a renderer.");
        }

        const image = await ScreenshotHandler.capture(webContents, screenshotRequest);

        const dataURL = image.toDataURL();
        const size = image.getSize();

        const capturedScreenshot: CapturedScreenshot = {
            dataURL,
            dimensions: {
                width: size.width,
                height: size.height
            }
        };

        return capturedScreenshot;

    }

    /**
     * Create a screenshot and return a NativeImage of the result.
     *
     * https://github.com/electron/electron/blob/master/docs/api/native-image.md
     *
     * @param webContents the rect of the screen where to take the screenshot.
     * @param screenshotRequest The rect data for where to capture on the page.
     * @return {Promise} for {NativeImage}. You can call toDateURL on the image
     *         with scaleFactor as an option.
     *
     */
    public static async capture(webContents: WebContents, screenshotRequest: ScreenshotRequest): Promise<Electron.NativeImage> {

        if (! screenshotRequest) {
            throw new Error("screenshotRequest required");
        }

        let rect: Electron.Rectangle = screenshotRequest.rect;

        if (! rect) {
            throw new Error("No rect");
        }

        // this is a workaround for capturing the image.  The numbers are
        // sometimes floating point and I assume Electron native functions don't
        // like this.
        rect = {
            x: Math.round(screenshotRequest.rect.x),
            y: Math.round(screenshotRequest.rect.y),
            width: Math.round(screenshotRequest.rect.width),
            height: Math.round(screenshotRequest.rect.height)
        };

        return new Promise<Electron.NativeImage>((resolve) => {

            webContents.capturePage(rect, (image) => {

                if (screenshotRequest.resize) {

                    if (screenshotRequest.resize.width !== undefined ||
                        screenshotRequest.resize.height !== undefined) {

                        log.info("Resizing image to: ", screenshotRequest.resize);

                        image = image.resize(screenshotRequest.resize);

                    }

                }

                if (screenshotRequest.crop) {
                    log.info("Cropping image to: ", screenshotRequest.resize);

                    image = image.resize(screenshotRequest.crop);
                }

                resolve(image);

            });

        });

    }

}
