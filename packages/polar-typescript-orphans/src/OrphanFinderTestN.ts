import {OrphanFinder} from "./OrphanFinder";
import PathRegexStr = OrphanFinder.PathRegexStr;

describe("OrphanFinder", function () {

    this.timeout(120000);

    describe("_computeSourceReferences", () => {

        xit("basic", async () => {

            // const sourceReferences = await OrphanFinder._computeSourceReferences([{
            //     name: 'polar-bookshelf',
            //     dir: '/Users/burton/projects/polar-app/packages/polar-bookshelf/web/js'
            // }])
            //
            // console.log(sourceReferences)

        });
    });

    describe("doFind", () => {

        xit("basic", async () => {

            const modules = [
                {
                    name: 'polar-bookshelf',
                    dir: '/Users/burton/projects/polar-app/packages/polar-bookshelf/web/js'
                },
                {
                    name: 'polar-bookshelf',
                    dir: '/Users/burton/projects/polar-app/packages/polar-bookshelf/apps'
                }

            ];

            const orphanFilter: ReadonlyArray<PathRegexStr> = [
                // test code...
                "Test.ts$",
                "TestN.ts$",
                "TestK.ts$",
                "TestNK.ts$",
                "TestKN.ts$",
                // the entry points for our apps.
                "\/entry\.ts$",
                "\/index\.ts$"
            ];

            // await OrphanFinder.doFind({modules, orphanFilter})

        });
    });


})
