import {ISODateString, ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {PositionalArrays} from "polar-shared/src/util/PositionalArrays";
import {IDStr} from "polar-shared/src/util/Strings";
import {IMarkdownContent} from "./content/IMarkdownContent";
import {INameContent} from "./content/INameContent";
import {IImageContent} from "./content/IImageContent";
import {IDateContent} from "./content/IDateContent";
import {
    IAnnotationContent,
    IFlashcardAnnotationContent,
    ITextHighlightAnnotationContent
} from "./content/IAnnotationContent";
import {IDocumentContent} from "./content/IDocumentContent";
import PositionalArray = PositionalArrays.PositionalArray;

export type BlockIDStr = IDStr;

export type UIDStr = string;
export type NamespaceIDStr = string;

/**
 * A number that's unsigned and always non-negative. zero or greater.
 */
export type UnsignedInteger = number;

/**
 * Every time we change block we incrementation the mutation so that we can know
 * that something has changed. The 'updated' value is nice but if the user
 * updated the value in the same 'ms' the mutation count can determine that the
 * value has changed even though the 'updated' time has not.
 *
 */
export type TMutation = UnsignedInteger;

export type IBlockContent = IMarkdownContent
                            | INameContent
                            | IImageContent
                            | IDateContent

                            | IDocumentContent
                            | IAnnotationContent;

export type IEditableContent = IMarkdownContent
                               | INameContent
                               | IDateContent
                               | ITextHighlightAnnotationContent
                               | IFlashcardAnnotationContent;

export type ITextContent = IEditableContent
                           | IDocumentContent;

export type IHasLinksContent = IMarkdownContent
                               | ITextHighlightAnnotationContent;

export type INamedContent = INameContent | IDateContent | IDocumentContent;

export type IBlockContentStructure<T = IBlockContent> = {
    readonly id: BlockIDStr;
    readonly content: T;
    readonly updated?: ISODateString;
    readonly created?: ISODateString;
    children: ReadonlyArray<IBlockContentStructure>;
};

export interface IBlockLink {

    /**
     * The id of the block we're linking to.
     */
    readonly id: BlockIDStr;

    /**
     * The text of the block in the markdown note.
     */
    readonly text: string;

}

export type NewChildPos = 'before' | 'after';

export interface INewChildPosition {
    readonly ref: BlockIDStr;
    readonly pos: NewChildPos;
}

export type IBlockContentMap = {
    [K in IBlockContent as K['type']]: K;
};

/**
 * Namespace IDs can be a regular Namespace ID or a UID
 */
export type NamespaceIDLikeStr = NamespaceIDStr | UIDStr;

export interface IBlock<C extends IBlockContent = IBlockContent> {

    readonly id: BlockIDStr;

    readonly nspace: NamespaceIDLikeStr;

    readonly uid: UIDStr;

    /**
     * The root parent of this block.
     */
    readonly root: BlockIDStr;

    /**
     * The immediate parent of this block.
     */
    readonly parent: BlockIDStr | undefined;

    /**
     * All parents as a path back to the root.  This will be an empty array if
     * its the root.
     */
    readonly parents: ReadonlyArray<BlockIDStr>;

    readonly created: ISODateTimeString;

    readonly updated: ISODateTimeString;

    /**
     * The sub-items of this node as node IDs.
     */
    readonly items: PositionalArray<BlockIDStr>;

    readonly content: C;

    /**
     * The unique mutation number that's incremented each time we change the object.
     */
    readonly mutation: TMutation;

    /**
     * Specify the heading type of this note. Changes the formatting of the note
     * for markdown content.  The default is 'normal'
     */
    // readonly heading?: 'normal' | 'h1' | 'h2' | 'h3'

    /**
     * Specify how the items are rendered. Should they be bullets or numbered or
     * not shown (document). The default is 'bullet'
     */
    // readonly itemsViewType?: 'bullet' | 'numbered' | 'document' ;

    /**
     * Specify how an item is aligned (left is the default).
     */
    // readonly alignment?: 'left' | 'center' | 'right';

}

