#!/usr/bin/env node

// upgrade the current npm package but only if the version number does not equal
// what we're given AND the package has the current version.
//
// this way, via lerna, we can require all packages have the same version
//
// without a version argument, we just return the currently installed version.

import fs from 'fs';
import {Strings} from "polar-shared/src/util/Strings";

function die(msg: string) {
    console.error(msg);
    process.exit(1);
}

type DependencyMap = {[name: string]: string};

interface PackageData {
    readonly dependencies: DependencyMap | null;
    readonly devDependencies: DependencyMap | null;
    readonly peerDependencies: DependencyMap | null;
}

function readPackageData(): PackageData {

    const data = fs.readFileSync('./package.json');
    return JSON.parse(data.toString('utf-8'));

}

function exec() {

    if (! fs.existsSync('./package.json')) {
        die("package.json does not exist");
    }

    const packageData = readPackageData();

    function dumpDeps(deps: DependencyMap | null, type: 'standard' | 'dev' | 'peer') {

        if (! deps) {
            return;
        }

        for(const entry of Object.entries(deps)) {
            const [name, version] = entry;
            console.log(Strings.rpad(name, ' ', 50) + " " + version);
        }

    }

    dumpDeps(packageData.dependencies, 'standard');
    dumpDeps(packageData.devDependencies, 'dev');
    dumpDeps(packageData.peerDependencies, 'peer');

}

exec();
