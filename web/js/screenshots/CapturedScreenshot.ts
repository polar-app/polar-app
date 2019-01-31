import {IDimensions} from '../util/Dimensions';

export interface CapturedScreenshot {
    readonly dataURL: string;
    readonly dimensions: IDimensions;
}

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
