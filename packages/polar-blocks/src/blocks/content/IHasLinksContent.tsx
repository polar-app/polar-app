import {BlockIDStr, IBlockLink} from "../IBlock";

export interface IHasLinksContent {

    readonly id: BlockIDStr;

    /**
     * The linked wiki references to other notes.
     */
    readonly links: ReadonlyArray<IBlockLink>;
}
