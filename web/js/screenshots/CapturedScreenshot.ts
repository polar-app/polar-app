import {IDimensions} from '../util/Dimensions';

export interface CapturedScreenshot {
    readonly dataURL: string;
    readonly dimensions: IDimensions;
}

