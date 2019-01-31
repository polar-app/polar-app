import {IXYRect} from '../util/rects/IXYRect';
import {CropDimensions, ResizeDimensions} from './CapturedScreenshot';

export interface ScreenshotRequest {

    readonly rect: IXYRect;

    readonly resize?: ResizeDimensions;

    readonly crop?: CropDimensions;

}
