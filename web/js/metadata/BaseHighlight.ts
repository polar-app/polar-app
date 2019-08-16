import {IImage, Image} from './Image';
import {ExtendedAnnotation} from './ExtendedAnnotation';
import {Preconditions} from '../Preconditions';
import {Rect} from '../Rect';
import {HighlightColor} from './HighlightColor';
import {IBaseHighlight, Position} from "./IBaseHighlight";

export class BaseHighlight extends ExtendedAnnotation implements IBaseHighlight {

    public rects: HighlightRects = {};

    public image?: IImage;

    public images: {[key: string]: IImage} = {};

    public color?: HighlightColor;

    public position?: Position;

    constructor(val: any) {

        super(val);

    }

    public validate() {

        super.validate();

        Preconditions.assertNotNull(this.rects, "rects");
        Preconditions.assertNotInstanceOf(this.rects, "rects", Array);

    }

}

export interface HighlightRects {
    [key: string]: Rect;
}

