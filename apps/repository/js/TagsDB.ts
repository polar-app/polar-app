import {Tag} from '../../../web/js/tags/Tag';
import {RepoDocInfo} from './RepoDocInfo';
import {TagDescriptor} from '../../../web/js/tags/TagNode';

/**
 * A simple in-memory database of tags which can be built when we load the .json
 * data from disk.
 */
export class TagsDB {

    /**
     * Stores the actual data we're indexing.  The key is the lowercase
     * representation of a tag
     */
    private readonly index: {[id: string]: MutableTagDescriptor} = {};

    public register(...tags: Tag[]): void {

        tags.forEach(tag => {

            if (! this.index[tag.id]) {
                this.index[tag.id] = {...tag, count: 0};
            }

            // FIXME: this is actually wrong because we can't add or delete
            // records.
            this.index[tag.id].count++;

        });

    }

    /**
     * Get all the labels of all the tags we've indexed so far.
     */
    public tags(): ReadonlyArray<Readonly<MutableTagDescriptor>> {
        return Object.values(this.index);
    }

}

interface MutableTagDescriptor extends Tag {
    count: number;
}
