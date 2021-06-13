#!/usr/bin/env node

import fs from 'fs';

function die(msg: string) {
    console.error(msg);
    process.exit(1);
}

type PackageReferenceMap = {[key: string]: string};

interface PackageData {
    readonly devDependencies: PackageReferenceMap;
    readonly dependencies: PackageReferenceMap;
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

    function doPackages(referenceMap: PackageReferenceMap) {

        for(const packageName of Object.keys(referenceMap)) {
            const semVersion = referenceMap[packageName];
            console.log(`${packageName} => ${semVersion}`);
        }

    }

    doPackages(packageData.dependencies || {});
    doPackages(packageData.devDependencies || {});

}

exec();
