import {Files} from "polar-shared/src/util/Files";
import {ISourceReference} from "./ISourceReference";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {PathStr} from "polar-shared/src/util/Strings";

export namespace Scanner {

    function requireTrailingSlash(path: PathStr) {

        if (! path.endsWith("/")) {
            return path + '/';
        }

        return path;

    }

    export async function doScan(module: string, dir: string): Promise<ReadonlyArray<ISourceReference>> {

        const references: ISourceReference[] = [];

        if (! await Files.existsAsync(dir)) {
            throw new Error("Dir does not exist: " + dir);
        }

        const dirResolved = requireTrailingSlash(FilePaths.resolve(dir));

        await Files.recursively(dir, async (fullPath, stat) => {

            if (stat.isDirectory()) {
                return;
            }

            const fullPathResolved = FilePaths.resolve(fullPath);

            const path = fullPathResolved.substring(dirResolved.length)

            references.push({
                module, dir: dirResolved, path
            })

        });

        return references;

    }

}
