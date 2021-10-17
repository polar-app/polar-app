import {PathStr} from "polar-shared/src/util/Strings";
import {SourceType} from "./ISourceReference";

export namespace DependencyIndex {

    export interface IDependencyIndex {

        /**
         * Register a source file so that it has zero references.
         */
        readonly register: (importer: PathStr) => void;

        /**
         * Register a dep which will increase the dependency account.
         */
        readonly registerDependency: (importer: PathStr, type: SourceType, imported: PathStr) => void;

        readonly computeImportRankings: () => ReadonlyArray<IImportRanking>;
    }

    export interface IImportRanking {
        readonly path: string;
        readonly mainRefs: number;
        readonly testRefs: number;
    }

    export interface IDependencyIndexEntry {

        readonly path: string;
        readonly mainRefs: {[path: string]: true};
        readonly testRefs: {[path: string]: true};

    }

    export function create(): IDependencyIndex {

        const index: {[key: string]: IDependencyIndexEntry} = {};

        function register(importer: PathStr) {
            index[importer] = {
                path: importer,
                mainRefs: {},
                testRefs: {}
            };
        }

        function registerDependency(importer: PathStr, type: SourceType, imported: PathStr) {

            if (! index[imported]) {
                index[imported] = {
                    path: imported,
                    mainRefs: {},
                    testRefs: {}
                }
            }

            switch (type) {
                case "main":
                    index[imported].mainRefs[importer] = true;
                    break;
                case "test":
                    index[imported].testRefs[importer] = true;
                    break;

            }

        }

        function computeRanking() {

            const imports = Object.values(index).map(current => {
                return {
                    path: current.path,
                    mainRefs: Object.values(current.mainRefs).length,
                    testRefs: Object.values(current.testRefs).length
                }
            })

            return imports.sort((a, b) => b.mainRefs - a.mainRefs);

        }

        return {register, registerDependency, computeImportRankings: computeRanking};

    }

}
