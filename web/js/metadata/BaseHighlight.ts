import {ExtendedAnnotation} from './ExtendedAnnotation';
import {Preconditions} from '../Preconditions';
import {
    HighlightColor,
    HighlightRects,
    IBaseHighlight,
    Position
} from "./IBaseHighlight";
import {IImage} from "./IImage";

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

