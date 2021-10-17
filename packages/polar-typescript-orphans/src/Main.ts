import {OrphanFinder} from "./OrphanFinder";
import {Files} from "polar-shared/src/util/Files";
import { FilePaths } from "polar-shared/src/util/FilePaths";
import * as fs from "fs";
import {PathStr} from "polar-shared/src/util/Strings";
import {IModuleReference} from "./IModuleReference";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

async function doAsync() {

    async function computeModules(rootDir: string): Promise<ReadonlyArray<IModuleReference>> {

        interface IModuleRoot {
            readonly name: string;
            readonly dir: string;
        }

        async function computeModuleRoots(): Promise<ReadonlyArray<IModuleRoot>> {

            const dirEntries = await Files.readdirAsync(rootDir);

            interface PathStat {
                readonly path: PathStr;
                readonly basename: string;
                readonly stat: fs.Stats;
            }

            async function pathStat(path: PathStr): Promise<PathStat> {

                const stat = await Files.statAsync(path);
                const basename = FilePaths.basename(path);
                return {stat, path, basename};

            }

            const promises =
                dirEntries.map(current => FilePaths.join(rootDir, current))
                    .map(current => pathStat(current));

            const stats = await Promise.all(promises);
            function toModuleReference(pathStat: PathStat): IModuleRoot {
                return {
                    name: pathStat.basename,
                    dir: pathStat.path
                }
            }

            return stats.filter(current => current.stat.isDirectory())
                        .filter(current => current.basename !== '.' && current.basename !== '..')
                        .map(toModuleReference);

        }

        async function computeSourceDirectoriesForModuleRoot(moduleRoot: IModuleRoot) {

            async function testDirectory(path: PathStr): Promise<PathStr | undefined> {
                if (await Files.existsAsync(path)) {
                    return path;
                }

                return undefined;
            }

            const srcDirs = ['src', 'apps', FilePaths.join('web', 'js')];

            const dirs = srcDirs.map(current => FilePaths.join(moduleRoot.dir, current));

            const promises = dirs.map(testDirectory);

            const tested = await Promise.all(promises);

            return arrayStream(tested)
                      .filterPresent()
                      .map((current): IModuleReference => ({
                          name: moduleRoot.name,
                          dir: current
                      }))
                      .collect();

        }

        async function computeSourceDirectories(): Promise<ReadonlyArray<IModuleReference>> {

            const moduleRoots = await computeModuleRoots();

            const promises = moduleRoots.map(computeSourceDirectoriesForModuleRoot);

            return arrayStream(await Promise.all(promises))
                      .flatMap(current => current)
                      .collect();

        }

        return await computeSourceDirectories();
    }
    //
    // const modules: ReadonlyArray<IModuleReference> = [
    //     {
    //         name: 'polar-bookshelf',
    //         dir: '/Users/burton/projects/polar-app/packages/polar-bookshelf/web/js'
    //     },
    //     {
    //         name: 'polar-bookshelf',
    //         dir: '/Users/burton/projects/polar-app/packages/polar-bookshelf/apps'
    //     }
    //
    // ];

    const modules = await computeModules("./packages");

    const orphanFilter = [
        "Test.ts$",
        "TestN.ts$",
        "TestK.ts$",
        "TestNK.ts$",
        "TestKN.ts$",
        "\/entry\.tsx?$",
        "\/index\.tsx?$",
        'login\.ts$',
        'service-worker-registration\.ts$'
    ];

    await OrphanFinder.doFind({ modules, orphanFilter });

}

doAsync().catch(err => console.error(err));
