import {isPresent} from 'polar-shared/src/Preconditions';
import {Reducers} from "polar-shared/src/util/Reducers";
import {TagPaths} from "./TagPaths";
import {Tags} from "polar-shared/src/tags/Tags";
import {MutableTagNode, TagDescriptor, TagNode} from "./TagNode";
import {TRoot} from "../ui/tree/TreeView";

export class TagNodes {

    public static createTagsRoot(tags: ReadonlyArray<TagDescriptor>): TagNode<TagDescriptor> {

        const children: ReadonlyArray<TagNode<TagDescriptor>> =
            [...tags].sort((a, b) => b.count - a.count)
                .filter(tagDescriptor => ! tagDescriptor.label.startsWith('/'))
                .map(tagDescriptor => {
                return {
                    id: tagDescriptor.id,
                    name: tagDescriptor.label,
                    path: tagDescriptor.id,
                    children: [],
                    count: tagDescriptor.count,
                    value: tagDescriptor,
                }
            });

        const name = 'Tags';

        const root: TRoot<TagDescriptor> = {
            id: 'tags',
            name,
            path: '/',
            children,
            count: 666,
            title: name,
            value: {
                id: 'tags',
                label: name,
                count: 666
            }
        };

        return root;

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
        const count =
            tags.filter(current => current.label !== '/')
                .map(current => current.count)
                .reduce(Reducers.SUM, 0);

        // always register a root so we have at least one path
        const root = tagNodeIndex.register('/', '/', {id: '/', label: '/', count});

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

                            return {...virtualTag, count: 0};

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
