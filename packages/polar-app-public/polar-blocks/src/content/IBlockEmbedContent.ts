/**
 * A reference to another block rather than duplicating content.
 */
import {BlockIDStr} from "../IBlock";

export interface IBlockEmbedContent {

    readonly type: 'block-embed';


    /**
     * The ID that this reference is linked to...
     */
    readonly ref: BlockIDStr;

}
