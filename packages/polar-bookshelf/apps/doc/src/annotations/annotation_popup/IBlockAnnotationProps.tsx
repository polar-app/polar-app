import {Block} from "../../../../../web/js/notes/store/Block";
import {TextHighlightAnnotationContent} from "../../../../../web/js/notes/content/AnnotationContent";

export type IBlockAnnotationProps = {
    readonly annotation: Block<TextHighlightAnnotationContent>,
};
