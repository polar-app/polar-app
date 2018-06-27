const electron = require('electron');
const ipcMain = electron.ipcMain;
const remote = electron.remote;
/**
 * Service that runs in the Electron main context which listens to IPC events
 * and performs screenshots on windows when requested.
 *
 * The ScreenshotsService must be started in the main process or messages will
 * never be returned.
 *
 * @ElectronMainContext - Must be run from the electron main context.
 */
class ScreenshotService {

    constructor() {
    }

    start() {

        // add an IPC listener for screenshot requests

        ipcMain.on('create-screenshot', async (event, screenshotRequest) => {

            let webContents = remote.getCurrentWebContents();

            let image = await ScreenshotService.capture(webContents, screenshotRequest);

            let dataURL = image.toDataURL();

            let screenshotResult = {
                dataURL
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
     * @param screenshotRequest.  Specify either rect or element to capture.
     * @return {Promise} for {NativeImage}. You can call toDateURL on the image
     *         with scaleFactor as an option.
     *
     */
    static async capture(webContents, screenshotRequest) {

        if(! screenshotRequest) {
            throw new Error("screenshotRequest required");
        }

        let rect = screenshotRequest.rect;

        if(! rect) {
            throw new Error("No rect or element given");
        }

        return new Promise((resolve) => {
            webContents.capturePage(rect, (image) => {
                resolve(image);
            })
        })

    }

}

module.exports.ScreenshotService = ScreenshotService;
