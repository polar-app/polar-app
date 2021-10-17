import {OrphanFinder} from "./OrphanFinder";
import PathRegexStr = OrphanFinder.PathRegexStr;

async function doAsync() {

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
        "\/entry\.tsx?$",
        "\/index\.tsx?$",
        'login\.ts$',
        'service-worker-registration\.ts$'
    ];

    await OrphanFinder.doFind({modules, orphanFilter});

}

doAsync().catch(err => console.error(err));
