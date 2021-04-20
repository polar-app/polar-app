import { IDStr } from "polar-shared/src/util/Strings";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import { IComment } from "polar-shared/src/metadata/IComment";

/**
 * Reference to a polar annotation.  We directly extend ITextHighlight and
 * IAnnotationHighlight here and reference the rest as inline metadata.
 */
interface IAnnotationContent<T, V> {

    readonly type: T;

    /**
     * The document ID for this highlight.
     */
    readonly docID: IDStr;

    /**
     * The page number to which this document is attached.
     */
    readonly pageNum: number;

    /**
     * The value of this note.
     */
    readonly value: V;

}

export interface ITextHighlightAnnotationContent extends IAnnotationContent<'annotation-text-highlight', ITextHighlight> {

}

export interface IAreaHighlightAnnotationContent extends IAnnotationContent<'annotation-area-highlight', IAreaHighlight> {

}

export interface ICommentAnnotationContent extends IAnnotationContent<'annotation-comment', IComment> {

}

export interface IFlashcardAnnotationContent extends IAnnotationContent<'annotation-flashcard', IComment> {

}
