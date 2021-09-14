import {IDStr} from "polar-shared/src/util/Strings";
import {IBaseContent} from "./IBaseContent";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {IBlockTextHighlight} from "../../annotations/IBlockTextHighlight";
import {IBlockAreaHighlight} from "../../annotations/IBlockAreaHighlight";

export enum AnnotationContentType {
    TEXT_HIGHLIGHT = "annotation-text-highlight",
    AREA_HIGHLIGHT = "annotation-area-highlight",
    FLASHCARD = "annotation-flashcard",
}

export type IAnnotationContentValue = IBlockAreaHighlight | IBlockTextHighlight | IFlashcard;

export type IAnnotationContentTypeMap = {
    [AnnotationContentType.FLASHCARD]: IFlashcardAnnotationContent,
    [AnnotationContentType.TEXT_HIGHLIGHT]: ITextHighlightAnnotationContent,
    [AnnotationContentType.AREA_HIGHLIGHT]: IAreaHighlightAnnotationContent,
};

/**
 * Reference to a polar annotation.  We directly extend ITextHighlight and
 * IAnnotationHighlight here and reference the rest as inline metadata.
 */
export interface IAnnotationContentBase<T extends `${AnnotationContentType}`, V extends IAnnotationContentValue> extends IBaseContent {

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

export interface ITextHighlightAnnotationContent extends IAnnotationContentBase<AnnotationContentType.TEXT_HIGHLIGHT, IBlockTextHighlight> {

}

export interface IAreaHighlightAnnotationContent extends IAnnotationContentBase<AnnotationContentType.AREA_HIGHLIGHT, IBlockAreaHighlight> {

}

export interface IFlashcardAnnotationContent extends IAnnotationContentBase<AnnotationContentType.FLASHCARD, IFlashcard> {

}

export type IAnnotationContent = ITextHighlightAnnotationContent
                                 | IAreaHighlightAnnotationContent
                                 | IFlashcardAnnotationContent;
