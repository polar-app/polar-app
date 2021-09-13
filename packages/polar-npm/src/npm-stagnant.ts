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
    readonly name: string;
    readonly peerDependencies: PackageReferenceMap;
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

    console.log("Determining stagnant packages for: " + packageData.name);
    console.log("=======")

    async function getPackageVersionFromNPM(packageName: string) {
        const publishedVersion = await exec(`npm show ${packageName} version`);

        if (publishedVersion.stderr !== '') {
            throw new Error(publishedVersion.stder)
        }

        return publishedVersion.stdout.trim();

    }

    function versionsDiffer(currentSemver: string, nextVersion: string): boolean | undefined {

        if (currentSemver.startsWith('=')) {
            const [prefix, suffix] = currentSemver.split('=');
            return suffix !== nextVersion;
        }

        return undefined;

    }

    async function doPackages(referenceMap: PackageReferenceMap) {

        // TODO: this is SUPER slow and we might have to run multiple npm views at once.

        for(const packageName of Object.keys(referenceMap)) {
            const semVersion = referenceMap[packageName];
            const publishedVersion = await getPackageVersionFromNPM(packageName);

            const verDiff = versionsDiffer(semVersion, publishedVersion);

            const desc = `${packageName} => ${semVersion} vs ${publishedVersion}`;

            if (verDiff === true) {
                console.warn(`${desc}: UPDATE REQUIRED`);
            } else if (verDiff === false) {
                console.warn(`${desc}: OK`);
            } else {
                console.warn(`${desc}: SKIPPED`);
            }

        }

    }

    await doPackages(packageData.dependencies || {});
    await doPackages(packageData.devDependencies || {});
    await doPackages(packageData.peerDependencies || {});

    console.log();

}

main()
    .catch(err => console.error(err))
