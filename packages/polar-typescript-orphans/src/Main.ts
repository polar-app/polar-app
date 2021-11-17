import {OrphanFinder} from "./OrphanFinder";
import {Files} from "polar-shared/src/util/Files";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import * as fs from "fs";
import {PathStr} from "polar-shared/src/util/Strings";
import {IModuleReference} from "./IModuleReference";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {TextGrid} from "polar-shared/src/util/TextGrid";

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

                return {
                    stat,
                    path: FilePaths.resolve(path),
                    basename
                };

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
                          rootDir: moduleRoot.dir,
                          srcDir: current
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

    function createModuleReport() {

        const sorted = [...modules].sort((a, b) => a.name.localeCompare(b.name));

        const grid = TextGrid.create(2);
        grid.headers('name', 'dir');

        sorted.forEach(current => grid.row(current.name, current.srcDir));

        return grid.format();

    }

    // console.log("Working with the following modules: ")
    // console.log("====================================")
    // console.log(createModuleReport());

    // NOTE: This won't work well with stories (for now) because they're tightly
    // bound against StoryApp.tsx.  This will be fixed when we migrate to
    // storybook

    const testsFilter = [
        "Test\.ts$",
        "TestN\.ts$",
        "TestK\.ts$",
        "TestNK\.ts$",
        "TestKN\.ts$",
        // "Story\.tsx$",
    ]

    const entriesFilter = [
        "\/entry\.tsx?$",
        "\/index\.tsx?$",
        'login\.ts$',
        'service-worker-registration\.ts$'
    ];

    await OrphanFinder.doFind({ modules, entriesFilter, testsFilter });

}

doAsync().catch(err => console.error(err));
