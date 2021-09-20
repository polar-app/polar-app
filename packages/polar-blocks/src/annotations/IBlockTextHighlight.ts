import {AnnotationOrder, HighlightColor, HighlightRects} from "polar-shared/src/metadata/IBaseHighlight";
import {MarkdownStr} from "polar-shared/src/util/Strings";

export interface IBlockTextHighlight {

    /**
     * The rectangles where we need to place content for this highlights.
     */
    readonly rects: HighlightRects;

    readonly text: MarkdownStr;

    /**
     * User edited/revised text for the highlight.
     */
    readonly revisedText?: MarkdownStr;

    

    /**
     * The color of this highlight. Defaults to yellow if undefined.
     */
    readonly color: HighlightColor;

    /**
     * Works with position to help place the annotations on the page but order
     * is approximate and this can also be used to reorder the sidebar manually.
     */
    readonly order?: AnnotationOrder;
}
