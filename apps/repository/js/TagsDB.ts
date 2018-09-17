import {Tag} from '../../../web/js/tags/Tag';

/**
 * A simple in-memory database of tags which can be built when we load the .json
 * data from disk.
 */
export class TagsDB {

    /**
     * Stores the actual data we're indexing.  The key is the lowercase
     * representation of a tag
     */
    private readonly index: {[id: string]: Tag} = {};

    public register(tag: Tag): void {

        if (! this.index[tag.id]) {
            this.index[tag.id] = tag;
        }

    }

    /**
     * Get all the labels of all the tags we've indexed so far.
     */
    public labels(): string[] {

        return Object.values(this.index)
            .map(current => current.label);

    }

}
