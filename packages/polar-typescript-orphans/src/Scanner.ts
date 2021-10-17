import {Files} from "polar-shared/src/util/Files";
import {ISourceReference} from "./ISourceReference";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {PathStr} from "polar-shared/src/util/Strings";
import {IModuleReference} from "./IModuleReference";

export namespace Scanner {

    function requireTrailingSlash(path: PathStr) {

        if (! path.endsWith("/")) {
            return path + '/';
        }

        return path;

    }

    export async function doScan(module: IModuleReference): Promise<ReadonlyArray<ISourceReference>> {

        const srcDir = module.srcDir;

        const references: ISourceReference[] = [];

        if (! await Files.existsAsync(srcDir)) {
            throw new Error("Dir does not exist: " + srcDir);
        }

        const dirResolved = requireTrailingSlash(FilePaths.resolve(srcDir));
        const moduleRootDirResolved = requireTrailingSlash(FilePaths.resolve(module.rootDir));

        await Files.recursively(srcDir, async (fullPath, stat) => {

            if (stat.isDirectory()) {
                return;
            }

            const fullPathResolved = FilePaths.resolve(fullPath);

            const modulePath = fullPathResolved.substring(moduleRootDirResolved.length);
            const sourcePath = fullPathResolved.substring(dirResolved.length)

            references.push({
                module: module.name,
                dir: dirResolved,
                modulePath,
                sourcePath,
                fullPath
            })

        });

        return references;

    }

}
