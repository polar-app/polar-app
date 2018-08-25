import {IPCHandler} from '../ipc/handler/IPCHandler';
import {ScreenshotRequest} from './ScreenshotRequest';
import {IPCMessage} from '../ipc/handler/IPCMessage';
import {IPCEvent} from '../ipc/handler/IPCEvent';
import {Screenshot} from './Screenshot';
import {BrowserWindow, WebContents} from "electron";
import {Logger} from '../logger/Logger';

const log = Logger.create();

export class ScreenshotHandler extends IPCHandler<ScreenshotRequest> {

    protected createValue(ipcMessage: IPCMessage<any>): ScreenshotRequest {
        return ipcMessage.value;
    }

    protected async handleIPC(event: IPCEvent, screenshotRequest: ScreenshotRequest): Promise<Screenshot> {

        let webContents = event.webContents;

        if(webContents === undefined) {
            throw new Error("Must be sent called from a renderer.");
        }

        console.log("FIXME: capturing from web contents: " + webContents.getURL() );

        let image = await ScreenshotHandler.capture(webContents, screenshotRequest);

        let dataURL = image.toDataURL();
        let size = image.getSize();

        let screenshot: Screenshot = {
            dataURL,
            dimensions: {
                width: size.width,
                height: size.height
            }
        };

        return screenshot;

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
    static async capture(webContents: WebContents, screenshotRequest: ScreenshotRequest): Promise<Electron.NativeImage>   {

        if(! screenshotRequest) {
            throw new Error("screenshotRequest required");
        }

        let rect: Electron.Rectangle = screenshotRequest.rect;

        if(! rect) {
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
                resolve(image);
            })

        })

    }

}
