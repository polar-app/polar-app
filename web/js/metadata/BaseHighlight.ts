import {Image} from './Image';
import {ExtendedAnnotation} from './ExtendedAnnotation';
import {Preconditions} from '../Preconditions';
import {Rect} from '../Rect';
import {HighlightColor} from './HighlightColor';


export class BaseHighlight extends ExtendedAnnotation {

    /**
     * The rectangles where we need to place content for this highlights.
     */
    public rects: HighlightRects = {};

    /**
     * Optional image for this highlight taken when the highlight was created.
     * This is usually a screenshot of the annotation and what it looks like on
     * screen.  This is the primary image for this highlight and not includes in
     * the images below which are optional / secondary images.
     */
    public image?: Image;

    /**
     * Images for this highlight.  By default there are none.
     */
    public images: {[key: string]: Image} = {};

    /**
     * The color of this highlight. Defaults to yellow if undefined.
     */
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

/**
 * The position of a highlight is the absolute position on the page in pixels
 * at 100% zoom level.  Some systems (like pagemarks and area highlights) use
 * percentage placement but text highlights use absolute placement (a poor
 * design issue) but we have to unify on absolute for compatibility reasons
 * with text highlights.  We could later add both systems but we need to at
 * least have the absolute position for portability reasons for area
 * highlights.
 */
export interface Position {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

