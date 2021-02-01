
import {IDStr} from "polar-shared/src/util/Strings";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {NoteTargetStr} from "./NoteLinkLoader";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IComment} from "polar-shared/src/metadata/IComment";

export type NoteIDStr = IDStr;
export type BlockIDStr = IDStr;

/**
 * Markdown data.
 */
export interface IMarkdownData {
    readonly type: 'markdown';
    readonly value: string;
}

/**
 * Name data represents a node, by name, that has a restricted set of
 * characters for a named node reference.
 */
export interface INameData {
    readonly type: 'name';
    readonly value: string;
}

export type ILatexData = string;

/**
 * A note with markdown content.
 */
export interface INoteContent {

    readonly data: IMarkdownData | INameData;

    readonly type: 'note';

    /**
     * The linked wiki references to other notes.
     */
    readonly links?: ReadonlyArray<NoteTargetStr>;

}

/**
 * A reference to another block rather than duplicating content.
 */
export interface IBlockReferenceContent {

    readonly type: 'reference';

    /**
     * The ID that this reference is linked to...
     */
    readonly id: BlockIDStr;

}

/**
 * Reference to a polar annotation.  We directly extend ITextHighlight and
 * IAnnotationHighlight here and reference the rest as inline metadata.
 */
interface IAnnotationContent<T, D> {

    readonly type: T;

    readonly id: IDStr;

    /**
     * The document ID for this highlight.
     */
    readonly docID: IDStr;

    /**
     * The page number to which this document is attached.
     */
    readonly pageNum: number;

    readonly data: D

}

export interface ITextHighlightAnnotationContent extends IAnnotationContent<'annotation-text-highlight', ITextHighlight> {

}

export interface IAreaHighlightAnnotationContent extends IAnnotationContent<'annotation-area-highlight', IAreaHighlight> {

}

export interface ICommentAnnotationContent extends IAnnotationContent<'annotation-comment', IComment> {

}

export interface IFlashcardAnnotationContent extends IAnnotationContent<'annotation-flashcard', IComment> {

}


export interface ILatexContent {
    readonly type: 'latex';
    readonly data: ILatexData;
}

export interface ICodeData {
    readonly lang: 'typescript' | 'javascript' | 'markdown' | string;
    readonly value: string;
}

export interface ICodeContent {
    readonly type: 'code';
    readonly data: ICodeData;
}

export interface IBlock {

    readonly id: BlockIDStr;

    /**
     * The owner of this block.
     */
    readonly uid: string;

    /**
     * The version of this block so we can have multiple but compatible versions
     * in the same store.
     */
    readonly ver: 'v1';

    /**
     * The sub-items of this node as node IDs.  All blocks should have
     * items/children because an embed or a latex note wouldn't be able to have
     * children.
     */
    readonly items?: ReadonlyArray<NoteIDStr>;

    readonly created: ISODateTimeString;

    readonly updated: ISODateTimeString;

    readonly content: INoteContent |
                      IBlockReferenceContent |
                      ILatexContent |
                      ICommentAnnotationContent |
                      ITextHighlightAnnotationContent |
                      IAreaHighlightAnnotationContent |
                      IFlashcardAnnotationContent;

}
