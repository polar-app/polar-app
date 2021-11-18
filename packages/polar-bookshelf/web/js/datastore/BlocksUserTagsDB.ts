import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {Tag, TagStr} from "polar-shared/src/tags/Tags";
import {IPersistentPrefs} from "../util/prefs/Prefs";

const PREFS_KEY = 'userTags';

/**
 * The implementation class to be used in the persistence layer.
 */
export class BlocksUserTagsDB {

    private backing: Map<BlockIDStr, Tag> = new Map();

    constructor(private readonly persistentPrefs: IPersistentPrefs) {}

    public get(id: BlockIDStr): Tag | undefined {
        return this.backing.get(id);
    }

    public exists(id: BlockIDStr): boolean {
        return this.backing.has(id);
    }

    public register(tag: Tag): void {
        this.backing.set(tag.id, tag);
    }

    public delete(id: BlockIDStr): boolean {
        return this.backing.delete(id);
    }

    public rename(id: TagStr, newName: TagStr): void {
        this.backing.set(id, { id, label: newName });
    }

    public tags(): ReadonlyArray<Tag> {
        return [...this.backing.values()];
    }

    public init() {

        const json = this.persistentPrefs.get(PREFS_KEY);

        if (json.isPresent()) {

            const persistedUserTags: ReadonlyArray<Tag> = JSON.parse(json.get());
            this.backing = new Map();

            for (const persistedUserTag of persistedUserTags) {
                this.backing.set(persistedUserTag.id, persistedUserTag);
            }
        }

    }

    public async commit() {

        const tags = this.tags();
        console.log("Commit of UserTagsDB: ", tags);

        const json = JSON.stringify(tags);

        this.persistentPrefs.set(PREFS_KEY, json);

        await this.persistentPrefs.commit();

    }

}


