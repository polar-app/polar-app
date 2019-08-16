import {AnnotationType} from './AnnotationType';
import {TextHighlight} from './TextHighlight';
import {AreaHighlight} from './AreaHighlight';
import {Comment} from './Comment';
import {Flashcard} from './Flashcard';
import {PageInfo} from './PageInfo';
import {DocInfo} from './DocInfo';
import {IDocInfo} from "./IDocInfo";
import {IPageInfo} from "./IPageInfo";
import {IComment} from "./IComment";
import {IFlashcard} from "./IFlashcard";
import {ITextHighlight} from "./ITextHighlight";
import {IAreaHighlight} from "./IAreaHighlight";

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
