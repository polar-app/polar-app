import {IBlockLink} from "../IBlock";

export interface IHasLinksContent {

    /**
     * The linked wiki references to other notes.
     */
    readonly links: ReadonlyArray<IBlockLink>;
}
