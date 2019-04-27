import {CapturedScreenshot} from './CapturedScreenshot';
import {webContents} from "electron";
import {Logger} from '../logger/Logger';
import {ScreenshotRequest} from './CapturedScreenshot';

const log = Logger.create();

/**
 * Handles the actual screenshotting.
 */
export class ScreenshotDelegate implements IScreenshotDelegate {

    public static DELEGATE_NAME = "screenshotDelegate";

    public async capture(id: WebContentsID, screenshotRequest: ScreenshotRequest): Promise<CapturedScreenshot> {

        const nativeImage = await this.captureNativeImage(id, screenshotRequest);
        return this.toCapturedScreenshot(nativeImage, screenshotRequest);

    }

    /**
     * Create a screenshot and return a NativeImage of the result.
     *
     * https://github.com/electron/electron/blob/master/docs/api/native-image.md
     *
     * @param id the ID fo the webContents to screenshot from.
     * @param screenshotRequest The rect data for where to capture on the page.
     * @return {Promise} for {NativeImage}. You can call toDateURL on the image
     *         with scaleFactor as an option.
     *
     */
    private async captureNativeImage(id: WebContentsID, screenshotRequest: ScreenshotRequest): Promise<Electron.NativeImage> {

        const webContentsInstance = webContents.fromId(id);

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

            webContentsInstance.capturePage(rect, (image) => {

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

    private toCapturedScreenshot(image: Electron.NativeImage,
                                 screenshotRequest: ScreenshotRequest) {

        const toData = () => {

            switch (screenshotRequest.type) {

                case 'data-url':
                    return image.toDataURL();
                case 'png':
                    return image.toPNG();

            }

        };

        const data = toData();

        const size = image.getSize();

        const capturedScreenshot: CapturedScreenshot = {
            data,
            dimensions: {
                width: size.width,
                height: size.height
            },
            type: 'data-url'
        };

        return capturedScreenshot;

    }

}

export interface IScreenshotDelegate {
    capture(id: WebContentsID, screenshotRequest: ScreenshotRequest): Promise<CapturedScreenshot>;
}

export type WebContentsID = number;
