import {Tag, TagStr} from "polar-shared/src/tags/Tags";
import {IPersistentPrefs} from "../util/prefs/Prefs";

const PREFS_KEY = 'userTags';


/**
 * A tag explicitly created / managed by a user and configured with their own
 * metadata if necessary.  The actual LABEL might be used globally (across
 * groups) but they can define special meaning like a color or an icon.
 */
export interface UserTag extends Tag {

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


export interface LoadedUserTags {
    [tag: string]: UserTag;
}

export type PersistedUserTags = ReadonlyArray<UserTag>;

/**
 * The implementation class to be used in the persistence layer.
 */
export class UserTagsDB {

    private backing: LoadedUserTags = {};

    constructor(private readonly persistentPrefs: IPersistentPrefs) {
    }

    public register(tag: UserTag) {
        this.backing[tag.label] = tag;
    }

    public delete(id: TagStr) {
        return delete this.backing[id];
    }

    public rename(id: TagStr, newName: TagStr) {
        delete this.backing[id];
        this.backing[id] = {
            id: newName,
            label: newName,
        };
    }

    /**
     * Register a tag when it's absent with default values.
     */
    public registerWhenAbsent(tag: TagStr) {

        if (this.backing[tag]) {
            // console.log("Tag already present: " , tag);
            // already present
            return;
        }

        this.register({id: tag, label: tag});

    }

    public tags(): ReadonlyArray<UserTag> {
        return Object.values(this.backing);
    }

    public init() {

        const json = this.persistentPrefs.get(PREFS_KEY);

        if (json.isPresent()) {

            const persistedUserTags: PersistedUserTags = JSON.parse(json.get());
            this.backing = {};

            for (const persistedUserTag of persistedUserTags) {
                this.backing[persistedUserTag.id] = persistedUserTag;
            }
        }

    }

    public async commit() {

        console.log("Commit of UserTagsDB: ", {...this.backing});

        const persistedUserTags: PersistedUserTags = Object.values(this.backing);
        const json = JSON.stringify(persistedUserTags);

        this.persistentPrefs.set(PREFS_KEY, json);

        await this.persistentPrefs.commit();

    }

}


