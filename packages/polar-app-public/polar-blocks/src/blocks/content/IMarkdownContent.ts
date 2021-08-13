import {IBlockLink} from "../IBlock";
import {IBaseContent} from "./IBaseContent";

export interface IMarkdownContent extends IBaseContent {
    readonly type: 'markdown';
    readonly data: string;

    /**
     * The linked wiki references to other notes.
     */
    readonly links: ReadonlyArray<IBlockLink>;
}
