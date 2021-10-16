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


    async function computeTypescriptImports(sourceReference: ISourceReference) {

        const buff = await Files.readFileAsync(sourceReference.fullPath);
        const content = buff.toString("utf-8");

        return ImportParser.parse(content)
            .filter(ImportParser.accept);

    }

    async function resolveTypescriptImports(sourceReference: ISourceReference): Promise<ReadonlyArray<PathStr>> {

        const imports = await computeTypescriptImports(sourceReference);

        const promises = imports.map(current => ImportParser.resolve(sourceReference.fullPath, current));
        const resolved = await Promise.all(promises);

        return arrayStream(resolved)
            .filterPresent()
            .collect();

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

    export async function doFind(modules: ReadonlyArray<IModuleReference>) {

        const dependencyIndex = DependencyIndex.create();

        console.log("Scanning modules...")

        const sourceReferences = await _computeSourceReferences(modules);

        console.log(`Scanning modules...done (found ${sourceReferences.length} source references)`);

        console.log("Scanning imports...")

        const imports = await computeImports(sourceReferences);

        console.log(`Scanning imports...done (found ${imports.length} imports)`);

        // this should register all the imports... now we just need to score them..
        imports.map(current => dependencyIndex.registerDependency(current.importer, current.imported))

        const ranking = dependencyIndex.computeRanking();

        const grid = TextGrid.create(2);

        grid.headers("path", "refs");
        ranking.map(current => grid.row(current.path, current.refs));

        console.log(grid.format());

    }

}
