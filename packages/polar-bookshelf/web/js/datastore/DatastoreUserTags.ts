import {Tag, Tags, TagStr} from "polar-shared/src/tags/Tags";
import {PersistentPrefs, Prefs} from "../util/prefs/Prefs";

const PREF_KEY = "userTags";

export class DatastoreUserTags {

    public static get(prefs: Prefs): ReadonlyArray<Tag> {

        const tags = prefs.get(PREF_KEY);

        if (tags.isPresent()) {
            return JSON.parse(tags.get());
        } else {
            return [];
        }

    }

    public static async set(prefs: PersistentPrefs, tags: ReadonlyArray<Tag>) {
        prefs.set(PREF_KEY, JSON.stringify(tags));
        await prefs.commit();
    }

    public static async create(prefs: PersistentPrefs, tag: TagStr) {

        const existingTags = this.get(prefs);

        const newTag: Tag = {
            id: tag,
            label: tag
        };

        const newTags = Tags.union(existingTags, [newTag]);

        await this.set(prefs, newTags);

    }

}
