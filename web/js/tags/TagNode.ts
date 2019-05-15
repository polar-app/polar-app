import {isPresent} from '../Preconditions';
import {Tag} from './Tag';
import {Reducers} from '../util/Reducers';

export interface MutableTagNode<V> {

    id: number;

    name: string;

    children: Array<MutableTagNode<V>>;

    value: V;

    count: number;

}

export interface TagNode<V> {

    readonly id: number;

    readonly name: string;

    readonly children: ReadonlyArray<TagNode<V>>;

    readonly count: number;

    readonly value: V;

}

/**
 * A tag but also the data about the number of records that match this tag.
 */
export interface TagDescriptor extends Tag {
    readonly count: number;
}

export class TagNodes {

    public static create(...tags: ReadonlyArray<TagDescriptor>): TagNode<TagDescriptor> {

        const tagIndex: {[label: string]: TagDescriptor} = {};

        for (const tag of tags) {

            if (! tag.label.startsWith("/")) {
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

            const tag = tagIndex[tagLabel];

            const pathEntries = this.split(tagLabel);

            for (const pathEntry of pathEntries) {

                if (pathEntry.parent) {

                    const parent = tagNodeIndex.get(pathEntry.parent.path);

                    if (! tagNodeIndex.contains(pathEntry.path)) {
                        const newNode = tagNodeIndex.register(pathEntry.path, pathEntry.basename, tag);
                        parent.children.push(newNode);
                    }

                }

            }

        }

        return root;

    }

    public static split(path: string): ReadonlyArray<PathEntry> {

        const paths = path.split("/");

        let buff: string = '';

        const result: PathEntry[] = [];

        let parent: PathEntry | undefined;

        for (const current of paths) {

            // const parent: string | undefined  = buff === '' ? undefined : buff;

            if (buff === '/') {
                buff = buff + current;
            } else {
                buff = buff + '/' + current;
            }

            const toParent = (): RawPathEntry | undefined => {

                if (parent) {

                    return {
                        path: parent.path,
                        basename: parent.basename
                    };

                }

                return undefined;

            };

            const pathEntry: PathEntry = {
                path: buff,
                basename: current,
                parent: toParent()
            };

            result.push(pathEntry);

            parent = pathEntry;

        }

        return result;
    }

}

interface RawPathEntry {
    readonly path: string;
    readonly basename: string;
}

interface PathEntry extends RawPathEntry {
    readonly parent: RawPathEntry | undefined;
}

class TagNodeIndex {

    private seq: number = 0;

    private index: {[path: string]: MutableTagNode<TagDescriptor>} = {};

    public register(path: string,
                    name: string,
                    value: TagDescriptor): MutableTagNode<TagDescriptor> {

        if (! this.index[path]) {

            this.index[path] = {
                id: this.seq++,
                name,
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
