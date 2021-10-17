import {PathStr} from "polar-shared/src/util/Strings";

export namespace DependencyIndex {

    export interface IDependencyIndex {

        /**
         * Register a source file so that it has zero references.
         */
        readonly register: (importer: PathStr) => void;

        /**
         * Register a dep which will increase the dependency account.
         */
        readonly registerDependency: (importer: PathStr, imported: PathStr) => void;

        readonly computeRanking: () => ReadonlyArray<IImportRanking>;
    }

    export interface IImportRanking {
        readonly path: string;
        readonly refs: number;
    }

    export function create(): IDependencyIndex {

        const index: {[key: string]: {[path: string]: boolean}} = {};

        function register(importer: PathStr) {
            index[importer] = {};
        }

        function registerDependency(importer: PathStr, imported: PathStr) {

            if (! index[imported]) {
                index[imported] = {}
            }

            index[imported][importer] = true;
        }

        function computeRanking() {

            const refs = Object.keys(index).map((key): IImportRanking => ({
                path: key,
                refs: Object.keys(index[key]).length
            }));

            return refs.sort((a, b) => b.refs - a.refs);

        }

        return {register, registerDependency, computeRanking};

    }

}
