import {isPresent} from 'polar-shared/src/Preconditions';
import {Reducers} from "polar-shared/src/util/Reducers";
import {TagPaths} from "./TagPaths";
import {Tags} from "polar-shared/src/tags/Tags";
import {MutableTagNode, TagNode} from "./TagNode";
import {IDStr} from "polar-shared/src/util/Strings";
import {Sets} from "polar-shared/src/util/Sets";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {TRoot} from "../ui/tree/TRoot";

export class TagNodes {

    public static createTagsRoot(tags: ReadonlyArray<TagDescriptor>): TagNode<TagDescriptor> {

        const comparator = (a: TagDescriptor, b: TagDescriptor) => {
            const diff = b.count - a.count;

            if (diff !== 0) {
                return diff;
            }

            return a.label.localeCompare(b.label);

        };

        const children: ReadonlyArray<TagNode<TagDescriptor>> =
            [...tags]
                .sort(comparator)
                .filter(tagDescriptor => ! tagDescriptor.label.startsWith('/'))
                .map(tagDescriptor => {
                    return {
                        id: tagDescriptor.id,
                        name: tagDescriptor.label,
                        path: tagDescriptor.id,
                        children: [],
                        count: tagDescriptor.count,
                        value: tagDescriptor,
                    };
                });

        const tagMembership = this.computeTagMembership(tags);

        const name = 'Tags';

        // TODO: have to call this id with #tags to avoid double selection

        const root: TRoot<TagDescriptor> = {
            id: '/#tags',
            name,
            path: '/',
            children,
            ...tagMembership,
            title: name,
            value: {
                id: '/',
                label: name,
                ...tagMembership
            }
        };

        return root;

    }

    private static computeTagMembership(tags: ReadonlyArray<TagDescriptor>): TagMembership {

        const set = new Set<IDStr>();

        // FIXME this is wrong because we're not de-duplicating the count of docs under the count.  If a doc is tagged
        // twice it will increment the count of two tags.

        const filtered = tags.filter(current => current.label !== '/');

        for (const tag of filtered) {
            for (const member of tag.members) {
                set.add(member);
            }
        }

        const count = set.size;
        const members = Sets.toArray(set);

        return {count, members};

    }

    /**
     * Create a hierarchical structure of tags from the tag descriptors.
     */
    public static createFoldersRoot(opts: CreateOpts): TagNode<TagDescriptor> {

        const {tags} = opts;

        const tagIndex: { [label: string]: TagDescriptor } = {};

        for (const tag of tags) {

            if (!tag.label.startsWith("/")) {
                continue;
            }

            tagIndex[tag.label] = tag;

        }

        const tagNodeIndex = new TagNodeIndex();

        // the global count for all nodes
        const tagMembership = this.computeTagMembership(tags);

        // always register a root so we have at least one path
        const root = tagNodeIndex.register('/', '/', {id: '/', label: '/', ...tagMembership});

        const sortedTagIndexKeys = Object.keys(tagIndex).sort();

        for (const tagLabel of sortedTagIndexKeys) {

            let pathEntries = TagPaths.createPathEntries(tagLabel);

            for (const pathEntry of pathEntries) {

                if (pathEntry.parent) {

                    const parent = tagNodeIndex.get(pathEntry.parent.path);

                    if (!tagNodeIndex.contains(pathEntry.path)) {

                        const computeVirtualTagFromPathEntry = (): TagDescriptor => {

                            if (tagIndex[pathEntry.path]) {
                                // done as we already have a tag for this.
                                return tagIndex[pathEntry.path];
                            }

                            const virtualTag = Tags.create(pathEntry.path);

                            return {...virtualTag, members: [], count: 0};

                        };

                        const virtualTag = computeVirtualTagFromPathEntry();

                        const newNode = tagNodeIndex.register(pathEntry.path, pathEntry.basename, virtualTag);
                        parent.children.push(newNode);
                    }

                }

            }

        }

        return root;

    }

    public static decorate<T extends TagDescriptor>(node: TagNode<TagDescriptor>,
                                                    decorator: (descriptor: TagDescriptor) => T ): TagNode<T> {

        const value = decorator(node.value);

        const children = node.children.map(child => this.decorate(child, decorator));

        return {
            id: node.id,
            name: node.name,
            path: node.path,
            count: node.count,
            children,
            value
        };

    }

}

export interface TagMembership {
    readonly count: number;
    readonly members: ReadonlyArray<IDStr>;
}

export type TagType = 'folder' | 'regular';

export interface CreateOpts {
    readonly tags: ReadonlyArray<TagDescriptor>;
    readonly type: TagType;
}

export class TagNodeIndex {

    private index: {[path: string]: MutableTagNode<TagDescriptor>} = {};

    public register(path: string,
                    name: string,
                    value: TagDescriptor): MutableTagNode<TagDescriptor> {

        if (! this.index[path]) {

            this.index[path] = {
                id: value.id,
                name,
                path,
                children: [],
                count: value.count,
                value
            };

        }

        return this.index[path];

    }

    public contains(path: string): boolean {
        return isPresent(this.index[path]);
    }

    public get(path: string) {
        return this.index[path];
    }

}
