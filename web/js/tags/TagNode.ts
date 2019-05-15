import {isPresent} from '../Preconditions';
import {Tag} from './Tag';

export interface MutableTagNode<V> {

    id: number;

    name: string;

    children: Array<MutableTagNode<V>>;

    value: V;

}

export interface TagNode<V> {

    readonly id: number;

    readonly name: string;

    readonly children: ReadonlyArray<TagNode<V>>;

    readonly value: V;

}

export class TagNodes {

    public static create(...tags: ReadonlyArray<Tag>): TagNode<Tag> {

        const tagIndex: {[label: string]: Tag} = {};

        for (const tag of tags) {

            if (! tag.label.startsWith("/")) {
                continue;
            }

            tagIndex[tag.label] = tag;

        }

        const tagNodeIndex = new TagNodeIndex<Tag>();

        // always register a root so we have at least one path
        const root = tagNodeIndex.register('/', '/', {id: '/', label: '/'});

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

class TagNodeIndex<V> {

    private seq: number = 0;

    private index: {[path: string]: MutableTagNode<V>} = {};

    public register(path: string,
                    name: string,
                    value: V): MutableTagNode<V> {

        if (! this.index[path]) {

            this.index[path] = {
                id: this.seq++,
                name,
                children: [],
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
