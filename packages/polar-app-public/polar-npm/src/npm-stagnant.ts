#!/usr/bin/env node

import fs from 'fs';
import { promisify } from 'util';

const exec = promisify(require('child_process').exec)

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

async function main() {

    if (! fs.existsSync('./package.json')) {
        die("package.json does not exist");
    }

    const packageData = readPackageData();

    async function getPackageVersionFromNPM(packageName: string) {
        const publishedVersion = await exec(`npm show ${packageName} version`);

        if (publishedVersion.stderr !== '') {
            throw new Error(publishedVersion.stder)
        }

        return publishedVersion.stdout.trim();

    }

    async function doPackages(referenceMap: PackageReferenceMap) {

        for(const packageName of Object.keys(referenceMap)) {
            const semVersion = referenceMap[packageName];
            const publishedVersion = await getPackageVersionFromNPM(packageName);
            console.log(`${packageName} => ${semVersion} vs ${publishedVersion}`);
        }

    }

    await doPackages(packageData.dependencies || {});
    await doPackages(packageData.devDependencies || {});

}

main()
    .catch(err => console.error(err))
