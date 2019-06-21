import {RepoDocInfo} from './RepoDocInfo';
import {Tag} from '../../../web/js/tags/Tags';

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

    public register(...tags: Tag[]): void {

        tags.forEach(tag => {

            if (! this.index[tag.id]) {
                this.index[tag.id] = tag;
            }

        });

    }

    /**
     * Get all the labels of all the tags we've indexed so far.
     */
    public tags(): Tag[] {
        return Object.values(this.index);
    }

    /**
     * Write the update data to the database but also make sure all the tags
     * are registered.
     *
     */
    public updateDocInfoTags(repoDocInfo: RepoDocInfo, tags: Tag[]) {
        tags.forEach(current => this.register(current));
    }

}
