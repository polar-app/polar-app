import {IDimensions} from '../util/Dimensions';

export interface Screenshot {
    readonly dataURL: string;
    readonly dimensions: IDimensions;
}
