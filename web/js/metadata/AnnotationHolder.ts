import {AnnotationType} from './AnnotationType';
import {TextHighlight} from './TextHighlight';
import {AreaHighlight} from './AreaHighlight';
import {Comment} from './Comment';
import {Flashcard} from './Flashcard';
import {PageInfo} from './PageInfo';
import {DocInfo} from './DocInfo';

/**
 * Represents a detached annotation which can be passed across the system and
 * doesn't have associated
 */
export interface AnnotationHolder {

    readonly type: AnnotationType;

    readonly annotation: TextHighlight | AreaHighlight | Comment | Flashcard;

    /**
     * Optional because in the future it might be nice to have annotations
     * which aren't strictly bound to documents.
     */
    readonly pageInfo?: PageInfo;

    /**
     * Optional because in the future it might be nice to have annotations
     * which aren't strictly bound to documents.
     */
    readonly docInfo?: DocInfo;

}
