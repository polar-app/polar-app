/**
 * A simple in-memory database of tags.
 */
import {Tag} from '../../../web/js/tags/Tag';

export class TagsDB {

    /**
     * Stores the actual data we're indexing.  The key is the lowercase
     * representation of a tag
     */
    private readonly index: {[id: string]: Tag} = {};

}
