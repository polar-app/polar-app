import {BlockIDStr} from "../store/BlocksStore";

/**
 * A reference to another block rather than duplicating content.
 */
export interface IBlockEmbedContent {

    readonly type: 'block-embed';


    /**
     * The ID that this reference is linked to...
     */
    readonly ref: BlockIDStr;

}
