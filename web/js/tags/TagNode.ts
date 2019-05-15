import {isPresent} from '../Preconditions';

export interface MutableTagNode {

    label: string;

    children: TagNode[];

}

export interface TagNode {

    readonly label: string;

    readonly children: ReadonlyArray<TagNode>;

}

export class TagNodes {

    public static create(...tags: ReadonlyArray<string>): TagNode {

        tags = tags.filter(current => current.startsWith("/"))
                   .sort();

        const index = new TagNodeIndex();

        // always register a root so we have at least one path
        const root = index.register('/', '/');

        for (const tag of tags) {

            const pathEntries = this.split(tag);

            for (const pathEntry of pathEntries) {

                if (pathEntry.parent) {

                    const parent = index.register(pathEntry.parent.path, pathEntry.parent.basename);

                    if (! index.contains(pathEntry.path)) {
                        const newNode = index.register(pathEntry.path, pathEntry.basename);
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

    private index: {[path: string]: MutableTagNode} = {};

    public register(path: string,
                    label: string): MutableTagNode {

        if (! this.index[path]) {

            this.index[path] = {
                label,
                children: []
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
