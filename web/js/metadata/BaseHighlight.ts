import {Image} from './Image';
import {ExtendedAnnotation} from './ExtendedAnnotation';
import {Preconditions} from '../Preconditions';


export class BaseHighlight extends ExtendedAnnotation {

    /**
     * The rectangles where we need to place content for this highlights.
     */
    public rects = {};

    /**
     * Optional image for this highlight taken when the highlight was
     * created.  This is usually a screenshot of the annotation and what
     * it looks like on screen.
     *
     * @type {null}
     */
    public image?: Image;

    constructor(val: any) {

        super(val);


    }

    validate() {

        super.validate();

        Preconditions.assertNotNull(this.rects, "rects");
        Preconditions.assertNotInstanceOf(this.rects, "rects", Array);

    };

}
