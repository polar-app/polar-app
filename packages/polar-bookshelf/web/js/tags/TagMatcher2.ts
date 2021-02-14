import {Tag} from "polar-shared/src/tags/Tags";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

/**
 * We can filter anything that has tags.
 */
export interface ITagged {
    readonly tags?: Readonly<{[id: string]: Tag}>;
}

export namespace TagMatcher2 {

    /**
     *
     * @param list The list of items with tags that will be filtered.
     * @param filterTags The list of that the items must have at least one of...
     */
    export function filter<T extends ITagged>(list: ReadonlyArray<T>,
                                              filterTags: ReadonlyArray<Tag>): ReadonlyArray<T> {

        const filterTagsMap = arrayStream(filterTags)
            .toMap(current => current.id);

        function predicate(item: T): boolean {

            const itemTags = Object.values(item.tags || {});

            for (const itemTag of itemTags) {
                if (filterTagsMap[itemTag.id]) {
                    return true;
                }
            }

            return false;

        }

        return list.filter(predicate);

    }

}
