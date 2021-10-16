import {IModuleReference} from "./IModuleReference";
import {DependencyIndex} from "./DependencyIndex";
import {Scanner} from "./Scanner";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export namespace OrphanFinder {

    export async function doFind(modules: ReadonlyArray<IModuleReference>) {

        const dependencyIndex = DependencyIndex.create();

        async function computeSourceReferences() {

            console.log("Scanning modules...")

            const promises = modules.map(module => Scanner.doScan(module.name, module.dir))

            const references = await Promise.all(promises);

            return arrayStream(references)
                      .flatMap(current => current)
                      .collect()

            // console.log("Scanning modules...done")

        }

        const sourceReferences = computeSourceReferences();



    }

}
