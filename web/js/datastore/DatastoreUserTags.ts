import {PrefsProvider} from "./Datastore";
import {Tag, Tags, TagStr} from "polar-shared/src/tags/Tags";

const PREF_KEY = "userTags";

export class DatastoreUserTags {

    public static get(prefsProvider: PrefsProvider): ReadonlyArray<Tag> {

        const datastorePrefs = prefsProvider.get();
        const tags = datastorePrefs.prefs.get(PREF_KEY);

        if (tags.isPresent()) {
            return JSON.parse(tags.get());
        } else {
            return [];
        }

    }

    public static async set(prefsProvider: PrefsProvider, tags: ReadonlyArray<Tag>) {

        const datastorePrefs = prefsProvider.get();

        datastorePrefs.prefs.set(PREF_KEY, JSON.stringify(tags));

        await datastorePrefs.prefs.commit();

    }

    public static async create(prefsProvider: PrefsProvider, tag: TagStr) {

        const existingTags = this.get(prefsProvider);

        const newTag: Tag = {
            id: tag,
            label: tag
        };

        const newTags = Tags.union(existingTags, [newTag]);

        await this.set(prefsProvider, newTags);

    }

}
