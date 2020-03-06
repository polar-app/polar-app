import {TagStr} from "polar-shared/src/tags/Tags";
import {PrefsProvider} from "./Datastore";

const PREFS_KEY = 'tags-db';

export interface TagMeta {

    /**
     * The label to show in the UI.
     */
    readonly label: TagStr;

    /**
     * True when the tag is hidden.  Used for special types of tags that should
     * not be shown in the UI as they would just clutter the UI.
     */
    readonly hidden?: boolean;

    /**
     * The color of this tag.
     */
    readonly color?: string;

}

export interface TagsDB {

    tags(): ReadonlyArray<TagMeta>;

}

/**
 * The implementation class to be used in the persistence layer.
 */
export class MutableTagsDB implements TagsDB {

    private backing: {[tag: string]: TagMeta} = {};

    constructor(private readonly prefsProvider: PrefsProvider) {
    }

    public register(tag: TagMeta) {
        this.backing[tag.label] = tag;
    }

    /**
     * Register a tag when it's absent with default values.
     */
    public registerWhenAbsent(tag: TagStr) {

        if (this.backing[tag]) {
            // already present
            return;
        }

        this.register({label: tag});

    }

    public tags() {
        return Object.values(this.backing);
    }

    public async init() {

        const persistentPrefs = this.prefsProvider.get();
        const json = persistentPrefs.get(PREFS_KEY);

        if (json.isPresent()) {
            this.backing = JSON.parse(json.get());
        }

    }

    public async persist() {

        const persistentPrefs = this.prefsProvider.get();

        const json = JSON.stringify(this.backing);
        persistentPrefs.set(PREFS_KEY, json);

        await persistentPrefs.commit();

    }

}


