import {ipcMain, BrowserWindow, WebContents} from 'electron';
import {ScreenshotRequest} from './ScreenshotRequest';
import {Screenshot} from './Screenshot';

/**
 * Service that runs in the Electron main context which listens to IPC events
 * and performs screenshots on windows when requested.
 *
 * The ScreenshotsService must be started in the main process or messages will
 * never be returned.
 *
 * @ElectronMainContext - Must be run from the electron main context.
 */
export class ScreenshotService {

    constructor() {
    }

    start() {

        // add an IPC listener for screenshot requests that we can respond with.
        ipcMain.on('create-screenshot', async (event: Electron.Event, screenshotRequest: ScreenshotRequest) => {

            let webContents = BrowserWindow.getFocusedWindow()!.webContents;

            let image = await ScreenshotService.capture(webContents, screenshotRequest);

            let dataURL = image.toDataURL();
            let size = image.getSize();

            let screenshotResult: Screenshot = {
                dataURL,
                dimensions: {
                    width: size.width,
                    height: size.height
                }
            };

            // the sender is the app that request the screenshot
            event.sender.send("screenshot-created", screenshotResult);

        });

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

        let rect = screenshotRequest.rect;

        if(! rect) {
            throw new Error("No rect");
        }

        return new Promise<Electron.NativeImage>((resolve) => {

            webContents.capturePage(rect, (image) => {
                resolve(image);
            })

        })

    }

}
