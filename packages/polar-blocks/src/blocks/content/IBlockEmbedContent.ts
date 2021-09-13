/**
 * A reference to another block rather than duplicating content.
 */
import {BlockIDStr} from "../IBlock";
import {IBaseContent} from "./IBaseContent";

export interface IBlockEmbedContent extends IBaseContent {

    readonly type: 'block-embed';


    /**
     * The ID that this reference is linked to...
     */
    readonly ref: BlockIDStr;

}
