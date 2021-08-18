import {IDStr} from "polar-shared/src/util/Strings";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IComment} from "polar-shared/src/metadata/IComment";
import {IBaseContent} from "./IBaseContent";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";

export enum IAnnotationContentType {
    TEXT_HIGHLIGHT = "annotation-text-highlight",
    AREA_HIGHLIGHT = "annotation-area-highlight",
    COMMENT = "annotation-comment",
    FLASHCARD = "annotation-flashcard",
}

export type IAnnotationContentValue = IAreaHighlight | ITextHighlight | IComment | IFlashcard;

/**
 * Reference to a polar annotation.  We directly extend ITextHighlight and
 * IAnnotationHighlight here and reference the rest as inline metadata.
 */
export interface IAnnotationContentBase<T extends `${IAnnotationContentType}`, V extends IAnnotationContentValue> extends IBaseContent {

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

export interface ITextHighlightAnnotationContent extends IAnnotationContentBase<IAnnotationContentType.TEXT_HIGHLIGHT, ITextHighlight> {

}

export interface IAreaHighlightAnnotationContent extends IAnnotationContentBase<IAnnotationContentType.AREA_HIGHLIGHT, IAreaHighlight> {

}

export interface ICommentAnnotationContent extends IAnnotationContentBase<IAnnotationContentType.COMMENT, IComment> {

}

export interface IFlashcardAnnotationContent extends IAnnotationContentBase<IAnnotationContentType.FLASHCARD, IFlashcard> {

}

export type IAnnotationContent = ITextHighlightAnnotationContent
                                 | IAreaHighlightAnnotationContent
                                 | ICommentAnnotationContent
                                 | IFlashcardAnnotationContent;
