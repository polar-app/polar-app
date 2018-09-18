import {Tag} from '../../../web/js/tags/Tag';

export class FilteredTags {

    private tags: Tag[] = [];

    public get(): Tag[] {
        return this.tags;
    }

    public set(tags: Tag[]) {
        this.tags = tags;
    }

}

