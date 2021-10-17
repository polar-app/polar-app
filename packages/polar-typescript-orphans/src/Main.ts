import {OrphanFinder} from "./OrphanFinder";

async function doAsync() {

    // TODO: this won't work because we are not finding files properly across modules.

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
