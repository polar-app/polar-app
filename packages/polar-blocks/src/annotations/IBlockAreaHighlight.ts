import {AnnotationOrder, HighlightColor, HighlightRects, Position} from "polar-shared/src/metadata/IBaseHighlight";
import {IImage} from "polar-shared/src/metadata/IImage";

export interface IBlockAreaHighlight {

    /**
     * The rectangles where we need to place content for this highlights.
     */
    readonly rects: HighlightRects;

    /**
     * The color of this highlight. Defaults to yellow if undefined.
     */
    readonly color: HighlightColor;

    /**
     * Works with position to help place the annotations on the page but order
     * is approximate and this can also be used to reorder the sidebar manually.
     */
    readonly order?: AnnotationOrder;

    /**
     * Optional image for this highlight taken when the highlight was created.
     * This is usually a screenshot of the annotation and what it looks like on
     * screen.  This is the primary image for this highlight and not includes in
     * the images below which are optional / secondary images.
     */
    image?: IImage;

    /**
     * @see Position Documentation for this design is there.
     */
    position?: Position;
}
