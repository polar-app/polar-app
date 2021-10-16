import {OrphanFinder} from "./OrphanFinder";

describe("OrphanFinder", function () {

    this.timeout(600000);

    describe("_computeSourceReferences", () => {

        it("basic", async () => {

            const sourceReferences = await OrphanFinder._computeSourceReferences([{
                name: 'polar-bookshelf',
                dir: '/Users/burton/projects/polar-app/packages/polar-bookshelf/web/js'
            }])

            console.log(sourceReferences)

        });
    });

    describe("doFind", () => {

        it("basic", async () => {

            await OrphanFinder.doFind([{
                name: 'polar-bookshelf',
                dir: '/Users/burton/projects/polar-app/packages/polar-bookshelf/web/js'
            }])


        });
    });


})
