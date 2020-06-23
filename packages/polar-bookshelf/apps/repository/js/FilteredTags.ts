import {Tag} from 'polar-shared/src/tags/Tags';

/**
 * The list of tags that the user has filtered.
 */
export class FilteredTags {

    private tags: ReadonlyArray<Tag> = [];

    public get(): ReadonlyArray<Tag> {
        return this.tags;
    }

    public set(tags: ReadonlyArray<Tag>) {
        this.tags = tags;
    }

}

