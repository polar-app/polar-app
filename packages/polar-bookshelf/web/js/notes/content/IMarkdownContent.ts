import {IBlockLink} from "../store/IBlock";

export interface IMarkdownContent {
    readonly type: 'markdown';
    readonly data: string;

    /**
     * The linked wiki references to other notes.
     */
    readonly links: ReadonlyArray<IBlockLink>;
}
