import {ipcRenderer} from 'electron';
import {IXYRect} from '../util/rects/IXYRect';
import {IXYRects} from '../util/rects/IXYRects';
import {Screenshot} from './Screenshot';
import {ScreenshotRequest} from './ScreenshotRequest';

/**
 * Create a screenshot of the display.
 *
 * @ElectronRendererContext
 */
export class Screenshots {

    /**
     * Create a screenshot and return a NativeImage of the result.
     *
     * https://github.com/electron/electron/blob/master/docs/api/native-image.md
     *
     * @param target.  Specify either rect or element to capture as properties.
     *
     * @return {Promise} for {NativeImage}. You can call toDateURL on the image
     *         with scaleFactor as an option.
     *
     */
    static async capture(target: IXYRect | HTMLElement): Promise<Screenshot> {

        let rect: IXYRect;

        if(target instanceof HTMLElement) {

            rect = IXYRects.createFromClientRect(target.getBoundingClientRect());

        } else {
            rect = target;
        }

        let screenshotRequest = <ScreenshotRequest> {
            rect
        };

        // now send the screenshotRequest IPC message and wait for the response
        return await ipcRenderer.sendSync('create-screenshot', screenshotRequest);

    }

}

