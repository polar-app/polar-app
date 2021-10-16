import {ArrayListMultimap} from "polar-shared/src/util/Multimap";
import {PathStr} from "polar-shared/src/util/Strings";

export namespace DependencyIndex {

    export interface IDependencyIndex {
        readonly registerDependency: (importer: PathStr, imported: PathStr) => void;
        readonly computeRanking: () => ReadonlyArray<IImportReference>;
    }

    export interface IImportReference {
        readonly path: string;
        readonly refs: number;
    }

    export function create(): IDependencyIndex {

        const multimap = new ArrayListMultimap<PathStr, PathStr>();

        function registerDependency(importer: PathStr, imported: PathStr) {
            multimap.put(imported, importer);
        }

        function computeRanking() {

            let refs = multimap.keys().map((key): IImportReference => ({
                path: key,
                refs: multimap.get(key).length
            }));

            return refs.sort((a, b) => b.refs - a.refs);

        }

        return {registerDependency, computeRanking};

    }

}
