import {IModuleReference} from "./IModuleReference";
import {DependencyIndex} from "./DependencyIndex";
import {Scanner} from "./Scanner";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {ISourceReference} from "./ISourceReference";
import {Files} from "polar-shared/src/util/Files";
import {ImportParser} from "./ImportParser";
import {PathStr} from "polar-shared/src/util/Strings";
import {TextGrid} from "polar-shared/src/util/TextGrid";

export namespace OrphanFinder {

    export async function _computeSourceReferences(modules: ReadonlyArray<IModuleReference>) {

        const promises = modules.map(module => Scanner.doScan(module.name, module.dir))

        const references = await Promise.all(promises);

        return arrayStream(references)
            .flatMap(current => current)
            .collect()

    }

    export function _filterSourceReferences(sourceReferences: ReadonlyArray<ISourceReference>, filters: ReadonlyArray<PathRegexStr>) {

        const notFilteredPredicate = (path: string): boolean => {
            return filters.filter(filter => path.match(filter)).length === 0;
        }

        return sourceReferences.filter(current => notFilteredPredicate(current.fullPath));

    }

    export async function _computeSourceReferencesForTypescriptFiles(modules: ReadonlyArray<IModuleReference>) {
        const sourceReferences = await _computeSourceReferences(modules);

        const typescriptFilePredicate = (path: string): boolean => {

            if (path.endsWith(".d.ts")) {
                return false;
            }

            return path.endsWith(".ts") || path.endsWith(".tsx");

        }

        return sourceReferences.filter(current => typescriptFilePredicate(current.fullPath));

    }

    async function computeTypescriptImports(sourceReference: ISourceReference) {

        const buff = await Files.readFileAsync(sourceReference.fullPath);
        const content = buff.toString("utf-8");

        const imported = ImportParser.parse(content)
            .filter(ImportParser.accept);

        return imported;

    }

    async function resolveTypescriptImports(sourceReference: ISourceReference): Promise<ReadonlyArray<PathStr>> {

        const imports = await computeTypescriptImports(sourceReference);

        const promises = imports.map(current => ImportParser.resolve(sourceReference.fullPath, current));
        const resolved = await Promise.all(promises);

        const imported = arrayStream(resolved)
            .filterPresent()
            .collect();

        return imported;
    }

    export interface IImport {
        readonly importer: PathStr;
        readonly imported: PathStr;
    }

    async function _computeImportsForSourceReference(sourceReference: ISourceReference): Promise<ReadonlyArray<IImport>> {
        const resolvedTypescriptImports = await resolveTypescriptImports(sourceReference);
        const importer = sourceReference.fullPath;
        return resolvedTypescriptImports.map(imported => ({importer, imported}));
    }

    async function computeImports(sourceReferences: ReadonlyArray<ISourceReference>): Promise<ReadonlyArray<IImport>> {

        const promises = sourceReferences.map(current => _computeImportsForSourceReference(current));

        const resolved = await Promise.all(promises);

        return arrayStream(resolved)
                   .flatMap(current => current)
                   .collect();

    }

    export type PathRegexStr = string;

    interface IDoFindOpts {

        /**
         * Files that match this pattern can't actually be orphans but CAN count
         * towards imports.
         */
        readonly orphanFilter?: ReadonlyArray<PathRegexStr>
        readonly modules: ReadonlyArray<IModuleReference>;
    }

    export async function doFind(opts: IDoFindOpts) {

        const {modules} = opts;

        const orphanFilter = opts.orphanFilter || [];

        const dependencyIndex = DependencyIndex.create();

        console.log("Scanning modules...")

        const sourceReferences = await _computeSourceReferencesForTypescriptFiles(modules);

        console.log(`Scanning modules...done (found ${sourceReferences.length} source references)`);

        console.log("Scanning imports...")

        const imports = await computeImports(sourceReferences);

        console.log(`Scanning imports...done (found ${imports.length} imports)`);

        // ** register all files so that they get a ref count of zero..
        _filterSourceReferences(sourceReferences, orphanFilter)
            .map(current => dependencyIndex.register(current.fullPath));

        // *** this should register all the imports...
        imports.map(current => dependencyIndex.registerDependency(current.importer, current.imported))

        // *** now we just need to score them..
        const ranking = dependencyIndex.computeRanking();

        const grid = TextGrid.create(2);

        grid.headers("path", "refs");
        ranking.map(current => grid.row(current.path, current.refs));

        console.log(grid.format());

    }

}
