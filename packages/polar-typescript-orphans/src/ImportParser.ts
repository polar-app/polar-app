import {PathStr} from "polar-shared/src/util/Strings";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {Files} from "polar-shared/src/util/Files";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {OrphanFinder} from "./OrphanFinder";
import {Arrays} from "polar-shared/src/util/Arrays";

export namespace ImportParser {

    export function parse(data: string) {

        // const re = /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w_-]+)["'\s].*;$/gm;

        const re = /import(?:["'\s]*([\w*{}\n\r\t$, ]+)from\s*)?["'\s](.*([@\w_-]+))["'\s].*;?$/gm;
        const result = data.matchAll(re);

        if (result) {
            return [...result].map(current => current[2]);
        }

        return [];

    }

    export function accept(importPath: PathStr, moduleIndex: OrphanFinder.IModuleIndex) {

        const importModuleName = Arrays.first(importPath.split('/'));

        if (importModuleName && moduleIndex.hasModule(importModuleName)) {
            // this true because we have to attempt to resolve the path.
            return true;
        }

        return importPath.startsWith("./") || importPath.startsWith("../");

    }

    export async function resolve(importerPath: PathStr,
                                  importPath: PathStr,
                                  moduleIndex: OrphanFinder.IModuleIndex): Promise<PathStr | undefined> {

        const importerPathDirName = FilePaths.dirname(importerPath);

        async function detectPath(potentialPath: PathStr | undefined | null) {

            if (potentialPath === undefined || potentialPath === null) {
                return undefined;
            }

            if (await Files.existsAsync(potentialPath)) {
                return FilePaths.resolve(potentialPath);
            }

            return undefined;

        }

        const promises = [

            detectPath(FilePaths.join(importerPathDirName, importPath)),
            detectPath(FilePaths.join(importerPathDirName, importPath + ".ts")),
            detectPath(FilePaths.join(importerPathDirName, importPath + ".tsx")),

            detectPath(moduleIndex.importModuleToPathMap[importPath]),
            detectPath(moduleIndex.importModuleToPathMap[importPath + ".ts"]),
            detectPath(moduleIndex.importModuleToPathMap[importPath + ".tsx"]),

        ]

        const resolved = await Promise.all(promises);

        return arrayStream(resolved).filterPresent().first();

    }

}
