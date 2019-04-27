import {IDimensions} from '../util/Dimensions';
import {IXYRect} from '../util/rects/IXYRect';

export interface CaptureOpts {
    readonly resize?: ResizeDimensions;
    readonly crop?: CropDimensions;
    readonly type: CaptureImageType;
}

export class DefaultCaptureOpts implements CaptureOpts {
    public readonly type = 'data-url';
}

export interface ScreenshotRequest {

    readonly rect: IXYRect;

    readonly resize?: ResizeDimensions;

    readonly crop?: CropDimensions;

    readonly type: CaptureImageType;

}

export interface CapturedScreenshot {

    /**
     * When this is a string it's a data URL and when it's a buffer it's raw
     * image binary data.
     */
    readonly data: string | Buffer;

    readonly dimensions: IDimensions;

    readonly type: CaptureImageType;

}

export type CaptureImageType = 'data-url' | 'png';

/**
 * Specify how to resize the object.  At least one of width or height
 * must be specified and we scale to the other dimension.
 */
export interface ResizeDimensions {

    readonly width?: number;
    readonly height?: number;

}

export interface CropDimensions {

    readonly width: number;
    readonly height: number;
    readonly x: number;
    readonly y: number;

}
