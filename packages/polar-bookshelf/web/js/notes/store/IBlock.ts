import { ISODateTimeString } from "polar-shared/src/metadata/ISODateTimeStrings";
import {BlockIDStr, IBlockContent} from "./BlocksStore";

export type UIDStr = string;
export type NamespaceIDStr = string;

export interface IBlock<C extends IBlockContent = IBlockContent> {

    readonly id: BlockIDStr;

    readonly nspace: NamespaceIDStr;

    readonly uid: UIDStr;

    readonly parent: BlockIDStr | undefined;

    readonly created: ISODateTimeString;

    readonly updated: ISODateTimeString;

    /**
     * The sub-items of this node as node IDs.
     */
    readonly items: ReadonlyArray<BlockIDStr>;

    readonly content: C;

    /**
     * The linked wiki references to other notes.
     */
    readonly links: ReadonlyArray<BlockIDStr>;

    // FIXMEL this needs to be refactoed because
    // the content type of the node should/could change and we need markdown/latex/etc note types
    // but also we need the ability to do block embeds an so forth and those are a specic note type.
    // FIXME: maybe content would be a reference to another type..

}
