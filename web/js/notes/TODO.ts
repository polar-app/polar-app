
import {IDStr} from "polar-shared/src/util/Strings";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {NoteIDStr} from "./NotesStore";

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
     * The sub-items of this node as node IDs.
     */
    readonly items?: ReadonlyArray<NoteIDStr>;

    /**
     * The linked wiki references to other notes.
     */
    readonly links?: ReadonlyArray<NoteIDStr>;

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

export interface ILatexContent {
    readonly type: 'latex';
    readonly data: ILatexData;
}

export interface IBlock {

    readonly id: BlockIDStr;

    readonly created: ISODateTimeString;

    readonly updated: ISODateTimeString;

    readonly content: INoteContent | IBlockReferenceContent | ILatexContent;

}