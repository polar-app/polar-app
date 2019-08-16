import {AnnotationType} from './AnnotationType';
import {ITextHighlight, TextHighlight} from './TextHighlight';
import {AreaHighlight, IAreaHighlight} from './AreaHighlight';
import {Comment, IComment} from './Comment';
import {Flashcard, IFlashcard} from './Flashcard';
import {IPageInfo, PageInfo} from './PageInfo';
import {DocInfo} from './DocInfo';
import {IDocInfo} from "./IDocInfo";

/**
 * Represents a detached annotation which can be passed across the system and
 * doesn't have associated
 */
export interface AnnotationHolder {

    readonly type: AnnotationType;

    readonly annotation: ITextHighlight | IAreaHighlight | IComment | IFlashcard;

    /**
     * Optional because in the future it might be nice to have annotations
     * which aren't strictly bound to documents.
     */
    readonly pageInfo?: IPageInfo;

    /**
     * Optional because in the future it might be nice to have annotations
     * which aren't strictly bound to documents.
     */
    readonly docInfo?: IDocInfo;

}
