import {Tag, TagStr} from 'polar-shared/src/tags/Tags';
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {SetArrays} from "polar-shared/src/util/SetArrays";
import {ForwardTagToDocIDIndex} from "./ForwardTagToDocIDIndex";
import {ReverseDocIDToTagIndex} from "./ReverseDocIDToTagIndex";
import {isPresent} from "polar-shared/src/Preconditions";
import { IDStr } from 'polar-shared/src/util/Strings';


class TagIndex {

    // tags to docs
    private forward = new ForwardTagToDocIDIndex();

    // docs to tags
    private reverse = new ReverseDocIDToTagIndex();

    public prune () {
        this.forward.purge(value => value.count() === 0);
    }

    /**
     * Find doc IDs tagged with this tag.
     */
    public tagged(tag: Tag): ReadonlyArray<IDStr> {
        return this.forward.get(tag).toArray();
    }

    public set(docID: string, tags: ReadonlyArray<Tag>) {

        // take a copy of the existing tabs before we remove them
        const existingTags = this.reverse.get(docID).toArray();

        // the forward mapping
        for (const tag of tags) {
            this.forward.get(tag).add(docID);
        }

        // the reverse mapping
        this.reverse.get(docID).set(tags.map(tag => tag.id));

        const removeTags = SetArrays.difference(existingTags,
                                                tags.map(tag => tag.id));

        for (const removeTag of removeTags) {

            const existingTagMembers = this.forward.getWithKey(removeTag);

            if (existingTagMembers) {
                existingTagMembers.delete(docID);
            }

        }

    }

    public delete(docID: string, tags: ReadonlyArray<Tag>) {

        for (const tag of tags) {

            const set = this.forward.get(tag);
            set.delete(docID);

            if (set.count() === 0) {
                this.forward.delete(tag.id);
            }

        }
    }

    public toTagDescriptors(): ReadonlyArray<TagDescriptor> {

        return this.forward.values().map(current => {

            return {
                ...current.key,
                count: current.count(),
                members: current.toArray()
            };

        });
    }

}

/**
 * Stores generic data objects like RepoDocInfo or RepoAnnotation and provides
 * generic tag structure metadata too.
 */
export class DataObjectIndex<D> {

    private index: {[id: string]: D} = {};

    private tagIndex = new TagIndex();

    public constructor(private readonly toTags: (input?: D) => ReadonlyArray<Tag>) {

    }

    public prune() {
        this.tagIndex.prune();
    }

    public tagged(tag: Tag) {
        return this.tagIndex.tagged(tag);
    }

    public contains(key: string): boolean {
        return isPresent(this.index[key]);
    }

    public get(key: string): D | undefined {
        const value = this.index[key];

        if (value) {
            return value;
        }

        return undefined;

    }

    public put(key: string, data: D) {

        this.index[key] = data;
        const tags = this.toTags(data);
        this.tagIndex.set(key, tags);

    }

    public delete(key: string) {
        const value = this.index[key];
        delete this.index[key];

        this.tagIndex.delete(key, this.toTags(value));
    }

    public values(): ReadonlyArray<D> {
        return Object.values(this.index);
    }

    public size(): number {
        return Object.keys(this.index).length;
    }

    public toTagDescriptors() {
        return this.tagIndex.toTagDescriptors();
    }

}
