// do a report on node modules to find duplicate dependencies

const fs = require('fs');

function load(path) {
    return JSON.parse(fs.readFileSync(path));
}

/**
 * Find only subdirs of the given path as a list.
 */
function subdirs(dir) {

    const result = [];

    const files = fs.readdirSync(dir);
    for (const file of files) {
        const path = `${dir}/${file}`;
        const stat = fs.statSync(path);
        if (stat.isDirectory()) {
            result.push(path);
        }
    }

    return result;

}

/**
 * Simple/basic blob expand
 */
function expand(path) {

    if (path.endsWith("/*")) {
        const dir = path.replace(/..$/, "");
        return subdirs(dir);
    }

    return [path];

}

function loadLernaConf() {
    return load('./lerna.json');

}

function findPackageDirs() {

    const lerna = loadLernaConf();

    const result = [];
    for (const pack of lerna.packages) {
        result.push(...expand(pack));
    }

    return result;

}

function findPackageJSON() {

    const result = [];

    const packageDirs = findPackageDirs();

    for (const packageDir of packageDirs) {
        const path = `${packageDir}/package.json`;

        if (fs.existsSync(path)) {
            result.push(path);
        }
    }
    return result;

}


function findPackageVersionConflicts() {

    const packageFiles = findPackageJSON();

    for (const packageFile of packageFiles) {
        const packages = load(packageFile);
        console.log(packages);
    }

}

findPackageVersionConflicts();
