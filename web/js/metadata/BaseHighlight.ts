import {Image} from './Image';
import {ExtendedAnnotation} from './ExtendedAnnotation';
import {Preconditions} from '../Preconditions';
import {Rect} from '../Rect';


export class BaseHighlight extends ExtendedAnnotation {

    /**
     * The rectangles where we need to place content for this highlights.
     */
    public rects: {[key: number]: Rect} = {};

    /**
     * Optional image for this highlight taken when the highlight was
     * created.  This is usually a screenshot of the annotation and what
     * it looks like on screen.
     *
     * @type {null}
     */
    public image?: Image;

    /**
     * Images for this highlight.  By default there are none.
     */
    public images: {[key: string]: Image} = {};

    constructor(val: any) {

        super(val);


    }

    validate() {

        super.validate();

        Preconditions.assertNotNull(this.rects, "rects");
        Preconditions.assertNotInstanceOf(this.rects, "rects", Array);

    };

}
