import { ISODateTimeString } from "polar-shared/src/metadata/ISODateTimeStrings";
import {BlockIDStr, IBlockContent} from "./BlocksStore";

export type UIDStr = string;
export type NamespaceIDStr = string;

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
    readonly links: ReadonlyArray<IBlockLink>;

}
