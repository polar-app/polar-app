import {PathStr} from "polar-shared/src/util/Strings";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {Files} from "polar-shared/src/util/Files";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

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

    export function accept(importPath: PathStr) {
        return importPath.startsWith("./") || importPath.startsWith("../");
    }

    export async function resolve(importerPath: PathStr, importPath: PathStr): Promise<PathStr | undefined> {

        const importerPathDirName = FilePaths.dirname(importerPath);

        async function detectPath(potentialPath: PathStr) {

            if (await Files.existsAsync(potentialPath)) {
                return FilePaths.resolve(potentialPath);
            }

            return undefined;

        }

        const promises = [
            detectPath(FilePaths.join(importerPathDirName, importPath)),
            detectPath(FilePaths.join(importerPathDirName, importPath + ".ts")),
            detectPath(FilePaths.join(importerPathDirName, importPath + ".tsx")),
        ]

        const resolved = await Promise.all(promises);

        return arrayStream(resolved).filterPresent().first();

    }

}
