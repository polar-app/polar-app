import {IModuleReference} from "./IModuleReference";
import {DependencyIndex} from "./DependencyIndex";
import {Scanner} from "./Scanner";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {ISourceReference, ISourceReferenceWithType, SourceType} from "./ISourceReference";
import {Files} from "polar-shared/src/util/Files";
import {ImportParser} from "./ImportParser";
import {PathStr} from "polar-shared/src/util/Strings";
import {TextGrid} from "polar-shared/src/util/TextGrid";
import {Predicates} from "polar-shared/src/util/Predicates";
import {PathRegexFilterPredicates} from "./PathRegexFilterPredicates";

export namespace OrphanFinder {

    export async function _computeSourceReferences(modules: ReadonlyArray<IModuleReference>) {

        const promises = modules.map(module => Scanner.doScan(module))

        const references = await Promise.all(promises);

        return arrayStream(references)
            .flatMap(current => current)
            .collect()

    }

    export function _filterSourceReferences(sourceReferences: ReadonlyArray<ISourceReference>, predicate: Predicates.Predicate<PathStr>) {

        return sourceReferences.filter(current => predicate(current.fullPath));

    }

    /**
     * Given a path to a file, determine which type it is.
     */
    export type SourceTypeClassifier = (path: PathStr) => SourceType;

    export async function _computeSourceReferencesForTypescriptFiles(modules: ReadonlyArray<IModuleReference>,
                                                                     classifier: SourceTypeClassifier): Promise<ReadonlyArray<ISourceReferenceWithType>> {

        const sourceReferences = await _computeSourceReferences(modules);

        const typescriptFilePredicate = (path: string): boolean => {

            if (path.endsWith(".d.ts")) {
                return false;
            }

            return path.endsWith(".ts") || path.endsWith(".tsx");

        }

        return sourceReferences.filter(current => typescriptFilePredicate(current.fullPath))
                               .map(current => {
                                   const type = classifier(current.fullPath);
                                   return {...current, type};
                               });

    }

    async function computeTypescriptImports(sourceReference: ISourceReference, moduleIndex: IModuleIndex) {

        const buff = await Files.readFileAsync(sourceReference.fullPath);
        const content = buff.toString("utf-8");

        const imported = ImportParser.parse(content)
            .filter(current => ImportParser.accept(current, moduleIndex));

        return imported;

    }

    async function resolveTypescriptImports(sourceReference: ISourceReference,
                                            moduleIndex: OrphanFinder.IModuleIndex): Promise<ReadonlyArray<PathStr>> {

        const imports = await computeTypescriptImports(sourceReference, moduleIndex);

        const promises = imports.map(current => ImportParser.resolve(sourceReference.fullPath, current, moduleIndex));
        const resolved = await Promise.all(promises);

        const imported = arrayStream(resolved)
            .filterPresent()
            .collect();

        return imported;
    }

    export interface IImport {
        readonly importer: PathStr;
        readonly type: SourceType;
        readonly imported: PathStr;
    }

    async function _computeImportsForSourceReference(sourceReference: ISourceReferenceWithType,
                                                     moduleIndex: OrphanFinder.IModuleIndex): Promise<ReadonlyArray<OrphanFinder.IImport>> {

        const resolvedTypescriptImports = await resolveTypescriptImports(sourceReference, moduleIndex);
        const importer = sourceReference.fullPath;
        return resolvedTypescriptImports.map(imported => ({importer, type: sourceReference.type, imported}));

    }

    export interface IModuleIndex {

        readonly hasModule: (moduleName: string) => boolean;

        readonly importModuleToPathMap: Readonly<MutableImportModuleToPathMap>;

    }

    /**
     * Compute a map between the module path foo/bar/cat/ to the local FS path.
     */
    export type MutableImportModuleToPathMap = {[path: string]: string}

    function computeImportModuleToPathMap(sourceReferences: ReadonlyArray<ISourceReference>): Readonly<MutableImportModuleToPathMap> {

        const map: {[path: string]: string} = {}

        sourceReferences.forEach(sourceReference => map[`${sourceReference.module}/${sourceReference.modulePath}`] = sourceReference.fullPath);

        return map;

    }

    function computeModuleIndex(sourceReferences: ReadonlyArray<ISourceReference>): IModuleIndex {

        function computeModuleNamesIndex() {

            return arrayStream(sourceReferences)
                .map(current => current.module)
                .toMap2(key => key, () => true)

        }

        const moduleNamedIndex = computeModuleNamesIndex();

        const hasModule = (moduleName: string): boolean => moduleNamedIndex[moduleName];

        const importModuleToPathMap = computeImportModuleToPathMap(sourceReferences);

        return {hasModule, importModuleToPathMap};

    }

    async function computeImports(sourceReferences: ReadonlyArray<ISourceReferenceWithType>): Promise<ReadonlyArray<IImport>> {

        const moduleIndex = computeModuleIndex(sourceReferences);

        const promises = sourceReferences.map(current => _computeImportsForSourceReference(current, moduleIndex));

        const resolved = await Promise.all(promises);

        return arrayStream(resolved)
                   .flatMap(current => current)
                   .collect();

    }

    export type PathRegexStr = string;

    interface IDoFindOpts {

        /**
         * Patterns for test files which are handled differently.
         */
        readonly testsFilter?: ReadonlyArray<PathRegexStr>

        /**
         * Files that match this pattern can't actually be orphans but CAN count
         * towards imports as they are just entry points.
         */
        readonly entriesFilter?: ReadonlyArray<PathRegexStr>;

        readonly modules: ReadonlyArray<IModuleReference>;
    }

    export async function doFind(opts: IDoFindOpts) {

        const {modules} = opts;

        const entriesFilter = opts.entriesFilter || [];
        const testsFilter = opts.testsFilter || [];

        const dependencyIndex = DependencyIndex.create();

        console.log("Scanning modules...")

        const sourceTypeClassifier = (path: PathStr) => {

            const testPredicate = PathRegexFilterPredicates.createMatchAny(testsFilter);

            if (testPredicate(path)) {
                return 'test';
            } else {
                return 'main';
            }

        }

        const sourceReferences = await _computeSourceReferencesForTypescriptFiles(modules, sourceTypeClassifier);

        // *** the main source references is the actual source code, not including tests.

        function computeMainSourceReferences() {

            const predicate = Predicates.not(PathRegexFilterPredicates.createMatchAny([...entriesFilter, ...testsFilter]));
            return _filterSourceReferences(sourceReferences, predicate);

        }
        //
        // function computeTestSourceReferences() {
        //
        //     const predicate = PathRegexFilterPredicates.createMatchAny([...orphanFilter, ...testsFilter]);
        //     return _filterSourceReferences(sourceReferences, predicate);
        //
        // }

        const mainSourceReferences = computeMainSourceReferences();
        // const testSourceReferences = computeTestSourceReferences();

        console.log(`Scanning modules...done (found ${sourceReferences.length} source references)`);

        console.log("Scanning imports...")

        // Note that these imports have to be computed over the
        // mainSourceReferences NOT the sourceReferences because unit tests
        // shouldn't count against ref numbers because if they do then we would
        // never get down to zero and they would never be orphans.
        const imports = await computeImports(sourceReferences);

        console.log(`Scanning imports...done (found ${imports.length} imports)`);

        // ** register all files so that they get a ref count of zero..
        sourceReferences
            .forEach(current => dependencyIndex.register(current.fullPath, current.type));

        // *** this should register all the imports...
        imports.map(current => dependencyIndex.registerDependency(current.importer, current.type, current.imported))

        // *** now we just need to score them..
        const importRankings = dependencyIndex.computeImportRankings();

        function createImportRankingsReport() {

            const grid = TextGrid.create(4);

            const entriesPredicate = PathRegexFilterPredicates.createMatchAny(entriesFilter);

            grid.headers("path", "main refs", "test refs", "orphan");
            importRankings
                .filter(current => current.type === 'main')
                .filter(current => ! entriesPredicate(current.path))
                .forEach(current => grid.row(current.path, current.nrMainRefs, current.nrTestRefs, current.orphan));

            return grid.format();

        }

        console.log(createImportRankingsReport());

        interface IOrphanTest {
            readonly path: PathStr;
            readonly imported: PathStr;
        }

        function computeOrphanTests(): ReadonlyArray<IOrphanTest> {

            return arrayStream(importRankings)
                .filter(current => current.orphan)
                .filter(current => current.nrTestRefs === 1)
                .map((current): IOrphanTest => {
                    return {
                        path: current.testRefs[0],
                        imported: current.path
                    }
                })
                .collect()

        }

        function computeOrphanTestsReport() {
            const orphanTest = computeOrphanTests();
            const grid = TextGrid.create(3);
            grid.headers('path', 'imported', 'orphan');
            orphanTest.forEach(current => grid.row(current.path, current.imported, true))
            return grid.format();
        }

        console.log("Orphan tests: ================")
        console.log(computeOrphanTestsReport());

    }

}

