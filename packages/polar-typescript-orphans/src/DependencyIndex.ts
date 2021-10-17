import {PathStr} from "polar-shared/src/util/Strings";
import {SourceType} from "./ISourceReference";

export namespace DependencyIndex {

    export interface IDependencyIndex {

        /**
         * Register a source file so that it has zero references.
         */
        readonly register: (importer: PathStr, type: SourceType) => void;

        /**
         * Register a dep which will increase the dependency account.
         */
        readonly registerDependency: (importer: PathStr, type: SourceType, imported: PathStr) => void;

        readonly computeImportRankings: () => ReadonlyArray<IImportRanking>;
    }

    export interface IImportRanking {
        readonly path: string;
        readonly type: SourceType;
        readonly nrMainRefs: number;
        readonly nrTestRefs: number;
        readonly orphan: boolean;
    }

    export interface IDependencyIndexEntry {

        readonly path: string;
        readonly type: SourceType;
        readonly mainRefs: {[path: string]: true};
        readonly testRefs: {[path: string]: true};

    }

    export function create(): IDependencyIndex {

        const index: {[key: string]: IDependencyIndexEntry} = {};

        function register(importer: PathStr, type: SourceType) {
            index[importer] = {
                path: importer,
                type,
                mainRefs: {},
                testRefs: {}
            };
        }

        function registerDependency(importer: PathStr, type: SourceType, imported: PathStr) {

            if (! index[imported]) {
                index[imported] = {
                    path: imported,
                    type,
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

        function computeImportRankings(): ReadonlyArray<IImportRanking> {

            const imports = Object.values(index).map((current): IImportRanking => {
                const nrMainRefs = Object.values(current.mainRefs).length;
                const nrTestRefs = Object.values(current.testRefs).length;

                const orphan = nrMainRefs === 0 && nrTestRefs <= 1;

                return {
                    path: current.path,
                    type: current.type,
                    nrMainRefs,
                    nrTestRefs,
                    orphan
                }
            })

            return imports.sort((a, b) => b.nrMainRefs - a.nrMainRefs);

        }

        return {register, registerDependency, computeImportRankings};

    }

}
