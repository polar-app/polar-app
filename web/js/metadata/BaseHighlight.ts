import {Image} from './Image';
import {ExtendedAnnotation} from './ExtendedAnnotation';
import {Preconditions} from '../Preconditions';
import {Rect} from '../Rect';


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

    constructor(val: any) {

        super(val);

    }

    public validate() {

        super.validate();

        Preconditions.assertNotNull(this.rects, "rects");
        Preconditions.assertNotInstanceOf(this.rects, "rects", Array);

    }

}

/**
 * The set of highlight colors.  We also provide transparent for text you want
 * to index but might not actually want visible in the document. We can use this
 * for secondary / anonymous highlights like notes and comments which might
 * not need to be visibly shown.
 */
export type HighlightColor = 'yellow' | 'red' | 'green' | 'blue' | 'transparent';

export interface HighlightRects {
    [key: string]: Rect;
}
